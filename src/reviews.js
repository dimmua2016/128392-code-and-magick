'use strict';

// Элемент "Популярные отзывы", надо же мне куда-то кликать, чтобы получить что-то
var reviewsPopular = document.getElementById('reviews-popular');

reviewsPopular.onclick = (function() {
  createCallback('/api/reviews?callback=', 'showFeedback');
});

function createCallback(url, name) {
  var script = document.createElement('script');
  script.src = url + name;
  document.body.appendChild(script);
}

window.showFeedback = function(data) {
  var reviewsList = document.querySelector('.reviews-list');
  reviewsList.innerHTML = 'Мои отзывы: ' + data;
};
