import logging, os, sys
sys.path.insert(0, "scrapers/selenium")
import config
import scraper_23andme
from flask import Flask
from flask import render_template as _render_template
from flask import jsonify, redirect, request, url_for
from flaskext.csrf import csrf
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from flask.ext.runner import Runner
from flask.ext.security import Security, SQLAlchemyUserDatastore, \
    UserMixin, RoleMixin, login_required, current_user, forms
from selenium import webdriver

# @app.context_processor
# def template_extras():
#     return dict(
#         google_analytics_id=app.config.get('GOOGLE_ANALYTICS_ID', None))
# Augment Flask's render_template with variables we want available everywhere
def render_template(template_name, **kwargs):
    default_args = {
        "user":current_user,
        "login_user_form": security.login_form(),
        "register_user_form": security.register_form()
    }
    template_args = dict(kwargs.items() + default_args.items())
    return _render_template(template_name,**template_args)

# Create app
app = Flask(__name__)
app.config.from_object(config)

from flask_wtf.csrf import CsrfProtect
# CsrfProtect(app)
# csrf(app)

mail = Mail(app)
app.extensions['mail'] = mail

# Create database connection object
db = SQLAlchemy(app)

# Define models
roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    privacySetting = db.Column(db.String(80))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# Create a user to test with
@app.before_first_request
def create_user():
    from datetime import datetime
    user = User.query.filter(User.email=='me@paulsawaya.com').first()
    # Don't create a new user obj if one already exists.
    if user: return
    db.create_all()
    user_datastore.create_user(email='me@paulsawaya.com', password='batman',confirmed_at=datetime.now())
    db.session.commit()


@app.route('/server/services.json')
def servicesjson():
    if not current_user.is_authenticated():
        return jsonify(dict(
            error="You aren't authorized to view this."
        ))
    return render_template('services.json')

@login_required
@app.route('/server/connect/23andme/1', methods=['POST'])
def connect_23andme():
    # todo: link this browser instance with the one that finishes the request
    browser = webdriver.PhantomJS('phantomjs')
    question = scraper_23andme.getSecretQuestion(browser, request.json['scrapeEmail'], request.json['scrapePassword'])
    return question

@login_required
@app.route('/server/privacySetting', methods=['POST'])
def privacy_setting():
    current_user.privacySetting = request.form['privacySetting'];
    db.session.commit()
    return 'ok'


#    link, cookies = scraper_23andme.runSelenium(
#    print "Successfully ran selenium"
#    scraper_23andme.makeRequest(link, cookies)
#    return "Success!"

if __name__ == '__main__':
    app.config.update(DEBUG=True,PROPAGATE_EXCEPTIONS=True,TESTING=True)
    logging.basicConfig(level=logging.DEBUG)
    from social_login import social_login
    app.register_blueprint(social_login)

    # app.run()
    runner = Runner(app)
    runner.run()
