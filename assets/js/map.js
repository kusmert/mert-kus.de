window.map = {
    mapType: 'ROADMAP',
    mapZoom: 12,
    mapStyle: 'tardo-default',
    mapScroll: 'on',
    marker: 'show',
    label: '<strong>8th avenue, New York</strong>',
    lat: '40.740957',
    lng: '-74.002119',
    markerURL: 'assets/images/svg/shape-triangle.svg'
};

'use strict';

jQuery(document).ready(function( $ ) {

    $('.google-map').each( function() {
        var mapDiv = $(this);
        var mapData = window[mapDiv.attr('id')];

         // Our custom marker label overlay
        var MarkerLabel = function(options) {

            var self = this;
            this.setValues(options);

            // Create the label container
            this.div = document.createElement('div');
            this.div.className = 'map-marker-label';

            // Trigger the marker click handler if clicking on the label
            // google.maps.event.addDomListener(this.div, 'click', function(e){
            //     (e.stopPropagation) && e.stopPropagation();
            //     google.maps.event.trigger(self.marker, 'click');
            // });
        };

        MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
            onAdd: function() {
                this.getPanes().overlayImage.appendChild(this.div);

                // Ensures the label is redrawn if the text or position is changed.
                var self = this;
                this.listeners = [
                    google.maps.event.addListener(this, 'position_changed', function() { self.draw(); }),
                    google.maps.event.addListener(this, 'text_changed', function() { self.draw(); }),
                    google.maps.event.addListener(this, 'zindex_changed', function() { self.draw(); })
                ];
            },
            onRemove: function() {
                this.div.parentNode.removeChild(this.div);
                // Label is removed from the map, stop updating its position/text
                for (var i = 0, l = this.listeners.length; i < l; ++i) {
                    google.maps.event.removeListener(this.listeners[i]);
                }
            },
            draw: function() {
                var
                    text = String(this.get('text')),
                    markerSize = this.marker.icon.anchor,
                    position = this.getProjection().fromLatLngToDivPixel(this.get('position')),
                    labelHeight,
                    labelWidth;

                this.div.innerHTML = text;
                this.div.style.position = 'relative';
                // dynamically grab the label height/width in order to properly position it vertically/horizontally.
                labelHeight = $('div.map-marker-label').outerHeight();
                labelWidth = $('div.map-marker-label').outerWidth();
                this.div.style.left = (position.x - (labelWidth / 2))  + 'px';
                this.div.style.top = (position.y - markerSize.y - labelHeight -10) + 'px';

            }
        });

        var Marker = function(options){

            google.maps.Marker.apply(this, arguments);
            if (options.label) {
                this.MarkerLabel = new MarkerLabel({
                    map: this.map,
                    marker: this,
                    text: options.label
                });
                this.MarkerLabel.bindTo('position', this, 'position');
            }
        };

        Marker.prototype = $.extend(new google.maps.Marker(), {
            // If we're adding/removing the marker from the map, we need to do the same for the marker label overlay
            setMap: function(){
                google.maps.Marker.prototype.setMap.apply(this, arguments);
                if (this.MarkerLabel) {
                    this.MarkerLabel.setMap.apply(this.MarkerLabel, arguments);
                }
            }
        });


        function createMap( position ) {
            var map;

            var style = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#e94f3f"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"gamma":"0.50"},{"hue":"#ff4a00"},{"lightness":"-79"},{"saturation":"-86"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"hue":"#ff1700"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#e74231"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#4d6447"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#f0ce41"},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"color":"#363f42"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#231f20"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#6c5e53"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#313639"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#0e171d"}]}];

            var options = {
                zoom: parseInt( mapData.mapZoom, 13 ),
                center: position,
                scrollwheel: false,
                draggable: mapData.mapScroll === 'on',
                mapTypeId: google.maps.MapTypeId[mapData.mapType]
            };

            map = new google.maps.Map(mapDiv[0], options);
            var marker;

            if( mapData.mapStyle === 'tardo-default' ) {
                map.setOptions({
                    styles: style
                });
            }

            if( mapData.marker === 'show' ) {
                var image = {
                    url: mapData.markerURL,
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 30)
                };

                marker = new Marker({
                    label: mapData.label,
                    position: position,
                    icon:image,
                    map: map
                });
            }
        }

        if( undefined !== mapData.address ) {
            // lookup address
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': mapData.address}, function(results, status) {
                if(status === google.maps.GeocoderStatus.OK) {
                    createMap( results[0].geometry.location );
                }
                else {
                    alert( 'Geocode was not successful for the following reason: ' + status );
                }
            });
        }
        else if( undefined !== mapData.lat && undefined !== mapData.lng ) {
            createMap( new google.maps.LatLng(mapData.lat, mapData.lng) );
        }
    });
});