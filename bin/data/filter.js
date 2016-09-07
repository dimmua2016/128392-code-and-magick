'use strict';

module.exports = function(list, filterID) {
  switch (filterID) {
    case 'reviews-recent':
      var THREE_DAYS = 1000 * 60 * 60 * 24 * 3; // sec * min * hour * day * 3
      var threeDayAgo = Date.now() - THREE_DAYS;
      return list.filter(function(item) {
          var created = Number(new Date(item.created));
          return created >= threeDayAgo;
        })
        .sort(function(a, b) {
          return b.created - a.created;
        });

    case 'reviews-good':
      var MIN_MARK = 3;
      return list.filter(function(item) {
          return item.rating >= MIN_MARK;
        })
        .sort(function(a, b) {
          return b.rating - a.rating;
        });

    case 'reviews-bad':
      var MAX_MARK = 3;
      return list.filter(function(item) {
          return item.rating < MAX_MARK;
        })
        .sort(function(a, b) {
          return a.rating - b.rating;
        });

    case 'reviews-popular':
      return list.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
  }
  return list;
};
