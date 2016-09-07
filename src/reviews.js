'use strict';

define(['./utils', './Review', './load'], function(utils, Review, load) {
  var reviewFilter = document.querySelector('.reviews-filter');
  var addReview = document.querySelector('.reviews-controls-more');
  var reviewsList = document.querySelector('.reviews-list');
  var pageNumber = 0;

  addReview.addEventListener('click', function() {
    loadReviews(pageNumber++);
  });

  reviewFilter.addEventListener('click', function(evt) {
    if ((evt.target.type === 'radio') && (evt.target.name === 'reviews')) {
      pageNumber = 0;
      reviewsList.innerHTML = '';
      loadReviews(pageNumber++);
    }
  }, true);

  utils.controlVisible(reviewFilter, false);

  window.getFeedback = function(reviews) {
    if (reviews.length !== 0) {
      var fragment = document.createDocumentFragment();
      reviews.forEach(function(review) {
        fragment.appendChild(new Review(review).element);
      });
      reviewsList.appendChild(fragment);
      utils.controlVisible(reviewFilter, true); // эта строчка выполняется каждый раз, нелогично... надо подумать куда её вынести
      utils.controlVisible(addReview, true);
    } else {
      utils.controlVisible(addReview, false);
    }
  };

  function loadReviews(currentPage) {
    var REVIEWS_LOAD_URL = '/api/reviews';
    var PAGE_SIZE = 3;

    var from = currentPage * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var filter = document.querySelector('input[name="reviews"]:checked').value;

    load(REVIEWS_LOAD_URL, {
      from: from,
      to: to,
      filter: filter
    },
      window.getFeedback);
  }
  loadReviews(pageNumber++);
});
