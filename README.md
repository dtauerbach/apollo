apollo
======

Apollo Project website

Install requirements with `pip install -r requirements.txt`

Set env vars with `source setupEnv.sh `.

Run with `python main.py`, then browse to localhost:5000

In order for social login to work, consumer key and secret pairs must be provided in config.py for Facebook and Google. Make sure that Google's redirect_uri is set to http://(domain)/google_login_callback.