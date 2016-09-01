'use strict';
// не могу воспользоваться функцией из модуля utils
define(['./utils'], function() {

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
  };

  Gallery.prototype.show = function(n) {
    var self = this;

    this.overlayGalleryClose.onclick = function() {
      self.hide();
    };

    this.overlayGalleryControlLeft.onclick = function() {
      self.prev();
    };
    this.overlayGalleryControlRight.onclick = function() {
      self.next();
    };

    this.setActivePicture(n);
    this.overlayGallery.classList.remove('invisible');
  };

  Gallery.prototype.prev = function() {
    if (this.activePicture !== 0) {
      this.setActivePicture(this.activePicture - 1);
    }
    console.log(this.activePicture);
  };

  Gallery.prototype.next = function() {
    if (this.activePicture !== this.pictures.length - 1) {
      this.setActivePicture(this.activePicture + 1);
    }
    console.log(this.activePicture);
  };

  Gallery.prototype.hide = function() {
    this.overlayGalleryClose.onclick = null;
    this.overlayGalleryControlLeft.onclick = null;
    this.overlayGalleryControlRight.onclick = null;
    this.overlayGallery.classList.add('invisible');
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
