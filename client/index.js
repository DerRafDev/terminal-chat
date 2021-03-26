/*
node index.js \
    --username derRaf \
    --room room01 \
    --hostUri localhost
*/

import Events from 'events'
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalController.js";

//this is for getting all the commands to enter the room
const [nodePath, filePath, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)
console.log('config', config)

const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.initialize()

const controller = new TerminalController()
await controller.initializeTable(componentEmitter)

