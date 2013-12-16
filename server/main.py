import logging
import sys
import os
import json
from cgi import parse_qs
from urllib import urlencode

import config
from db import UserRepository
from flask import Flask
from flask import render_template as _render_template
from flask.ext.mail import Mail
from flask.ext.security import Security, login_required, current_user
from selenium import webdriver
from flask import Blueprint, current_app, flash, jsonify, redirect, request, url_for
from flask.ext.security import utils
import requests


sys.path.insert(0, "scrapers/selenium")
import scraper_23andme


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


@app.route('/')
def index():
    return 'API: running'


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


def render_template(template_name, **kwargs):
    default_args = {
        "user": current_user,
        "login_user_form": security.login_form(),
        "register_user_form": security.register_form()
    }
    template_args = dict(kwargs.items() + default_args.items())
    return _render_template(template_name, **template_args)


social_login = Blueprint('social_login', __name__)


@social_login.route('/server/auth/login', methods=['POST'])
def login():
    result = user_repository.login(request.form['email'], request.form['password'])
    return jsonify({'success': result})


@social_login.route('/server/auth/register', methods=['POST'])
def register():
    result = user_repository.register(request.form['username'], request.form['email'], request.form['password'])
    return jsonify({'success': result})


@social_login.route('/server/auth/logout')
def logout():
    utils.logout_user()
    return jsonify({'success': True})


def login_or_register_by_email(email):
    if not user_repository.login(email, ''):
        return user_repository.register(email, email, '')
    return False


@social_login.route('/server/persona_login', methods=['POST'])
def persona_login():
    assertion_obj = {
        'assertion': request.form['assertion'],
        'audience': current_app.config['SERVER_NAME']
    }
    json_headers = {'Content-Type': 'application/json'}
    res = requests.post('https://verifier.login.persona.org/verify',
                        data=json.dumps(assertion_obj), headers=json_headers)
    auth = json.loads(res.content)
    if auth['status'] == 'okay':
        login_or_register_by_email(auth['email'])
        return jsonify({
            'success': True
        })
    else:
        return jsonify({
            'error': 'Could not login with Persona'
        })

# These URL params are static between the first two oAuth requests to Facebook.
def get_facebook_urlparams():
    return dict(
        client_id=current_app.config['SOCIAL_FACEBOOK']['consumer_key'],
        redirect_uri=url_for('social_login.facebook_login_callback', _external=True),
        scope='email')


@social_login.route('/server/facebook_login')
def facebook_login():
    redirect_url = "https://www.facebook.com/dialog/oauth?"
    redirect_url += urlencode(get_facebook_urlparams())
    return redirect(redirect_url)


@social_login.route('/server/facebook_login_callback')
def facebook_login_callback():
    if not request.args.get('code'):
        flash('Please grant Facebook access to log in via Facebook.', 'danger')
        return redirect('/')
    oauth_args = dict(client_secret=
                      current_app.config['SOCIAL_FACEBOOK']['consumer_secret'],
                      code=request.args.get('code'))
    req_url = "https://graph.facebook.com/oauth/access_token?"
    req_url += urlencode(get_facebook_urlparams().items() + oauth_args.items())
    result = parse_qs(requests.get(req_url).content)
    if 'access_token' not in result:
        return 'Bad oauth response from Facebook. Could not log you in!'
    access_token = result['access_token'][-1]
    user_req_url = "https://graph.facebook.com/me?" + \
                   urlencode(dict(access_token=access_token))
    user_data = json.loads(requests.get(user_req_url).content)
    login_or_register_by_email(user_data['email'])
    return redirect(url_for('dashboard'))

# These URLparams are static between the first two oAuth requests to Google.
def get_google_urlparams():
    return dict(
        client_id=current_app.config['SOCIAL_GOOGLE']['consumer_key'],
        redirect_uri=url_for('social_login.google_login_callback', _external=True))

# Google oAuth code is adopted from:
# http://stackoverflow.com/questions/9499286/using-google-oauth2-with-flask
@social_login.route('/server/google_login')
def google_login():
    extra_params = dict(response_type='code',
                        scope='https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
    redirect_url = "https://accounts.google.com/o/oauth2/auth?"
    redirect_url += urlencode(dict(get_google_urlparams().items() + \
                                   extra_params.items()))
    return redirect(redirect_url)


@social_login.route('/server/google_login_callback')
def google_login_callback():
    if not request.args.get('code'):
        flash('Please grant Google access to log in via Google.', 'danger')
        return redirect('/')
    params = {
        'code': request.args.get('code'),
        'client_secret': current_app.config['SOCIAL_GOOGLE']['consumer_secret'],
        'grant_type': 'authorization_code',
    }
    req_url = "https://accounts.google.com/o/oauth2/token"
    payload = dict(get_google_urlparams().items() + params.items())
    obj = json.loads(requests.post(req_url, data=payload).content)
    if 'access_token' not in obj:
        return "Could not get access token!"
    access_token = obj['access_token']
    email_req_url = 'https://www.googleapis.com/oauth2/v1/userinfo?'
    email_req_url += urlencode(dict(access_token=access_token))
    profile_obj = json.loads(requests.get(email_req_url).content)
    if 'email' not in profile_obj:
        return "Could not get user e-mail."
    login_or_register_by_email(profile_obj['email'])
    return redirect(url_for('dashboard'))


app.register_blueprint(social_login)


# Augment Flask's render_template with variables we want available everywhere
# @app.context_processor
# def template_extras():
#     return dict(
#         google_analytics_id=app.config.get('GOOGLE_ANALYTICS_ID', None))


if __name__ == '__main__':
    app.run()
