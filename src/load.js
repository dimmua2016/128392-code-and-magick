'use strict';

define(function() {
  return function(url, name) {
    var script = document.createElement('script');
    script.src = url + name;
    document.body.appendChild(script);
  };
});
