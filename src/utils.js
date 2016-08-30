'use strict';

define(function() {
  // Если в функцию передать один параметр "elem", то функция вернёт true или false в зависимости виден ли данный элемент
  // Вторым параметром в функцию можно передать true или false, чтобы показать или скрыть элемент
  return function(elem, flag) {
    var answer;
    if (typeof flag === 'undefined') {
      if (window.getComputedStyle(elem).display !== 'none') {
        answer = true;
      } else {
        answer = false;
      }
    } else {
      if (flag) {
        elem.classList.remove('invisible');
      } else {
        elem.classList.add('invisible');
      }
    }
    return answer;
  };
});
