import logging
import sys
import os

from db import UserRepository
from flask import Flask, make_response, render_template
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

mail = Mail(app)
app.extensions['mail'] = mail

user_repository = UserRepository(app)
#the security state is returned from init_app
security = Security().init_app(app, user_repository.user_datastore)
auth.user_repository = user_repository
app.register_blueprint(auth.social_login)


@app.route('/')
def index():
    return 'API: is running.'


@app.route('/server/services.json')
@login_required
def servicesjson():
    return render_template('services.json')


@app.route('/server/connect/23andme/1', methods=['POST'])
@login_required
def connect_23andme():
    # todo: link this browser instance with the one that finishes the request
    browser = webdriver.PhantomJS('phantomjs')
    question = scraper_23andme.getSecretQuestion(browser, request.json['scrapeEmail'], request.json['scrapePassword'])
    return question


@app.route('/server/privacySetting', methods=['POST'])
@login_required
def privacy_setting():
    current_user.privacy_setting = request.form['privacySetting']
    db.session.commit()
    return 'ok'


@security.login_manager.unauthorized_handler
def unauthorized():
    return make_response(jsonify({'error': 'Forbidden.'}), 403)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found.'}), 404)


if __name__ == '__main__':
    app.run()
