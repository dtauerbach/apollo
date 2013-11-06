$(document).ready(function() {
    var csrftoken = $('meta[name=csrf-token]').attr('content')

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken)
            }
        }
    });

    $('.persona-login-btn').on('click', function() {
        function verifyAssertion(assertion) {
            $.ajax({
                url: '/persona_login',
                method: 'POST',
                dataType: 'json',
                data: {
                    assertion: assertion
                },
                success: function(data) {
                    console.log(data);
                    if (data.success) {
                        window.location='/dashboard';
                    }
                    else {
                        alert(data.error);
                    }
                }
            })
        }

        navigator.id.get(verifyAssertion, {
                     backgroundColor: "#606B72",
                     siteName: "Apollo"});
    });
});