'use strict';

var utils = require('./utils');
var review = require('./review');
var load = require('./load');

var reviewFilter = document.querySelector('.reviews-filter');
utils.controlVisible(reviewFilter, false);

window.getFeedback = function(data) {
  var reviewsList = document.querySelector('.reviews-list');
  var reviews = data;
  reviews.forEach(function(reviewParam) {
    review.showFeedback(reviewParam, reviewsList);
  });
  utils.controlVisible(reviewFilter, true);
};

load.createCallback('/api/reviews?callback=', 'getFeedback');
