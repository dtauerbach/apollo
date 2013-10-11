$(document).ready(function() {
    $('input[name="sharing-preference"]').on('change', function() {
        var sharingPreference = $('input:checked').attr('value');
        $('.explanation-blurb').hide();
        $('.explanation-blurb[data-preference="' + sharingPreference + '"]').show();
    });
});