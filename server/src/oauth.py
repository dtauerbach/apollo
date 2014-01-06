from flask import Blueprint, current_app, flash, jsonify, redirect, request, url_for
from flask.ext.security import utils, current_user, login_required
import requests
import json
from cgi import parse_qs
from urllib import urlencode

user_repository = None

oauth_streams = Blueprint('oauth_streams', __name__)

@login_required
@oauth_streams.route('/api/oauth/jawbone_login')
def jawbone_login():
    url = 'https://jawbone.com/auth/oauth2/auth?'
    params = urlencode(dict(response_type='code',
                            client_id=current_app.config['JAWBONE_UP']['key'],
                            scope='sleep_read basic_read',
                            redirect_uri='http://local.apollo.com/api/oauth/jawbone_login_callback'))
    return redirect(url+params)

@login_required
@oauth_streams.route('/api/oauth/jawbone_login_callback')
def jawbone_login_callback():
    url = 'https://jawbone.com/auth/oauth2/token?'
    params = urlencode(dict(code=request.args['code'],
                            client_id=current_app.config['JAWBONE_UP']['key'],
                            client_secret=current_app.config['JAWBONE_UP']['secret'],
                            grant_type='authorization_code'))
    response = json.loads(requests.get(url+params).content)
    if 'access_token' not in response:
        return 'Bad oauth response from Jawbone. Could not log you in!'
    access_token = response['access_token']
    # todo: save access token to database
    headers = {'Authorization: Bearer': access_token,
               'Accept': 'application/json'}
    sleep = requests.get('https://jawbone.com/nudge/api/users/@me', headers=headers).content
    return str(sleep)
