import logging
import sys
import os

from db import UserRepository
from flask import Flask
from flask import render_template as _render_template
from flask.ext.mail import Mail
from flask.ext.security import Security, login_required, current_user
from selenium import webdriver
from flask import jsonify, request
from flask.ext.sqlalchemy import SQLAlchemy
import config
import auth


sys.path.insert(0, "scrapers/selenium")
import scraper_23andme

db = SQLAlchemy()

# Create app
app = Flask(__name__)
app.config.from_object(config)
app.config.update(DEBUG=True, PROPAGATE_EXCEPTIONS=True, TESTING=True)

LOG_FILE = '/opt/apollo/server/log/api.log'
if os.path.exists(LOG_FILE):
    logging.basicConfig(level=logging.DEBUG, filename=LOG_FILE)
else:
    logging.basicConfig(level=logging.DEBUG)
logging.info('Starting server ...')


# from flask.ext.wtf import CsrfProtect
# CsrfProtect(app)
# csrf(app)


mail = Mail(app)
app.extensions['mail'] = mail

user_repository = UserRepository(app)
security = Security(app, user_repository.user_datastore)

auth.user_repository = user_repository
app.register_blueprint(auth.social_login)


@app.route('/')
def index():
    return 'API: is running.'

# Create a user to test with
@app.before_first_request
def create_user():
    username = 'Paul'
    email = 'me@paulsawaya.com'
    password = 'batman'
    logging.info('Creating default user ...')
    if not user_repository.login(email, password):
        user_repository.register(username, email, password)
        logging.info('User created')
    logging.info('User already exists')


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
    current_user.privacy_setting = request.form['privacySetting'];
    db.session.commit()
    return 'ok'


#    link, cookies = scraper_23andme.runSelenium(
#    print "Successfully ran selenium"
#    scraper_23andme.makeRequest(link, cookies)
#    return "Success!"

def render_template(template_name, **kwargs):
    default_args = {
        "user": current_user,
        "login_user_form": security.login_form(),
        "register_user_form": security.register_form()
    }
    template_args = dict(kwargs.items() + default_args.items())
    return _render_template(template_name, **template_args)


# Augment Flask's render_template with variables we want available everywhere
# @app.context_processor
# def template_extras():
#     return dict(
#         google_analytics_id=app.config.get('GOOGLE_ANALYTICS_ID', None))


if __name__ == '__main__':
    app.run()
