'use strict';

window.form = (function() {
  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');

  var form = {
    onClose: null,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };


  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;
})();

var reviewFormGroupMark = document.querySelector('.review-form-group-mark');
var reviewNameField = document.getElementById('review-name');
var reviewTextField = document.getElementById('review-text');

reviewNameField.oninput = goValidate;
reviewTextField.oninput = goValidate;

// Узнаю куда кликнули, сделал через делегирование просто чтобы попробовать.
// Да и вдруг у нас в будущем изменится количество звездочек для рейтинга.
reviewFormGroupMark.onclick = (function(event) {
  var target = event.target;
  while (target !== this) {
    if (target.name === 'review-mark') {
      goValidate();
      return;
    }
    target = target.parentNode;
  }
});

//Вызываю функцию, чтобы установить начальные значения
goValidate();

function goValidate() {
  var MIN_MARK = 3;
  var flag;

  var reviewMarkRadioValue = document.querySelector('input[name="review-mark"]:checked').value;
  var reviewSubmitButton = document.querySelector('.review-submit');
  var reviewFieldsBlock = document.querySelector('.review-fields');
  var reviewNameLabel = reviewFieldsBlock.querySelector('label[for="review-name"]');
  var reviewTextLabel = reviewFieldsBlock.querySelector('label[for="review-text"]');

  // Кнопка "Добавить отзыв"
  if (((reviewMarkRadioValue < MIN_MARK) && (reviewNameField.value) && (reviewTextField.value)) ||
    ((reviewMarkRadioValue >= MIN_MARK) && (reviewNameField.value))) {
    reviewSubmitButton.removeAttribute('disabled');
  } else {
    reviewSubmitButton.setAttribute('disabled', '');
  }

  //Поле "Имя" блока "Осталось заполнить"
  flag = !reviewNameField.value;
  controlVisible(reviewNameLabel, flag);

  //Поле "Отзыв" блока "Осталось заполнить"
  flag = (!reviewTextField.value) && (reviewMarkRadioValue < MIN_MARK);
  controlVisible(reviewTextLabel, flag);

  //Блок "Осталось заполнить"
  flag = controlVisible(reviewNameLabel) || controlVisible(reviewTextLabel);
  controlVisible(reviewFieldsBlock, flag);
}

// Если в функцию передать один параметр "elem", то функция вернёт true или false в зависимости виден ли данный элемент
// Вторым параметром в функцию можно передать true или false, чтобы показать или скрыть элемент
function controlVisible(elem, flag) {
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
}

var cookies = require('browser-cookies');
var reviewForm = document.querySelector('.review-form');
var COOKIE_MARK = 'review-mark';
var COOKIE_NAME = 'review-name';

// Сохранить куки
reviewForm.onsubmit = (function() {
  var reviewMarkRadioValue = document.querySelector('input[name="review-mark"]:checked').value;
  var expiresDate = {
    expires: getExpirationDate()
  };

  cookies.set(COOKIE_MARK, reviewMarkRadioValue, expiresDate);
  cookies.set(COOKIE_NAME, reviewNameField.value, expiresDate);
});

// Прочитать куки
reviewNameField.value = cookies.get(COOKIE_NAME) || reviewNameField.value;
if (cookies.get(COOKIE_MARK)) {
  var reviewMarkRadio = document.getElementById('review-mark-' + cookies.get(COOKIE_MARK));
  reviewMarkRadio.checked = true;
}

// Вычисление количества дней прошедших с последнего прошедшего дня рождения Грейс Хоппер
function getExpirationDate() {
  var MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
  var currentDate = new Date();
  var birthdayGraceHopper = new Date(currentDate.getFullYear(), 11, 9);

  if (currentDate < birthdayGraceHopper) {
    birthdayGraceHopper.setFullYear(currentDate.getFullYear() - 1);
  }

  return (currentDate - birthdayGraceHopper) / MILLISECONDS_IN_ONE_DAY;
}
