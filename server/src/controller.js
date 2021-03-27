// Responsible for mapping the events comming for socket

import { constants } from "./constants.js"

export default class Controller {
    #users = new Map()
    #rooms = new Map()

    constructor({ socketServer }) {
        this.socketServer = socketServer
    }
    onNewConnection(socket) {
        const { id } = socket
        console.log('connection stablished with', id)
        const userData = { id, socket }
        this.#updateGlobalUserData(id, userData)

        socket.on('data', this.#onSocketData(id))
        socket.on('error', this.#onSocketClosed(id))
        socket.on('end', this.#onSocketClosed(id))
    }

    async joinRoom(socketId, data) {
        //this is for when the user enter in the room
        const userData = data
        console.log(`${userData.userName} joined! ${[socketId]}`)
        const user = this.#updateGlobalUserData(socketId, userData)

        const { roomId } = userData
        const users = this.#joinUserOnRoom(roomId, user)

        // this will update the users array about all the users
        // that are already connected to the same room
        const currentUsers = Array.from(users.values())
            .map(({ id, userName }) => ({ userName, id }))


        // this will update the user that just connected with which users are
        // already connected in the same room
        this.socketServer
            .sendMessage(user.socket, constants.event.UPDATE_USERS, currentUsers)

        // this will tell that a new user is connected
        this.broadCast({
            socketId,
            roomId,
            message: { id: socketId, userName: userData.userName},
            event: constants.event.NEW_USER_CONNECTED,
        })

    }
    
    broadCast({ socketId, roomId, event, message, includeCurrentSocket = false }) {
        //this is for showing for all the users the new user in the room
        const usersOnRoom = this.#rooms.get(roomId)

        for (const [key, user] of usersOnRoom) {
            if(!includeCurrentSocket && key === socketId) continue;

            this.socketServer.sendMessage(user.socket, event, message)
        }

    }

    #joinUserOnRoom(roomId, user) {
        //this is for manage the users in the room
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map()
        usersOnRoom.set(user.id, user)
        this.#rooms.set(roomId, usersOnRoom)

        return usersOnRoom
    }

    #onSocketClosed(id) {
        return data => {
            console.log('onSocketClosed', id)
        }
    }

    #onSocketData(id) {
        return data => {
            try {
                const { event, message } = JSON.parse(data)
                this[event](id, message)

            } catch (error) {
                console.error(`wrong event format!!`, error, data.toString())
            }

        }
    }

    #updateGlobalUserData(socketId, userData) {
        const users = this.#users
        const user = users.get(socketId) ?? {}

        const updatedUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updatedUserData)

        return users.get(socketId)
    }
}