/* start socketping */
// on index.js
socket.on('socketping', () => {
    console.log('Received socketping, sending socketpong');
    socket.emit('socketpong');
});

// on javascript
socket.emit('socketping');
socket.on('socketpong', () => {
    console.log('socketpong');
    setTimeout(() => socket.emit('socketping'), 2000);
});
/* end socketping */
