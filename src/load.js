'use strict';

module.exports = { createCallback: createCallback };

function createCallback(url, name) {
  var script = document.createElement('script');
  script.src = url + name;
  document.body.appendChild(script);
}
