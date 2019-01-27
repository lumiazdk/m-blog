export default function SocketIOClient() {
    if (localStorage.token) {
        global.socket.emit('newUser', { user_name: 'name', user_id: 'id' })
        global.socket.on('show', function () {
            console.log('show')
        })
    }
}