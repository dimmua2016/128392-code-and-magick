'use strict';

define(['./utils'], function(utils) {

  var Gallery = function(data) {
    this.pictures = data;
    this.activePicture = 0;
    this.overlayGallery = document.querySelector('.overlay-gallery');
    this.overlayGalleryClose = this.overlayGallery.querySelector('.overlay-gallery-close');
    this.overlayGalleryControlLeft = this.overlayGallery.querySelector('.overlay-gallery-control-left');
    this.overlayGalleryControlRight = this.overlayGallery.querySelector('.overlay-gallery-control-right');
    this.previewNumberBlock = this.overlayGallery.querySelector('.overlay-gallery-preview');
    this.previewNumberCurrent = this.overlayGallery.querySelector('.preview-number-current');
    this.previewNumberTotal = this.overlayGallery.querySelector('.preview-number-total');
    this.previewNumberTotal.textContent = this.pictures.length;

    this.hide = this.hide.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.closeGallery = this.closeGallery.bind(this);

    window.addEventListener('hashchange', this.hashchange.bind(this));

    this.hashchange();
  };

  Gallery.prototype.show = function(hash) {
    this.overlayGalleryClose.addEventListener('click', this.closeGallery);
    this.overlayGalleryControlLeft.addEventListener('click', this.prev);
    this.overlayGalleryControlRight.addEventListener('click', this.next);
    utils.controlVisible(this.overlayGallery, true);
    this.setActivePicture(hash);
  };

  Gallery.prototype.prev = function() {
    if (this.activePicture !== 0) {
      this.setLocation(this.activePicture - 1);
    }
  };

  Gallery.prototype.next = function() {
    if (this.activePicture !== this.pictures.length - 1) {
      this.setLocation(this.activePicture + 1);
    }
  };

  Gallery.prototype.hide = function() {
    this.overlayGalleryClose.removeEventListener('click', this.closeGallery);
    this.overlayGalleryControlLeft.removeEventListener('click', this.prev);
    this.overlayGalleryControlRight.removeEventListener('click', this.next);
    utils.controlVisible(this.overlayGallery, false);
  };

  Gallery.prototype.closeGallery = function() {
    this.setLocation();
  };

  Gallery.prototype.setActivePicture = function(path) {

    if (typeof path === 'string') {
      path = this.pictures.indexOf(path);
    }

    if (path !== -1) {
      this.activePicture = path;
      this.previewNumberCurrent.textContent = this.activePicture + 1;

      var img = this.previewNumberBlock.querySelector('img');
      if (img) {
        img.src = this.pictures[this.activePicture];
      } else {
        var newImg = new Image();
        newImg.src = this.pictures[this.activePicture];
        this.previewNumberBlock.appendChild(newImg);
      }
    } else {
      this.closeGallery();
    }
  };

  Gallery.prototype.hashchange = function() {
    var hash = location.hash.match(/#photo\/(\S+)/);

    if (hash) {
      this.show(hash[1]);
    } else if (utils.controlVisible(this.overlayGallery)) {
      this.hide();
    }
  };

  Gallery.prototype.setLocation = function(hash) {
    if (typeof hash === 'number') {
      location.hash = 'photo/' + this.pictures[hash];
    } else {
      location.hash = '';
    }
  };
  return Gallery;
});
