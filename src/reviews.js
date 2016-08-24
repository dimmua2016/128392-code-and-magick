'use strict';

var reviews = [];

function createCallback(url, name) {
  var script = document.createElement('script');
  script.src = url + name;
  document.body.appendChild(script);
}

window.showFeedback = function(data) {
  reviews = data;
  console.log(reviews);
};

createCallback('/api/reviews?callback=', 'showFeedback');
