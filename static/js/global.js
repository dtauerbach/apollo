$(document).ready(function() {
    $('.persona-login-btn').on('click', function() {
        function verifyAssertion(assertion) {
            $.ajax({
                url: '/persona_login',
                method: 'POST',
                data: {
                    assertion: assertion
                },
                success: function() {
                    window.location='/';
                }
            })
        }

        navigator.id.get(verifyAssertion, {
                     backgroundColor: "#606B72",
                     siteName: "Apollo"});
    });
});