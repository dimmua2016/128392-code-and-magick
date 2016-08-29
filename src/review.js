'use strict';

module.exports = { showFeedback: showFeedback };

var reviewTemplate = document.getElementById('review-template');
var elementToClone;

if ('content' in reviewTemplate) {
  elementToClone = reviewTemplate.content.querySelector('.review');
} else {
  elementToClone = reviewTemplate.querySelector('.review');
}

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
