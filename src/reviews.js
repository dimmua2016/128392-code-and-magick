'use strict';

define(['utils', 'review', 'load'], function(utils, review, load) {

  var reviewFilter = document.querySelector('.reviews-filter');
  utils(reviewFilter, false);

  window.getFeedback = function(data) {
    var reviewsList = document.querySelector('.reviews-list');
    var reviews = data;
    reviews.forEach(function(reviewParam) {
      review(reviewParam, reviewsList);
    });
    utils(reviewFilter, true);
  };

  load('/api/reviews?callback=', 'getFeedback');

});
