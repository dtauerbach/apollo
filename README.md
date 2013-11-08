apollo
======

Apollo Project website

## Getting Started

Start by copying config_sample.py to config.py, and changing the relevant settings.

In order for social login to work, consumer key and secret pairs must be provided in config.py for Facebook and Google. Make sure that Google's redirect_uri is set to http://(domain)/google_login_callback.

To install and run locally, we recommend using virtualenv:

    $ virtualenv env
    $ . env/bin/activate
    (env) $ pip install -r requirements.txt
    (env) $ python main.py
    # Now a local server should be running on localhost:5000
    # when you're done
    (env) $ deactivate

For the front-end we're using sass, angular and requirejs. To install the needed dependencies for front-end development,
follow these steps:

    npm install

Install global npm dependencies

    npm -g install grunt-cli

Get ruby dependencies required to compile styles from sass

    bundle install

Then you're good to go:

    grunt build-css