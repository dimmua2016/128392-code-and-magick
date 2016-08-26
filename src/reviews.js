'use strict';
var utils = require('./utils');

var reviews = [];
var reviewFilter = document.querySelector('.reviews-filter');
var reviewTemplate = document.getElementById('review-template');
var elementToClone;

utils.controlVisible(reviewFilter, false);

if ('content' in reviewTemplate) {
  elementToClone = reviewTemplate.content.querySelector('.review');
} else {
  elementToClone = reviewTemplate.querySelector('.review');
}

function createCallback(url, name) {
  var script = document.createElement('script');
  script.src = url + name;
  document.body.appendChild(script);
}

window.getFeedback = function(data) {
  var reviewsList = document.querySelector('.reviews-list');
  reviews = data;
  reviews.forEach(function(review) {
    showFeedback(review, reviewsList);
  });
  utils.controlVisible(reviewFilter, true);
};

function showFeedback(review, container) {
  var element = elementToClone.cloneNode(true);
  var WIDTH_ONE_STAR = 40;
  var IMAGE_LOAD_TIMEOUT = 10000;
  var authorPictureTimeout;
  var authorPicture = new Image(124, 124);

  element.querySelector('.review-author').title = review.author.name;
  element.querySelector('.review-author').alt = review.author.name;
  element.querySelector('.review-rating').style.width = (review.rating * WIDTH_ONE_STAR) + 'px';

  authorPicture.onload = function(event) {
    clearTimeout(authorPictureTimeout);
    element.querySelector('.review-author').src = event.target.src;
  };

  authorPicture.onerror = function() {
    element.classList.add('review-load-failure');
  };

  authorPictureTimeout = setTimeout(function() {
    authorPicture.src = '';
    authorPicture.onerror();
  }, IMAGE_LOAD_TIMEOUT);

  authorPicture.src = review.author.picture;

  element.querySelector('.review-text').textContent = review.description;
  element.querySelector('.review-quiz').title = review.review_usefulness;
  container.appendChild(element);
  return element;
}

createCallback('/api/reviews?callback=', 'getFeedback');
