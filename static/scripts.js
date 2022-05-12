(function($) {
    $(window).on("load", function() { /*...*/ });
})(jQuery);

jQuery(document).ready(function ($) {
    // const socket = io();
    const socket = io({transports: ['websocket'], upgrade: false});

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const loginBtn = document.getElementById('login_btn');

    $(form).on('submit',function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat_msg', input.value);
            input.value = '';
        }
    });

    socket.on('chat_msg', function(msg) {addMessage(msg)});
    socket.on('user.events', function(msg) {addMessage(msg)});

    // login
    $(loginBtn).on('click',function () {
        socket.emit('name', document.getElementById('name').value);
    });
    socket.on('name', (name) => addMessage(name + ' says Hello!'));




    // functions
    const addMessage = (msg) => {
        let item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }

});


