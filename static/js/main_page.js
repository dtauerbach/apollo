$(document).ready(function() {
    updateScrollingJumbotrons();
    $(document).on('scroll', function(e) {
        // Look through each jumbotron with scrolling image
        updateScrollingJumbotrons();
    });
});

function updateScrollingJumbotrons() {
    $('.jumbotron').each(function(idx,el) {
        // Position and height of this jumbotron
        var elPos = $(el).position();
        var elHeight = $(el).height();
        // Y coordinate of vertical scroll
        var scrollPos = $('body').scrollTop();
        // Height of viewport
        var winHeight = $(window).height();
        // Is this jumbotron out of view? If so, bail.
        if (scrollPos > elPos.top + elHeight ||
            scrollPos+winHeight < elPos.top) {
            return;
        }
        // Calculate the new background position value, such that it reaches
        // 100% when the bottom of the image touches the top of the viewport.
        var val = parseFloat(scrollPos)/(elPos.top+elHeight)*100;
        // This is a bit confusing, but basically show the jumbotron labelled
        // "top50" to scroll through the top half of the image, and the one
        // labelled "bottom50" to show the bottom half.
        if ($(el).attr('data-scroll-img') == 'top50') {
            val /= 2;
        }
        else if ($(el).attr('data-scroll-img') == 'bottom50') {
            val = 50 + val/2;
        }
        $(el).css('background-position-y', val.toString() + '%');
    });
}