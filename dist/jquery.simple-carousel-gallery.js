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

   var SCQ = 'SimpleCarouselGallery',
       DEFAULTS;

   DEFAULTS = {
      templateSelector: '#SCQTemplate'
   };

   // The actual plugin constructor
   function Plugin(element, items, options) {
      this.element = $(element);
      this.items = items;
      this.settings = $.extend({}, DEFAULTS, options);
      this.template = $(this.settings.templateSelector);
      this._defaults = DEFAULTS;
      this._name = SCQ;
      this.init();
   }

   // Avoid Plugin.prototype conflicts
   $.extend(Plugin.prototype, {

      _currentIndex: 0,

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
             $item = this._createMarkupFor(item);

         this.element.find('.media').empty().append($item);
         this.element.find('.caption').empty().html(item.caption);
      },

      goTo: function(i) {
         this._currentIndex = i;
         this._renderCurrent();
      }
   });

   // A really lightweight plugin wrapper around the constructor,
   // preventing against multiple instantiations
   $.fn[ SCQ ] = function(items, options) {
      return this.each(function() {
         if (!$.data(this, 'plugin_' + SCQ)) {
            $.data(this, 'plugin_' + SCQ, new Plugin(this, items, options));
         }
      });
   };

})(jQuery, window, document);
