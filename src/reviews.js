'use strict';

define(['./utils', './Review', './load'], function(utils, Review, load) {

  var reviewFilter = document.querySelector('.reviews-filter');
  utils.controlVisible(reviewFilter, false);

  window.getFeedback = function(reviews) {
    var reviewsList = document.querySelector('.reviews-list');
    var fragment = document.createDocumentFragment();
    reviews.forEach(function(review) {
      fragment.appendChild(new Review(review).element);
    });

    reviewsList.appendChild(fragment);

    utils.controlVisible(reviewFilter, true);
  };

  load('/api/reviews?callback=', 'getFeedback');
});
