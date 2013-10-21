from main import user_datastore, User

from datetime import datetime

from flask import Blueprint, current_app, redirect, render_template, \
    request, url_for
from flask.ext.security import login_user

import requests, json

from cgi import parse_qs
from urllib import urlencode

social_login = Blueprint('social_login', __name__,
                template_folder='templates')

# Create (or find) an account for a given e-mail, and then log that 
# user in.
def login_or_register_by_email(email):
    user_obj = User.query.filter(User.email==email).first()
    if not user_obj:
        user_obj = user_datastore.create_user(email=email,
            confirmed_at=datetime.now())
        user_datastore.commit()
    login_user(user_obj)

@social_login.route('/persona_login', methods=['POST'])
def persona_login():
    assertion = request.form['assertion']
    assertion_obj = {
            'assertion': request.form['assertion'],
            # main_page maps to url /
            'audience': url_for('main_page', _external=True)
    }
    json_headers = {'Content-Type': 'application/json'}
    res = requests.post('https://verifier.login.persona.org/verify',
        data=json.dumps(assertion_obj),headers=json_headers)
    auth = json.loads(res.content)
    if auth['status'] == 'okay':
        login_or_register_by_email(auth['email'])
        return json.dumps({
            'success': True
        })
    else:
        return "Could not login with Persona"

def get_facebook_urlparams():
    return dict(
    client_id=current_app.config['SOCIAL_FACEBOOK']['consumer_key'],
    redirect_uri=url_for('social_login.facebook_login_callback', _external=True),
    scope='email')

@social_login.route('/facebook_login')
def facebook_login():
    redirect_url = "https://www.facebook.com/dialog/oauth?"
    redirect_url += urlencode(get_facebook_urlparams())
    return redirect(redirect_url)

@social_login.route('/facebook_login_callback')
def facebook_login_callback():
    if not request.args.get('code'): return 'Missing code'
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
