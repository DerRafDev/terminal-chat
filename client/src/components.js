// Responsible for construct our layout

import blessed from 'blessed';

export default class componentsBuilder {
    constructor() { }
    #screen
    #layout
    #input
    #chat
    #status
    #activityLog

    #baseComponent() {
        //will return the property to create a component
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbar: {
                ch: ' ',
                inverse: true
            },

            // this tags is for having colors and tags in the text
            tags: true
        }
    }

    setScreen({ title }) {
        //this is for creating the windows of the application
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })

        //this is for exiting the chat room
        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

        return this
    }

    setLayoutComponent() {
        // this is for creating first the squares
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%',
        })

        return this
    }

    setInputComponent (onEnterPressed) {
        // this is for taking the text from the terminal
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        })

        input.key('enter', onEnterPressed)
        this.#input = input

        return this
    }

    setChatComponent() {
        this.#chat = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            align: 'left',
            width: '50%',
            height: '90%',
            items: ['{bold}Messanger{/}' ]
        })

        return this
    }

    setStatusComponent() {
        // this is for know the number of online users
        this.#status = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            items: ['{bold}Users on Room{/}' ]
        })
        return this
    }

    setActivityLogComponent() {
        // this is register if the user is entering or leaving the room
        this.#activityLog = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            style: {
                fg: 'yellow'
            },
            items: ['{bold}Activity Log{/}' ]
        })
        return this
    }

    build () {
        // this will be responsible to delivery a feature, to show on screen basically
        const components = {
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            activityLog: this.#activityLog,
            status: this.#status
        }

        return components
    }
}