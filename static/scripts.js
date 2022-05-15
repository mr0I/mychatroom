(function($) {
    $(window).on("load", function() { /*...*/ });
})(jQuery);

jQuery(document).ready(function ($) {
    const socket = io({transports: ['websocket'], upgrade: false}); // init io
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const loginBtn = document.getElementById('login_btn');

    // login
    $(loginBtn).on('click',function () {
        socket.emit('auth', document.getElementById('email').value);
        window.location.href = 'http://127.0.0.1:8080';
    });

    // emit events
    socket.on('chat_msg', function(msg) {addMessage(msg)});
    socket.on('user.events', function(msg) {addMessage(msg)});
    //socket.on('event', function(msg) {addMessage(msg)});
    socket.on('auth', (email) => {
        addMessage(email);
        if (document.getElementById('email')){
        document.getElementById('email').value = email;
        }
    });

    // show messages
    $(form).on('submit',function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat_msg', input.value);
            input.value = '';
        }
    });


    // functions
    const addMessage = (msg) => {
       let messagesContainer = $('#messages');
        $(messagesContainer).append(`  
            <li>
                <img src="http://www.gravatar.com/avatar/d08d546f442dff7694dcdfa967cfcd6e?rating=PG&size=24&size=50&d=identicon" 
                alt="avatar" style=" border-radius: 50%; width: 24px;"> 
                <span style="vertical-align: super">${msg}</span>
            </li>
        `);
        window.scrollTo(0, document.body.scrollHeight);
    }
});


