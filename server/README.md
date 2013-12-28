Apollo: The human data project
==============================

## Server

### Configuration

The server is located under the /server directory.

Start by creating your own copy of config_sample.py naming it to config.py, and changing the relevant settings.

In order for social login to work, consumer key and secret pairs must be provided in config.py for Facebook and Google.
Make sure that Google's redirect_uri is set to http://(domain)/google_login_callback.

### Setup

The backend stores data in MySQL. To setup DB and schema run:

    $ ./db/setup.sh

### Run

The backend is built in Flask. To run it:

    $ ./start.sh
