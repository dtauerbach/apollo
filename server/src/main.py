import logging
import os

from flask import Flask, make_response, render_template
from flask.ext.mail import Mail
from flask.ext.security import Security, login_required, current_user
from selenium import webdriver
from flask import jsonify, request
import config
from db import db
from user import UserRepository
import auth
from scrapers import scraper_23andme


app = Flask(__name__)
app.config.from_object(config)

db.app = app
db.init_app(app)

LOG_PATH = '/opt/apollo/server/log'
LOG_FILE = 'api.log'
if os.path.exists(LOG_PATH):
    logging.basicConfig(level=logging.DEBUG, filename=LOG_PATH + '/' + LOG_FILE)
else:
    logging.basicConfig(level=logging.DEBUG)
logging.info('Starting server ...')

mail = Mail(app)
app.extensions['mail'] = mail

user_repository = UserRepository()
# security state is returned from init_app and is used to get the login_manager
security = Security().init_app(app, user_repository.user_datastore)
auth.user_repository = user_repository
app.register_blueprint(auth.social_login)


@app.route('/api')
def index():
    return 'API: is running.'


@app.route('/api/services.json')
@login_required
def servicesjson():
    return render_template('services.json')


@app.route('/api/connect/23andme/1', methods=['POST'])
@login_required
def connect_23andme():
    # todo: link this browser instance with the one that finishes the request
    browser = webdriver.PhantomJS('phantomjs')
    question = scraper_23andme.getSecretQuestion(browser, request.json['scrapeEmail'], request.json['scrapePassword'])
    return question


@app.route('/api/privacySetting', methods=['POST'])
@login_required
def privacy_setting():
    current_user.privacy_setting = request.form['privacySetting']
    user_repository.user_datastore.session.commit()
    return 'ok'


@security.login_manager.unauthorized_handler
def unauthorized():
    return make_response(jsonify({'error': 'Forbidden.'}), 403)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found.'}), 404)


if __name__ == '__main__':
    app.run()
