'use strict';

define(['./form', './game', './gallery', './reviews'], function(form, Game, Gallery) {

  var game = new window.Game(document.querySelector('.demo'));
  game.initializeLevelAndStart();
  game.setGameStatus(window.Game.Verdict.INTRO);

  var formOpenButton = document.querySelector('.reviews-controls-new');

  /** @param {MouseEvent} evt */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();

    window.form.open(function() {
      game.setGameStatus(window.Game.Verdict.PAUSE);
      game.setDeactivated(true);
    });
  };

  window.form.onClose = function() {
    game.setDeactivated(false);
  };

  var galleryImgAll = document.querySelectorAll('.photogallery .photogallery-image img');
  var galleryLinkAll = document.querySelectorAll('.photogallery .photogallery-image');

  var i;
  var length = galleryImgAll.length;
  var galleryImgSrc = [];
  // Как это сделать проще?
  // По сути, мне из Nodelist нужно вытащить свойства src и запихнуть в массив.
  for (i = 0; i < length; i++) {
    galleryImgSrc[i] = galleryImgAll[i].src;
  }

  var gallery = new Gallery(galleryImgSrc);

  length = galleryLinkAll.length;
  // Как это сделать проще?
  // Мне пришлось обернуть это все функцией и сразу её выполнить, чтобы сохранить текущее значение переменной i
  for (i = 0; i < length; i++) {
    (function(k) {
      galleryLinkAll[i].addEventListener('click', function() {
        gallery.show(k);
        console.log(gallery);
      });
    })(i);
  }

  // Для примера, такое видел в чужом коде:
  // Вроде этот код мне понятен, хотя зачем делать "call"?
  // Без него не работает, а этот "call" в инструкциях не описывается
  // var galleryImg = document.querySelectorAll('.photogallery .photogallery-image img');
  // var galleryLink = document.querySelectorAll('.photogallery .photogallery-image');

  // var picture = Array.prototype.map.call(galleryImg, function(img) {
  //   return img.src;
  // });

  // var gallery = new Gallery(picture);

  // Array.prototype.forEach.call(galleryLink, function(link, i) {
  //   link.addEventListener('click', function() {
  //     gallery.show(i);
  //   });
  // });

});
