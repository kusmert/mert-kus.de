/* ========================================================================

TARDO: theme.js
Main Theme JS file

@Author: Andrew ch 
@URL: http://andrewch.eu
 
=========================================================================
 */

'use strict';

jQuery(document).ready(function( $ ) {

    //Stellar
    //===================
    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 0,
        responsive:true
    });
    
    $('.swiper-slide').stellar();

    //Home Slider
    //===================
    var swiper = new Swiper('.swiper-container-home', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
    });

    //Twitter Slider
    //===================
    var swiper = new Swiper('.swiper-container-twitter', {
        pagination: '.swiper-pagination',        
        paginationClickable: true,
        slidesPerView: 1,
        loopAdditionalSlides:3  //<-- This one

    });

    // Init On scroll animations
    //======================
    
    function onScrollInit( items, trigger ) {
        items.each( function() {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-os-animation'),
                osAnimationDelay = osElement.attr('data-os-animation-delay');

            osElement.css({
                '-webkit-animation-delay':  osAnimationDelay,
                '-moz-animation-delay':     osAnimationDelay,
                'animation-delay':          osAnimationDelay
            });

            var osTrigger = ( trigger ) ? trigger : osElement;

            osTrigger.waypoint(function() {
                osElement.addClass('animated').addClass(osAnimationClass);
            },{
                triggerOnce: true,
                offset: '90%'
            });
        });
    }

    Pace.on('done', function() {
        setTimeout(function() {
          onScrollInit( $('.os-animation') );
          onScrollInit( $('.staggered-animation'), $('.staggered-animation-container') );
        }, 500);
    });


    // Mobile Menu    
    // ======================

    // Mobile Menu Trigger
    $('.toggle-menu').jPushMenu({
        closeOnClickLink: false
    });

    /* - Mobile list dropdown menu expand using simple expand plugin - */

    $('.expander').simpleexpand();
	
    // Portfolio Isotope
    // ======================

    function isotopeInit() {
        $('.masonry').each( function( index, element ) {
            var $container = $(element);
            var $items = $container.find( '.masonry-item' );
            var padding = $container.attr( 'data-padding' );
            var isFullWidth = $container.parents( '.container-fullwidth' ).length > 0;
            // On fullscreen portfolio add negative margin on left and right and add 4pixel upon that for the loss after rounding
            var containerPadding = -padding / 2;

            $container.css({
                margin: '0 ' + containerPadding + 'px'
            });
            $container.imagesLoaded().always( function( loadedContainer ) {
                setTimeout( function() {
                    var columns = 3;
                    var screenWidth = $(window).width();

                    var wideColumns = 2;

                    if( screenWidth < 768 ) {
                        columns = $container.attr( 'data-col-xs' );
                        wideColumns = 1;
                    }
                    else if( screenWidth < 992 ) {
                        columns = $container.attr( 'data-col-sm' );
                        wideColumns =  1;
                    }
                    else if( screenWidth < 1200 ) {
                        columns = $container.attr( 'data-col-md' );
                        wideColumns =  2 ;
                    }
                    else if( screenWidth > 1200 ) {
                        columns = $container.attr( 'data-col-lg' );
                        wideColumns =  2 ;
                    }

                    // calculate item width and paddings
                    var itemWidth;
                    if ( $container.hasClass( 'use-masonry' ) ) {
                        $items.each(function() {
                            // Set the masonry column width
                            itemWidth = Math.floor( $container.width() / columns );

                            var item  = $(this);
                            if( item.hasClass( 'masonry-wide' ) ) {
                                item.css( 'width', itemWidth * wideColumns );
                            }
                            else {
                                item.css( 'width', itemWidth );
                            }
                        });
                    }
                    else {
                        itemWidth = Math.floor( $container.width() / columns );
                        $items.css( 'width', itemWidth );
                    }

                    $items.find('.figure,.post-masonry-inner').css( 'padding', padding / 2 + 'px' );

                    // wait for possible flexsliders to render before rendering isotope
                    $container.isotope( {
                        itemSelector: '.masonry-item',
                        getSortData : {
                            default: function ( $elem ) {
                                return parseInt( $elem.attr( 'data-menu-order',10 ) );
                            },
                            title: function ( $elem ) {
                                return $elem.attr( 'data-title' );
                            },
                            date: function ( $elem ) {
                                return Date.parse( $elem.attr( 'data-date' ) );
                            },
                            comments: function( $elem ) {
                                return parseInt( $elem.attr( 'data-comments',10 ) );
                            }
                        },
                        sortBy: 'default',
                        layoutMode: $container.attr( 'data-layout' ),
                        resizable: false,
                        masonry: {
                            columnWidth: itemWidth,
                            gutter: padding
                        }
                    }, function(){
                        // refresh waypoints after layout
                        $.waypoints('refresh');
                        $container.removeClass( 'no-transition' );
                        onScrollInit( $items.find( '.portfolio-os-animation' ), $container );
                        onScrollInit( $items.find( '.blog-os-animation' ), $container );
                    });
                },200);
				
				// Gallery Sorting
				// store filter for each group
				  var filters = {};

				  $('#three').on( 'click', 'a.portfolio-filter', function() {
					var $this = $(this);
					// get group key
					var $buttonGroup = $this.parents('.data-filter-categories');
					var filterGroup = $buttonGroup.attr('data-filter');
					// set filter for group
					filters[ filterGroup ] = $this.attr('data-filter');
					// combine filters
					var filterValue = '';
					for ( var prop in filters ) {
					  filterValue += filters[ prop ];
					}
					// set filter for Isotope
					$container.isotope({ filter: filterValue });
				  });
            });
        });
    }

    // Re initialise isotope on window resize
    $(window).smartresize(function(){
        isotopeInit();
    });

    // Init the isotope
    isotopeInit();
	
    $('.data-filter-toggle').click(function() {
    $('.data-filter-toggle').toggleClass("rotated");
    $('.data-filter-categories').toggleClass("filter-visible");
    //$('ul.data-filter-categories li').each(function(i){
    	//var t = $(this);
    	//setTimeout(function(){ t.addClass('bounce'); }, (i+1) * 50);
    //});
    });
	
    // Magnific Image Popup
    // ======================

    $('.magnific').magnificPopup({
        type:'image',
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });

    // Magnific Video Popup
    // ======================

    $('.magnific-youtube, .magnific-vimeo, .magnific-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 300,
        preloader: false,
        fixedContentPos: false
    });

    // Magnific Gallery Popup
    // ======================

    $('.magnific-gallery').each(function(index , value){
        var gallery = $(this);
        var galleryImages = $(this).data('links').split(',');
        var items = [];
        for(var i=0;i<galleryImages.length; i++){
            items.push({
                src:galleryImages[i],
                title:''
            });
        }
        gallery.magnificPopup({
            mainClass: 'mfp-fade',
            items:items,
            gallery:{
                enabled:true,
                tPrev: $(this).data('prev-text'),
                tNext: $(this).data('next-text')
            },
            type: 'image'
        });
    });

    // Countdown
    // ======================

    $('.counter').each(function() {
        var $counter = $(this);
        var $odometer = $counter.find('.odometer-counter');
        if($odometer.length > 0 ) {
            var od = new Odometer({
                el: $odometer[0],
                value: $odometer.text(),
                format: $counter.attr('data-format')
            });
            $counter.waypoint(function() {
                window.setTimeout(function() {
                    $odometer.html( $counter.attr( 'data-count' ) );
                }, 500);
            },{
                triggerOnce: true,
                offset: 'bottom-in-view'
            });
        }
    });

     // Goto top button
    // ======================

    // Animate the scroll to top
    $('.go-top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
    });

});
