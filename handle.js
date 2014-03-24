var nxnw = nxnw || {};

define(function(require){
  var jQuery = require('jquery');
  require('transition.end.min');
  require('throttle-debounce');

  // first we set up our constructor function
  function handle(args, options){
    //set object options
    this.options = $.extend({}, this.defaults, options);
    this.$el = args.el;
    this.$drawer = args.drawer;
    this.$drawer_inner = args.drawer_inner;
    this.drawer_height = 0;
    this.open = false;
    this.transitioning = false;
    this.immediate = false;
    this.window_width = $(window).width();
    this.csstransitions = Modernizr.csstransitions;

    //various callbacks..
    this._callback = args.hasOwnProperty('callback') ? args.callback : false;
    this._complete = args.hasOwnProperty('complete') ? args.complete : false;

    //fire init function
    this._init(this.callback, this.callback_args);
  }; /* \constructor */

  handle.prototype = {
    // now we define the prototype for slideShow
    defaults: {
      overflow: false,
      height: 'auto',
      duration : 2000,
      ns: 'handle'
    }, /* \defaults */

    //define plugin functions below
    _init: function(){
      //save current width width

      this.drawer_height = this.$drawer_inner.outerHeight(false);

      var self = this;
      this.$el.on('click.'+this.options.ns, function(e){
        e.preventDefault();
        self._set_height(self.open ? 0 : self.drawer_height, self.open);
      });

      $(window).on('resize.'+this.options.ns, $.throttle(250, function(e) {
        //var namespace = e.namespace || e.handleObj.namespace;
        self._update(true);

      }));

      if(this._callback) {
        this._callback();
      }
    }, /* \handle._init */

    _update : function(immediate) {
      if(immediate) { // we need to override any transitions applied to the drawer and make sure we return to those transitions after the drawer closes
        this.immediate = true;
        this.$drawer.addClass('immediate');
      }
      if(this.open){ //if open, update height of the fold itself
        this._set_height(this.$drawer_inner.outerHeight(false), null);
      }
    },

    _transition_end: function(that, complete) {
      that.transitioning = false;
      //if overflow is set, active
      if(that.options.overflow && that.open) {
        that.$drawer.addClass('open');
      }

      if ( that.immediate ) {
        that.$drawer.removeClass('immediate');
        that.immediate = false;
      }

      //if callback exists and callback flag is true; call it
      if( that._complete && complete ) {
        that._complete();
      }
    }, /* \_transition_end */

    _set_height: function(height, open) {
      //set initial vars
      var to_height = !open ? this.options.height == 'auto' ? height : this.options.height : height;
      this.transitioning = true;
      var that = this;


      //set support for transitions
      if ( !that.$drawer.is(':visible') ) { //if element isn't visible, transition.end will never fire, fire immediately
        that._transition_end( that, false );
      }
      else {
        if ($.support.transition) {
          that.$drawer.one($.support.transition.end, function () {
            that._transition_end( that, true );
          });
        }
      }

      //set all classes and heights as needed

      //remove open class from overflow property if necessary
      if(this.open && this.options.overflow) {
        this.$drawer.removeClass('open');
      }

      if (this.csstransitions) {
        to_height = !open ? this.options.height == 'auto' ? this.$drawer_inner.outerHeight(false) : this.options.height : height;
        this.drawer_height = to_height;
        this.$drawer.height(to_height);
      }
      else {
        //animate height with jquery
        var self = this;

        this.$drawer.animate({
          height : to_height
        },
        self.options.duration,
        function() {
          self.transitioning = false;
          if ( self.immediate ) {
            self.$drawer.removeClass('immediate');
            self.immediate = false;
          }
          if(self._complete) {
            self._complete();
          }
        });
      }


      if(open !== null){
        this.$el.toggleClass('active');
        this.$drawer.toggleClass('active');

        this.open = open ? false : true;
      }
    }, /* \handle._set_height */

    _override_height: function(height) {
      this.$drawer_inner.css('height', height);
    }, /* \_override_height */

    _open: function(immediate){
      if( typeof immediate !== 'undefined' && immediate ) { // we need to override any transitions applied to the drawer and make sure we return to those transitions after the drawer closes
        this.immediate = true;
        this.$drawer.addClass('immediate');
      }
      this._set_height(this.open ? 0 : this.drawer_height, this.open);
      //this.$el.trigger('click.handle');

    }, /* \handle._open */

    _close: function(immediate) {
      if( typeof immediate !== 'undefined' && immediate ) { // we need to override any transitions applied to the drawer and make sure we return to those transitions after the drawer closes
        this.immediate = true;
        this.$drawer.addClass('immediate');
      }
      this._set_height(this.open ? 0 : this.drawer_height, this.open);
      //this.$el.trigger('click.handle');
    }, /* \handle._close */

    _create: function(){

    }, /* \handle._create */

    _destroy: function(){
      //remove any existing height attr and remove EH
      //this.$el.off('click', '**');
      this.$el.off('click.'+this.options.ns);
      $(window).off('resize.'+this.options.ns);
      this.$drawer.addClass('destroy').removeClass('active');
      this.$el.removeClass('active');
      setTimeout($.proxy(function() {
        this.$drawer.removeAttr('style');
        setTimeout($.proxy(function() {
          this.$drawer.removeClass('destroy');
        }, this), 1);
      }, this), 1);


    }  /* \handle._destroy */

    ,_set_opt: function(prop, val) {
      if( this.options.hasOwnProperty(prop) ) {
        this.options[prop] = val;
      }
    } /* \_set_opt */

    ,_get: function(prop) {
      return this[prop];
    }

  };  /* \handle.prototype */

  //add obj to namespace
  nxnw.handle = handle;

  return nxnw.handle;


});