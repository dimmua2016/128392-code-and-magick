'use strict';

define(function() {
  return function(url, params, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', url + '?from=' + params.from + '&to=' + params.to + '&filter=' + params.filter);
    xhr.send();
  };
});
