Apollo: The human data project
==============================

## Installation

	# get npm dependencies
	npm install

	# install global npm dependencies
	npm -g install grunt-cli
	npm -g install bower
	npm -g install karma

	# also to be able to run tests from cli
	# without browser window popping
	# consider to install PhantomJS
	http://phantomjs.org/download.html

	# get ruby dependencies required to compile styles from sass 
	bundle install

## Grunt flows

To make development faster and more automated there are several grunt tasks available:

Note that on Ubuntu (and possibly other systems), grunt points to 'node' but it should point instead
to 'nodejs'. To fix this, run 'which grunt' to locate where grunt is installed, and edit the #! line
to point to nodejs instead of node:

   $ #!/usr/bin/env nodejs

Create your own copy of nginx.conf.example naming it to nginx.conf, and changing the relevant settings.
Include the Apollo nginx.conf into the main Nginx conf.

* `grunt karma:watch:start watch`

  Starts karma server and all the watch tasks

* `grunt watch:sass`

  Compiles styles on change to sass files


* `grunt karma:watch:start watch:scripts`

  Runs tests on changes to js sources. Won't run without karma test server started first

* `grunt watch:livereload`
 
  Listens to changes to css and js sources and reloads browser page during development


### Testing

* `grunt karma:ci`

  runs tests against build (which should be run first), is good to use in CI scenarios as quits after single run

* see `grunt karma:watch:start watch` and `grunt karma:watch:start watch:scripts`

### Styles compilation

* `grunt css`

  Builds compass project by running 2 next tasks

* `grunt css:compile`

  Builds sass and feeds output to [autoprefixer](https://github.com/ai/autoprefixer)

* `grunt css:compress`

  Feeds css file to [csso](https://github.com/t32k/grunt-csso)

### Versioning

* `bumpVersion`

  Works with gitglow releases.
  E.g. when you're on `release/0.4.4` branch it will update cache beaters to follow version.

### Build

* `grunt`, `grunt build`

  builds project into `build` directory. Under the hood compiles and compresses css, compiles (with [requirejs](https://github.com/gruntjs/grunt-contrib-requirejs)) and [uglifies](https://github.com/gruntjs/grunt-contrib-uglify).

## Libs update

To update all the dependencies to latest compatible versions run `bower install`.

## Tests

Tests use Jasmin for assertions.

### E2E Tests

[Protractor](https://github.com/angular/protractor) is used to provide way to do e2e tests.
To install cd to client folder and run:

    npm install -g protractor
    // This installs selenium standalone server and chromedriver
    webdriver-manager update --standalone
    // Start the server with
    webdriver-manager start
    // to run all tests
    grunt protractor
    // to run specific tests
    grunt protractor:build
    grunt protractor:source

So far e2e tests are intended to be run against domain that is set in config of protractor task in Grunfile.
Later on environment config will be applied.

Checkout [Protractor docs](https://github.com/angular/protractor/blob/master/docs/) for more information.

