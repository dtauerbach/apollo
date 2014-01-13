import logging
import os
import json

from flask import Flask, make_response
from flask.ext.login import current_user
from flask.ext.mail import Mail
from flask.ext.security import Security, login_required
import repository
from selenium import webdriver
from flask import jsonify, request
import config
from db import db
from repository import UserRepository, StreamRepository, ProjectRepository
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
security = Security().init_app(app, user_repository.ud)
auth.user_repository = user_repository
app.register_blueprint(auth.social_login)


@app.route('/api')
def index():
    return 'API: is running.'


@app.route('/api/streams.json')
@login_required
def streams():
    return StreamRepository.streams_to_json()


@app.route('/api/projects.json')
@login_required
def projects():
    return ProjectRepository.projects_to_json()


@app.route('/api/privacy', methods=['GET'])
@login_required
def get_privacy():
    return json.dumps({
        'privacy': 'public',
        'streams': {
            1: {
                'name': '23andMe',
                'privacy': 'common_researchers',
                'projects': {
                    1: {
                        'name': 'Sleep study',
                        'privacy': 'private'
                    }
                }
            }
        }
    })

@app.route('/api/privacy', methods=['POST'])
@login_required
def set_privacy():
    req = request.json
    current_user.update_global_privacy(map_privacy(req['privacy']))
    stream_policies = req['streams']
    for stream in stream_policies:
        if 'privacy' in stream_policies[stream]:
            stream_privacy = stream_policies[stream]['privacy']
            current_user.update_stream_privacy(stream, map_privacy(stream_privacy))
            project_policies = stream_policies[stream]['projects']
            for project in project_policies:
                if 'privacy' in project_policies[project]:
                    project_privacy = project_policies[project]['privacy']
                    current_user.update_project_privacy(stream, project, map_privacy(project_privacy))
    return 'ok'


def map_privacy(value):
    if value in 'private':
        return repository.PRIVACY_PRIVATE
    elif value in 'approved_researchers':
        return repository.PRIVACY_APPROVED_RESEARCHER
    elif value in 'researchers':
        return repository.PRIVACY_COMMON_RESEARCHER
    elif value in 'public':
        return repository.PRIVACY_PUBLIC


@app.route('/api/connect/23andme/1', methods=['POST'])
@login_required
def connect_23andme():
    # todo: link this browser instance with the one that finishes the request
    browser = webdriver.PhantomJS('phantomjs')
    question = scraper_23andme.getSecretQuestion(browser, request.json['scrapeEmail'], request.json['scrapePassword'])
    return question


@security.login_manager.unauthorized_handler
def unauthorized():
    return make_response(jsonify({'error': 'Forbidden.'}), 403)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found.'}), 404)


if __name__ == '__main__':
    app.run()
