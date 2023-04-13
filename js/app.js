(function ( $ ) {
    $( '#dp-slider' ).dpTileSlider({
        auto: 'true',
        nav: 'false',
        pager: 'false',
        timeout: 3000
    });

    setInterval(function() {
        window.location = window.location;
    }, 1000 * 60 * 10);

})( jQuery );