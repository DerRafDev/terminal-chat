import SocketServer from "./socket.js";
import Event from 'events'
import Controller from "./controller.js";
import { constants } from "./constants.js";

const eventEmitter = new Event()


//this is just a test for see if the server and client is working
/*
async function testServer() {
    const options = {
        port: 9898,
        host: 'localhost',
        headers: {
            Connection: 'Upgrade',
            Upgrade: 'websocket'
        }

    }

    const http = await import('http')
    const req = http.request(options)
    req.end()

    req.on('upgrade', (res, socket) => {
        socket.on('data', data => {
            console.log('client received', data.toString())
        })

        setInterval(() => {
            socket.write('Hello!')
        }, 500);
    })
}
*/


const port = process.env.PORT || 9898
const socketServer = new SocketServer ({ port })
const server = await socketServer.initialize(eventEmitter)
console.log('socket server is running at', server.address().port)

const controller = new Controller({ socketServer })
eventEmitter.on(
    constants.event.NEW_USER_CONNECTED,
    controller.onNewConnection.bind(controller)
)

/* this is a test for showing if a new user is connecting the application
eventEmitter.on(constants.event.NEW_USER_CONNECTED, (socket) => {
    console.log('new connection!!', socket.id)
    socket.on('data', data => {
        console.log('server received', data.toString())
        socket.write('World!')
    })
})

await testServer()
*/

