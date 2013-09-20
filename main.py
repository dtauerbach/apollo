import logging
from flask import Flask
from flask import render_template

import os, sys

app = Flask(__name__)

try:
    app.secret_key = os.environ['SESSION_SECRET_KEY']
except KeyError:
    print "Env vars missing. Did you run setupEnv.sh?"
    sys.exit(1)

# CSRF protection flaskext
from flaskext.csrf import csrf
csrf(app)

@app.route('/')
def main_page():
    return render_template('main_page.html')

@app.route('/sign_up', methods=['POST'])
def sign_up():
    return '/sign_up'

if __name__ == '__main__':
    app.config.update(DEBUG=True,PROPAGATE_EXCEPTIONS=True,TESTING=True)
    logging.basicConfig(level=logging.DEBUG)

    app.run()