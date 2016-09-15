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

    this.setLocation = this.setLocation.bind(this);
    window.addEventListener('hashchange', this.hashchange.bind(this));

    this.hashchange();
  };

  Gallery.prototype.show = function(hash) {
    console.log('show hash = ' + hash);
    this.overlayGalleryClose.addEventListener('click', this.setLocation);
    this.overlayGalleryControlLeft.addEventListener('click', this.prev);
    this.overlayGalleryControlRight.addEventListener('click', this.next);
    this.setActivePicture(hash);
    utils.controlVisible(this.overlayGallery, true);

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
    console.log('hide');
    this.overlayGalleryClose.removeEventListener('click', this.setLocation);
    this.overlayGalleryControlLeft.removeEventListener('click', this.prev);
    this.overlayGalleryControlRight.removeEventListener('click', this.next);
    utils.controlVisible(this.overlayGallery, false);
  };

  Gallery.prototype.setActivePicture = function(path) {

    if (typeof path === 'string') {
      path = this.pictures.indexOf(path);
    }

    console.log('path = ' + path);

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
      console.log('нет такой картинки');
      this.hide();
    }
  };

  Gallery.prototype.hashchange = function() {
    var hash = this.getLocation();
    console.log('событие hashchange');
    if (hash) {
      this.show(hash);
    } else {
      this.hide();
    }
  };

  Gallery.prototype.getLocation = function() {
    var url = location.hash.match(/#photo\/(\S+)/);

    if (url) {
      return url[1]; // а как меня eslint пропустил с двумя return ??? Вроде требует один return и чтобы она вконце был
    }

    return null;
  };

  Gallery.prototype.setLocation = function(n) {
    var url = '';

    if (n >= 0) {
      url = 'photo/' + this.pictures[n];
    }

    location.hash = url;
  };
  return Gallery;
});
