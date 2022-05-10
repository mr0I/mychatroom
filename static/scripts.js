(function($) {
    $(window).on("load", function() { /*...*/ });
})(jQuery);

jQuery(document).ready(function ($) {
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    $(form).on('submit',function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });

});


