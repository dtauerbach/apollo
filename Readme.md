Apollo: The human data project
==============================

## Server

### Configuration

The server is located under the /server directory.

Start by creating your own copy of config_sample.py naming it to config.py, and changing the relevant settings.

In order for social login to work, consumer key and secret pairs must be provided in config.py for Facebook and Google.
Make sure that Google's redirect_uri is set to http://(domain)/google_login_callback.

### Setup

The backend is built in Flask and to set it up run the following commands:

    $ virtualenv env
    $ . env/bin/activate
    (env) $ pip install -r requirements.txt

    ... and when you're done

    (env) $ deactivate

The backend stores data in MySQL. To setup DB and schema run:

    $ ./db/setup.sh

In one line:

    $ virtualenv env; . env/bin/activate; pip install -r requirements.txt; python main.py

### Run

    $ . env/bin/activate
    (env) $ python main.py


## Client

The client is located under the /client directory.

### Setup

Install local and global NodeJS dependencies:

    $ npm install
    $ npm -g install grunt-cli
    $ npm -g install bower
    $ npm -g install karma

Install Ruby dependencies required to compile styles from sass:

    $ bundle install

Create your own copy of nginx.conf.example naming it to nginx.conf, and changing the relevant settings.
Include the Apollo nginx.conf into the main Nginx conf.

Create an alias for 127.0.0.1 in your /etc/hosts, e.g. 127.0.0.1 local.apollo.com, and use it as server_name in the nginx.conf.

### Build

In order to compile sass files, minifying and uglifying js file run:

    $ grunt build

### Testing

Be sure that tests are passing as well:

    $ grunt karma:ci


## Here we go!

Now access http://local.apollo.com .
