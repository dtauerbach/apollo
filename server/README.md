apollo
======

Apollo Project website

## Getting Started

Start by copying config_sample.py to config.py, and changing the relevant settings.

In order for social login to work, consumer key and secret pairs must be provided in config.py for Facebook and Google. Make sure that Google's redirect_uri is set to http://(domain)/google_login_callback.

To install and run locally, first install the front-end dependencies. For the front-end we're using sass, angular and requirejs. To install the needed dependencies for front-end development, follow these steps:

    sudo npm install

Note for this to work you must have a recent version of node installed. For Ubuntu 13.04 I had to add another PPA: sudo add-apt-repository ppa:chris-lea/node.js. Install global npm dependencies

    sudo npm -g install grunt-cli

Get ruby dependencies required to compile styles from sass

    sudo bundle install

Now grunt assumes that you are using package name "node". In the case of Debian the package is currently actually called "nodejs". So on these systems, you may need to find the grunt binary (e.g. "/usr/lib/node_modules/grunt-cli/bin/grunt", symlinked from system path, and edit the #! line. Instead of:

    #!/usr/bin/env node

This should (maybe) instead read:

    #!/usr/bin/env nodejs

 Finally, do:

    grunt build-css

Now that front-end dependencies have been installed, we recommend using virtualenv and pip for the Python and Flask pieces:

    $ virtualenv env
    $ . env/bin/activate
    (env) $ pip install -r requirements.txt
    (env) $ python main.py
    # Now a local server should be running on localhost:5000
    # when you're done
    (env) $ deactivate

Or in one line:

    $ virtualenv env; . env/bin/activate; pip install -r requirements.txt; python main.py

