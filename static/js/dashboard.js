$(document).ready(function() {
    // Search field
    $('#search_field').on('keyup', function() {
        var typedTokens = $(this).val().split(' ');
        var panel = $(this).closest('.panel');

        // Field is empty, so show everything
        if (typedTokens.length == 0) {
            panel.find('.data-source').show();
            return;
        }

        console.log($(panel).find('.data-source'))
        $(panel).find('.data-source').each(function(idx, el) {
            // Search the keywords and the data source name
            var haystackTokens = $(el).attr('data-source-keywords').split(' ');
            haystackTokens.push($(el).attr('data-source-name'));

            // For each space-separated token the user types...
            var tokenMatches = typedTokens.map(function(typedTok) {
                // Return true if there's a substring match
                return haystackTokens.map(function(tok) {
                    return tok.indexOf(typedTok) != -1;
                }).indexOf(true) != -1;
            });
            // If there's a single substring match between a typed token
            // and one of the haystack tokens, show.
            if (tokenMatches.indexOf(true) != -1) {
                $(el).show();
            }
            else {
                $(el).hide();   
            }
        });

    });

    // Make side menu collapsable
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