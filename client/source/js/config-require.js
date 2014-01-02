if (typeof define !== 'function') {
  // to be able to require file from node
  var define = require('amdefine')(module);
}

define({
  "paths": {
    "jquery"          : "../vendor/jquery/jquery",
    "underscore"      : "../vendor/underscore/underscore",
    "angular"         : "../vendor/angular/angular",
    "angular-bootstrap" : "../vendor/angular-bootstrap/ui-bootstrap-tpls",
    "angular-resource": "../vendor/angular-resource/angular-resource",
    "async"           : "../vendor/requirejs-plugins/src/async",
    "domReady"        : "../vendor/requirejs-domready/domReady"
  },
  "shim": {
    "angular" : {
      "exports": "angular",
      "deps": ["jquery"]
    },
    "angular-bootstrap" : {
      "deps": ["angular"]
    },
    "angular-mocks" : {
      "deps": ["angular"]
    },
    "angular-resource" : {
      "deps": ["angular"]
    }
  }
});
