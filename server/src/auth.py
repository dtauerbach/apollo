from flask import Blueprint, current_app, flash, jsonify, redirect, request, url_for, make_response
from flask.ext.security import utils, current_user
from flask_wtf.csrf import generate_csrf
import repository
import requests
import json
from cgi import parse_qs
from urllib import urlencode


user_repository = None

social_login = Blueprint('social_login', __name__)

@social_login.route('/api/auth/check_authentication')
def check_authentication():
    res = {}
    if current_user.is_authenticated():
        res.update({
            'email': current_user.email,
            'username': current_user.username,
            'privacy': repository.PRIVACY_CONST[current_user.global_privacy]
        })
    res.update({
        'csrf_token': generate_csrf()
    })
    return jsonify(res)


@social_login.route('/api/auth/login', methods=['POST'])
def login():
    result = user_repository.login(request.json['email'], request.json['password'])
    if result:
        return check_authentication() 
    return make_response('login failed', 403);


@social_login.route('/api/auth/register', methods=['POST'])
def register():
    result = user_repository.register(request.json['username'], request.json['email'], request.json['password'])
    if result:
        return check_authentication() 
    return make_response('register failed', 400);


@social_login.route('/api/auth/logout')
def logout():
    utils.logout_user()
    return jsonify({'success': True})


def login_or_register_by_email(email):
    if not user_repository.login(email, ''):
        return user_repository.register(email, email, '')
    return False


@social_login.route('/api/persona_login', methods=['POST'])
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


@social_login.route('/api/facebook_login')
def facebook_login():
    redirect_url = "https://www.facebook.com/dialog/oauth?"
    redirect_url += urlencode(get_facebook_urlparams())
    return redirect(redirect_url)


@social_login.route('/api/facebook_login_callback')
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
    user_req_url = "https://graph.facebook.com/me?" + urlencode(dict(access_token=access_token))
    user_data = json.loads(requests.get(user_req_url).content)
    login_or_register_by_email(user_data['email'])
    return redirect('/dashboard')

# These URLparams are static between the first two oAuth requests to Google.
def get_google_urlparams():
    return dict(
        client_id=current_app.config['SOCIAL_GOOGLE']['consumer_key'],
        redirect_uri=url_for('social_login.google_login_callback', _external=True))

# Google oAuth code is adopted from:
# http://stackoverflow.com/questions/9499286/using-google-oauth2-with-flask
@social_login.route('/api/google_login')
def google_login():
    extra_params = dict(response_type='code',
                        scope='https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
    redirect_url = "https://accounts.google.com/o/oauth2/auth?"
    redirect_url += urlencode(dict(get_google_urlparams().items() + extra_params.items()))
    return redirect(redirect_url)


@social_login.route('/api/google_login_callback')
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
    return redirect('/dashboard')
