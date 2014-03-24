/*
 * CSS required for drawer functionality. This needs to be added to the main css file to avoid any flashing of the
 * content.
 *
 * The transition effect can be adjusted for the site as needed
 */

.drawer {
	height: 0;
	overflow: hidden;
	-webkit-transition: height 1s ease-in-out;
	transition: height 1s ease-in-out;
}

.drawer.open {
	overflow: visible;
}

/* keep transition at 0.1 so that transition.end fires so we can remove the immediate class */
.drawer.immediate {
	-webkit-transition: height 0.1s linear;
	transition: height 0.1s linear;
}

/*
 * OPTIONS
 * overflow: /* removes overflow from drawer at animation end when open */ [true,false] - default: false
 * height: /* overrides height of drawer-inner with a passed in height, can be in px, em or % */ - default: 'auto'
 * duration /* duration for non-csstransition browsers using jquery animate, should match CSS timing */ - default 2000
 */

/*
 * The handle plugin takes an object for the arguments
 * The element, drawer and drawer inner parameters are expected to be a jquery selector obj
 */

 var args = {
	el: $('#handle'),
	drawer: $('.drawer'),
	drawer_inner: $('.drawer-inner')
};

new nxnw.handle(args);

/*
 * CAROUSEL HTML SKELETON
 */

<div class="drawer" id="drawer_selector">
	<div class="drawer-inner">
		<!-- content goes here -->
	</div>
</div>