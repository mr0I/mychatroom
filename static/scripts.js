(function($) {
    $(window).on("load", function() { /*...*/ });
})(jQuery);

jQuery(document).ready(function ($) {
    const socket = io({transports: ['websocket'], upgrade: false}); // init io
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const userMail = document.getElementById('user_mail');
    const loginBtn = document.getElementById('login_btn');

    // login
    $(loginBtn).on('click',function () {
        socket.emit('auth', document.getElementById('email').value);
        window.location.href = 'http://127.0.0.1:8080';
    });

    // emit events
    socket.on('chat_msg', function(data) {
        const {message,email} = data;
        addMessage(message,email);
    });
    socket.on('auth', (email) => {
        addNotif(email);
        if (document.getElementById('email')){
            document.getElementById('email').value = email;
        }
        if (document.getElementById('user_mail')){
            document.getElementById('user_mail').value = email;
        }
    });

    // show messages
    $(form).on('submit',function (e) {
        e.preventDefault();
        if (input.value) {
            const msgData = {
              message: input.value,
              email: userMail.value
            };
            socket.emit('chat_msg', msgData);
            input.value = '';
        }
    });


    // functions
    const addMessage = (msg,email='email@email.com') => {
       let messagesContainer = $('#messages');
       const emailMd5 = CryptoJS.MD5(email).toString();
       const imageSrc = `http://www.gravatar.com/avatar/${emailMd5}?rating=PG&size=24&size=50&d=identicon`;
        $(messagesContainer).append(`  
            <li>
                <img src=${imageSrc} alt="avatar" style=" border-radius: 50%; width: 24px;"> 
                <span style="vertical-align: super">${msg}</span>
            </li>
        `);
        window.scrollTo(0, document.body.scrollHeight);
    };
    const addNotif = (msg) => {
        let messagesContainer = $('#messages');
        $(messagesContainer).append(`  
            <li style="text-align: center;font-size: 85%;color: #555;">
                <span style="vertical-align: super">${msg}</span>
            </li>
        `);
        window.scrollTo(0, document.body.scrollHeight);
    }
});


