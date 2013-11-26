var servicesObj = {};

$(document).ready(function() {
    // Download services JSON, render list
    populateList();

    // Services modal
    $('.services-container').on('click', '.data-source', function() {
        var serviceName = $(this).attr('data-source-name');
        $('#serviceModal .service-name').html(servicesObj[serviceName].full_name);
        $('#serviceModal .service-connection').hide();
        $('#serviceModal .service-' + servicesObj[serviceName].connect_type).show();
        $('#serviceModal .service-icon').attr('src', servicesObj[serviceName].icon);
        $('#serviceModal').modal({
            show: true
        });
    });

    // Search field
    $('#search_field').on('keyup', function() {
        var typedTokens = $(this).val().toLowerCase().split(' ');
        var panel = $(this).closest('.panel');

        // Field is empty, so show everything
        if (typedTokens.length == 0) {
            panel.find('.data-source').show();
            return;
        }

        $(panel).find('.data-source').each(function(idx, el) {
            // Search the keywords and the data source name
            var serviceName = $(el).attr('data-source-name');
            // Copy array by value using slice(0), since we're going to push 
            // something new onto it.
            var haystackTokens = servicesObj[serviceName].keywords.slice(0);
            haystackTokens.push(serviceName.toLowerCase());

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

function populateList() {
    $.getJSON('/services.json', function(data) {
        servicesObj = data.services;
        for (var serviceName in servicesObj) {
            var $serviceDiv = $("<div>").attr('data-source-name', serviceName);
            $serviceDiv.addClass('data-source');
            var $serviceP = $("<p>" + servicesObj[serviceName].full_name + "</p>");
            $serviceP.addClass('data-source-label');
            $serviceP.addClass('text-center');
            $serviceDiv.append($serviceP)
            $('.services-container').append($serviceDiv);
        }
    });
}

// note this is only a demo for 23andme, but linked to ALL scraping forms right now
function connectStream() {
  var formData = {scrapeEmail: $("#scrapeEmail").val(),
                 scrapePassword: $("#scrapePassword").val()};
  $.ajax({url: "/connect/23andme/1",
          type: "POST",
          data: JSON.stringify(formData),
          contentType: 'application/json;charset=UTF-8',
         })
    .done(function(data) {
      var template = '<form role="form"> \
        <div class="form-group"> \
        <label for="secretAnswer">' + data + '</label> \
        <input type="password" class="form-control" id="secretAnswer" placeholder="answer"> \
        </div> \
        <button type="submit" class="btn btn-primary" onclick="finishConnecting();"> \
          Connect \
        </button> \
        </form>';
      $('div.service-scraping').html(template);
  });
  $('div.service-scraping').html("<center><h2>Connecting...</h2><br>(there should be a graphic here)</center>");
}

// note this is only a demo for 23andme, but linked to ALL scraping forms right now
function finishConnecting() {
  $('div.service-scraping').html("<center><h2>You have finished connecting 23andme. Please note that the data may take a few minutes to load </h2></center>");
}