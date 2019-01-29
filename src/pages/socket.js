export default function SocketIOClient() {
    if (localStorage.token) {
        global.socket.emit('newUser', { user_name: JSON.parse(localStorage.userInfo).user_name, user_id: JSON.parse(localStorage.userInfo).user_id })
        global.socket.on('show', function () {
            console.log('show')
        })
    }
}