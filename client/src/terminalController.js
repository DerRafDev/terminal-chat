//this will be the mediator who will initialize the application
import ComponentsBuilder from './components.js'
import { constants } from './constants.js'

export default class TerminalController {
    #usersCollors = new Map()

    constructor() {}

    #pickCollor() {
        //this is for getting a random color for the user
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserCollor(userName) {
        //this is for getting the collor for the user
        if (this.#usersCollors.has(userName))
            return this.#usersCollors.get(userName)

        const collor = this.#pickCollor() //this is for pick the aleatory collor
        this.#usersCollors.set(userName, collor)

        return collor
    }

    #onInputReceived(eventEmitter) {
        //this will tell the backend that a new Message is aparing

        return function () {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }
    
    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserCollor(userName)

            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)

            screen.render()
        }
    }

    #onStatusChanged({ screen, status }) {

        // this will have the array of user, for example ['derraf', 'john']
        return users => {

            //let's get the first element of the list
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            }) 
            
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }) {

        return msg => {
            // derRaf left
            // derRaf join

            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)

            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components) {
        //this is for emitting and listening to the event in the window
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }
    
    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({ title: 'TerminalChat - DerRafDev'})
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
    }
}