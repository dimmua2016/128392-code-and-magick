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

  var galleryImgSrc = Array.prototype.map.call(galleryImgAll, function(img) {
    return img.getAttribute('src');
  });

  var gallery = new Gallery(galleryImgSrc);

  Array.prototype.forEach.call(galleryLinkAll, function(link, i) {
    link.addEventListener('click', gallery.setLocation.bind(gallery, i));
  });

});
