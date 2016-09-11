'use strict';

define(function() {

  var reviewTemplate = document.getElementById('review-template');
  var elementToClone;

  if ('content' in reviewTemplate) {
    elementToClone = reviewTemplate.content.querySelector('.review');
  } else {
    elementToClone = reviewTemplate.querySelector('.review');
  }

  function Review(review) {
    var WIDTH_ONE_STAR = 40;
    this.data = review;
    this.element = elementToClone.cloneNode(true);

    this.element.querySelector('.review-author').title = this.data.author.name;
    this.element.querySelector('.review-author').alt = this.data.author.name;
    this.element.querySelector('.review-rating').style.width = (this.data.rating * WIDTH_ONE_STAR) + 'px';
    this.element.querySelector('.review-text').textContent = this.data.description;

    this.answerYes = this.element.querySelector('.review-quiz-answer-yes');
    this.answerNo = this.element.querySelector('.review-quiz-answer-no');

    this.usefulness = this.data.review_usefulness;
    this.setUsefulness(this.usefulness);

    this.setAnswer = this.setAnswer.bind(this);

    this.answerYes.onclick = this.answerNo.onclick = this.setAnswer;

    this.loadImg(this.data.author.picture);
  }

  Review.prototype.setAnswer = function(evt) {
    var isYes = evt.target === this.answerYes;
    this.answerYes.classList.toggle('review-quiz-answer-active', isYes);
    this.answerNo.classList.toggle('review-quiz-answer-active', !isYes);
    this.remove();

    if (isYes) {
      this.usefulness++;
    } else {
      this.usefulness--;
    }
    this.setUsefulness(this.usefulness);
  };

  Review.prototype.setUsefulness = function(i) {
    this.element.querySelector('.review-quiz-usefulness').textContent = (i > 0 ? '(+' : '(') + i + ')';
  };

  Review.prototype.remove = function() {
    this.answerYes.onclick = this.answerNo.onclick = null;
  };

  Review.prototype.loadImg = function(src) {
    var IMAGE_LOAD_TIMEOUT = 10000;
    var authorPictureTimeout;
    var authorPicture = new Image(124, 124);

    authorPicture.onload = function(evt) {
      clearTimeout(authorPictureTimeout);
      this.element.querySelector('.review-author').src = evt.target.src;
    }.bind(this);

    authorPicture.onerror = function() {
      this.element.classList.add('review-load-failure');
    }.bind(this);

    authorPictureTimeout = setTimeout(function() {
      authorPicture.src = '';
      authorPicture.onerror();
    }, IMAGE_LOAD_TIMEOUT);

    authorPicture.src = src;
  };

  return Review;
});
