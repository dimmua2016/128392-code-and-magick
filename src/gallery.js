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
  };

  Gallery.prototype.show = function(n) {
    this.overlayGalleryClose.addEventListener('click', this.hide);
    this.overlayGalleryControlLeft.addEventListener('click', this.prev);
    this.overlayGalleryControlRight.addEventListener('click', this.next);
    this.setActivePicture(n);
    utils.controlVisible(this.overlayGallery, true);
  };

  Gallery.prototype.prev = function() {
    if (this.activePicture !== 0) {
      this.setActivePicture(this.activePicture - 1);
    }
  };

  Gallery.prototype.next = function() {
    if (this.activePicture !== this.pictures.length - 1) {
      this.setActivePicture(this.activePicture + 1);
    }
  };

  Gallery.prototype.hide = function() {
    this.overlayGalleryClose.removeEventListener('click', this.hide);
    this.overlayGalleryControlLeft.removeEventListener('click', this.prev);
    this.overlayGalleryControlRight.removeEventListener('click', this.next);
    utils.controlVisible(this.overlayGallery, false);
  };

  Gallery.prototype.setActivePicture = function(n) {
    this.activePicture = n;
    this.previewNumberCurrent.textContent = this.activePicture + 1;

    var img = this.previewNumberBlock.querySelector('img');

    if (img) {
      img.src = this.pictures[this.activePicture];
    } else {
      var newImg = new Image();
      newImg.src = this.pictures[this.activePicture];
      this.previewNumberBlock.appendChild(newImg);
    }
  };
  return Gallery;
});
