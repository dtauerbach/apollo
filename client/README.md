Apollo: The human data project
==============================

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
