import paperMachine from 'utils/@paper-fsm/fsm.js'
import {interpret, State} from 'xstate'
import {Client} from 'projectRoot/utils/@line/bot-sdk.js'
import {_msgEvent, _followEvent} from 'utils/@handleEvent/line-eh.js'

const isMessage = (str) => {
    return str !== 'message'
}
const isText = (str) => {
    return str !== 'text'
}
const isImage = (str)=> {
    return str != 'image'
}


class LineBot {
    constructor(machine) {
        this.machine = machine
        this.client = new Client()
    }

    async msgEvent(event) {
        var that = this
        return _msgEvent(that, event)
    }

    async followEvent(event) {
        var that = this
        return _followEvent(that, event)
    }

    async handleEvent(event) {
        // console.log(this)
        switch(event.type){
            case 'message' :
                return this.msgEvent(event)
            case 'follow':
                return this.followEvent(event)
            case 'image':
                break
            default :
                break
        }
    }
}


export {
    LineBot
}

