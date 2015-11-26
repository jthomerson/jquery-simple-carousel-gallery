/*
 *  jquery-simple-carousel-gallery - v0.1.0
 *  A very simple image / video gallery with a carousel of thumbnails.
 *  
 *
 *  Made by Jeremy Thomerson
 *  Under Apache-2.0 License
 */
;(function ($, window, document, undefined) {

   'use strict';

   var SCG = 'SimpleCarouselGallery',
       DEFAULTS;

   DEFAULTS = {
      templateSelector: '#SCGTemplate',
      allowPrevNextWrapAround: false,
      mediaFadeInSpeed: 200,
      mediaFadeOutSpeed: 200,
      carouselAnimationSpeed: 400
   };

   // The actual plugin constructor
   function Plugin(element, items, options) {
      this.element = $(element);
      this.items = items;
      this.settings = $.extend({}, DEFAULTS, options);
      this.template = $(this.settings.templateSelector);
      this._defaults = DEFAULTS;
      this._name = SCG;
      this.init();
   }

   // Avoid Plugin.prototype conflicts
   $.extend(Plugin.prototype, {

      _currentIndex: -1,

      init: function() {
         var self = this,
             gallery = this.template.clone();

         gallery.find('.media').empty();
         this._renderCarouselInto(gallery);
         this.element.empty().append(gallery.html());

         this.element.on('click', '.carouselItem', function(evt) {
            var i = $(evt.target).closest('.carouselItem').data('index');
            evt.preventDefault();
            self.goTo(i);
         });

         this.goTo(0);

         this.element.find('.goToPrevious').click(this.previous.bind(this));
         this.element.find('.goToNext').click(this.next.bind(this));

         $(window).resize(this._scrollToSelectedThumbnail.bind(this));
      },

      previous: function(evt) {
         var previous = (this._currentIndex - 1);

         if (previous < 0) {
            previous = (this.settings.allowPrevNextWrapAround ? (this.items.length - 1) : 0);
         }

         evt.preventDefault();
         this.goTo(previous);
      },

      next: function(evt) {
         var next = (this._currentIndex + 1);

         if (next >= this.items.length) {
            next = (this.settings.allowPrevNextWrapAround ? 0 : (this.items.length - 1));
         }

         evt.preventDefault();
         this.goTo(next);
      },

      _renderCarouselInto: function(gallery) {
         var itemTemplate = this.template.find('.carouselItem'),
             carousel = gallery.find('.carousel');

         carousel.empty();

         $.each(this.items, function(i, item) {
            var $item = itemTemplate.clone(),
                img = $('<img />'),
                link = $('<a />');

            $item.attr('data-index', i);
            link.attr('href', '#');
            img.attr('src', item.thumb);

            img.appendTo(link);
            link.appendTo($item);
            $item.appendTo(carousel);
         });
      },

      _createMarkupFor: function(item) {
         if (item.type === 'video') {
            var video = this.template.find('.media .video').clone().contents();

            video.find('source').attr('src', item.src);
            return video;
         }

         return $('<img />').attr('src', item.src);
      },

      _renderCurrent: function() {
         var item = this.items[this._currentIndex],
             media = this.element.find('.media'),
             mediaFadeInSpeed = this.settings.mediaFadeInSpeed,
             $item = this._createMarkupFor(item);

         function showItem() {
            $item.hide();
            media.empty().append($item);
            $item.fadeIn(mediaFadeInSpeed);
         }

         if (this._currentMediaItem) {
            this._currentMediaItem.fadeOut(this.settings.mediaFadeOutSpeed, showItem);
         } else {
            showItem();
         }
         this._currentMediaItem = $item;

         this.element.find('.caption').empty().html(item.caption);
      },

      _highlightCurrentThumbnail: function() {
         this.element.find('.carousel .carouselItem')
            .removeClass('active')
            .eq(this._currentIndex).addClass('active');

         this._scrollToSelectedThumbnail();
      },

      _scrollToSelectedThumbnail: function() {
         var carousel = this.element.find('.carousel'),
             firstThumb = carousel.find('.carouselItem:first-child'),
             thumb = carousel.find('.carouselItem.active'),
             carouselWidth = carousel.width(),
             thumbWidth = thumb.outerWidth(),
             left = ((carouselWidth / 2) - (thumbWidth / 2) - (thumbWidth * this._currentIndex));

         firstThumb.animate({
            marginLeft: left + 'px'
         }, this.settings.carouselAnimationSpeed);
      },

      _updateButtons: function() {
         if (this.settings.allowPrevNextWrapAround) {
            return;
         }

         if (this._currentIndex === 0) {
            this.element.find('.goToPrevious').addClass('disabled');
         } else {
            this.element.find('.goToPrevious').removeClass('disabled');
         }

         if (this._currentIndex === (this.items.length - 1)) {
            this.element.find('.goToNext').addClass('disabled');
         } else {
            this.element.find('.goToNext').removeClass('disabled');
         }
      },

      goTo: function(i) {
         if (i === this._currentIndex) {
            return;
         }

         this._currentIndex = i;
         this._updateButtons();
         this._renderCurrent();
         this._highlightCurrentThumbnail();
      }
   });

   // A really lightweight plugin wrapper around the constructor,
   // preventing against multiple instantiations
   $.fn[ SCG ] = function(items, options) {
      return this.each(function() {
         if (!$.data(this, 'plugin_' + SCG)) {
            $.data(this, 'plugin_' + SCG, new Plugin(this, items, options));
         }
      });
   };

})(jQuery, window, document);
