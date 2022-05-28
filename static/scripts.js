(function($) {
    "use strict";
    $(window).on("load", function() { /*...*/ });
})(jQuery);

jQuery(document).ready(function ($) {
    // Auth Form UI
    $('.switch-to-login').on('click',function () {
        $('.login-wrap').addClass('d-none');
        $('.register-wrap').removeClass('d-none');
    });
    $('.switch-to-register').on('click',function () {
        $('.login-wrap').removeClass('d-none');
        $('.register-wrap').addClass('d-none');
    });


    const socket = io({transports: ['websocket'], upgrade: false}); // init io
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const uMail = document.getElementById('umail');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    // crypt settings
    const pk = "MIICWwIBAAKBgQDXiJ4f2xUJDGYLpadURFDn4zMvTULlaXb3kuKHS9/N/Hlt91Iz UHM3gde4HA8vfum10ASBI4mXq+/g4xPHPDClzb0EZQ4i25FVNCniC1hz8/mdU3k5 LFWGmQRzVUmW/YyVJTNEfi+PWF9sWbw2Ai2ff62i69pjJCXTIv77VskLewIDAQAB AoGAeLTTUaXhZvrhn347cu77nJJaVRBg+ZgR/17srLbqdTMDUnmjOIfCrwBxrnNQ cdoSyzbffu9HHIE3S2wA5KCp4Pn+kwyIRLe0gBRKj8yz8d5ePnE4XTR7ujTVLveS aBkI8pgdbIUdEhSF4T/o/u8vuNYkinfMQUN5TIrwS39BIqECQQD5b4FQkhpmJ0cB fpKulznF4i+EotNj6snShz4dEMI5pNeZtU+fugaK1CEVTRQWE50b9IsVQVWRON2w pk2iZHnxAkEA3TS1fnAnLSOG1l2jBkSKM3KM6a2j5wfAbuqajYIwQk3enMvwQwTq i4w+gv2GvH5HynJiXN+sbB7LW8F8x2GQKwJAGNxoQyOMxgm8JgX7kLM56uM0YT/p WdgY7YbVRghZk20+n+9WVFEyPbwO4BSin+CslBC3nBK6+JJ2ZhjtO/ZPwQJAfPoB rKzqxWr0DHsc1za0KjsG+CN9ndLYWxI7PcYXQ+7A3i+uz/6gETWsP8/DZw2lu/CC OFy7Ct8fH/kiaXdqvwJAKOP0ToBgoCNikHmHxVtInKM6ycGXJPSURj1pB0E+UmAG Cyu2t0G0sIpid+CZoEfrGeBYWaNVmkraDm0Hr5RFGQ==";
    var crypt = new JSEncrypt();
    crypt.setKey(pk);



    $(emailInput).on('blur',function () {
        const url = '/getUName';
        const data = {
            email: $(this).val()
        };

        const get_uname = async function(url){
            const response = await fetch(url , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.status !== 200) throw new Error('not found!');
            return await response.json();
        };
        get_uname(url).then(data => {
            if (data.success) document.getElementById('uname').value =data.msg;
            else document.getElementById('uname').value = emailInput.value;
        }).catch(error => {
            console.error('Error:', error.message);
        })
    });

    $('.signin-form').on('change',function () {
       let email = emailInput.value;
       let pass = passInput.value;

       if (email !== '' && pass !== '') $('#login_btn').attr('disabled',false);
       else $('#login_btn').attr('disabled',true);
    });

    // login
    $(loginBtn).on('click',function () {
       socket.emit('auth', document.getElementById('uname').value);
    });

    // show messages
    $(form).on('submit',function (e) {
        e.preventDefault();
        if (input.value) {
            const msgData = {
                message: crypt.encrypt(input.value),
                email: uMail.value,
            };

            socket.emit('chat_msg', msgData);
            input.value = '';
        }
    });

    // emit events
    socket.on('chat_msg', function(data) {
        let {message,email} = data;

        message = crypt.decrypt(message);
        addMessage(message,email);
    });

    socket.on('join_message',(msg)=>{addJoinMessage(msg);});


    // Functions
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
    const addJoinMessage = (msg) => {
        let messagesContainer = $('#messages');
        $(messagesContainer).append(`  
            <li style="text-align: center;font-size: 85%;color: blueviolet;">
                <span style="vertical-align: super">${msg}</span>
            </li>
        `);
        window.scrollTo(0, document.body.scrollHeight);
    };
});


