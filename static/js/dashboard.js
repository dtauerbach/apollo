$(document).ready(function() {

    $('#collapse_btn').on('click', function() {
        // Unhide uncollapse button
        $('#collapse_btn_col').removeClass('collapsed');
        // Hide side panel
        $('#panel_col').addClass('collapsed');
        // Widen main area
        $('#main_col').removeClass('col-md-8');
        $('#main_col').addClass('col-md-11');
    });

    $('#uncollapse_btn').on('click', function() {
        // Hide uncollapse button
        $('#collapse_btn_col').addClass('collapsed');
        // Show side panel
        $('#panel_col').removeClass('collapsed');
        // Shorten main area
        $('#main_col').removeClass('col-md-11');
        $('#main_col').addClass('col-md-8');
    });
});