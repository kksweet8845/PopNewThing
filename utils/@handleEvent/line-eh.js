import {interpret, State, send} from 'xstate'
import paperMachine from 'utils/@paper-fsm/fsm.js'
import {User} from 'projectRoot/models/User.js'
import {mongoose} from 'projectRoot/db/mongoose.js'
import {_getResolveState, } from 'utils/@paper-fsm/lib.js'
import {Storage} from '@google-cloud/storage'
import fs from 'fs'
import config from 'projectRoot/config.js'


const sleep = (nsec) =>  new  Promise ( ( res, rej ) => setTimeout(res, nsec*1000 ));


const gotoEntrance = (machine) => {
    const { initialState } = machine
    const entranceState = machine.transition(initialState, 'SHORTCOME')
    return entranceState
}

const gotoLobby = (machine) => {
    const {initialState} = machine
    const entState = machine.transition(initialState, 'SHORTCOME')
    const lobbyState = machine.transition(entState, 'START')
    return lobbyState
}

const textHandler = async (that, event) => {
    try{
        var doc = await User.findOne({
            userId : event.source.userId
        })

        if(doc == null){
            // if there is no record
            var service = interpret(that.machine)
                            .onTransition(s => console.log(`Current state : ${s.value}`))
                            .start()
            service.send({type : 'WELCOME'})
        }else{
            const stateStr = fs.readFileSync(`${config.projectRoot}/history/${event.source.userId}.json`,{encoding: 'utf8'})
            const curState = _getResolveState(that.machine, stateStr)
            var service = interpret(that.machine)
                            .onTransition(s => console.log(`Current state : ${JSON.stringify(s.value, null, 2)}`))
                            .start(curState)
        }
        var searchRegex = RegExp('SEARCH [0-9]+')
        var favorRegex = RegExp('FAVORITE https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}')
        var parseT = Boolean(searchRegex.test(event.message.text) || favorRegex.test(event.message.text))
        console.log(parseT)
        if(parseT){
            var [eventType, value] = event.message.text.split(' ')
        }
        service.send({
            type: parseT ? eventType : event.message.text,
            client : that.client,
            event,
            curState : event.message.text.toLowerCase(),
            year : parseT ? value : event.message.text,
            url : parseT ? value : event.message.text
        })
        await sleep(1)
        var doc = await User.findOne({
            userId : event.source.userId
        })
        if(service.state.value == 'register' && doc){
            service.send({
                type : 'SUCCESS',
            })
            doc.curState = 'entrance'
            await doc.save()
        }else if(service.state.value == 'register' && !doc){
            service.send({
                type : 'FAIL'
            })
        }
        if(doc){
            doc.curState = service.state.vallue
            const savedDoc = await doc.save()
            console.log(savedDoc)
        }
        fs.writeFileSync(`${config.projectRoot}/history/${event.source.userId}.json`,
                          JSON.stringify(service.state, null, 2))

    }catch(err){
        console.log(err)
    }
}


const _msgEvent = (that, event) => {
    try{
        switch(event.message.type) {
            case 'text' :
                return textHandler(that, event)
            case 'image':
                break
            case 'video':
                break
            case 'audio':
                break
            case 'file':
                break
            case 'location':
                break
            case 'sticker':
                break
            default:
                break
        }
    }catch(err){
        console.log(err)
    }
}

const _followEvent = async (that, event) => {
    try {
        // when follow
        // for test
        const doc = await User.findOne({
            userId : event.source.userId
        })
        if(doc == null){
            let service = interpret(that.machine).start()
            return service.send({
                type : 'WELCOME',
                replyToken : event.replyToken,
                client : that.client
            })
        }
    }catch(err){
        console.log(err)
    }
}

const _unfollowEvent = async (event) => {
    try{
        const res = await User.deleteOne({
            userId : event.source.userId
        })
        if(res.ok){
            console.log(`Delete user : ${event.source.userId}`)
        }
    }catch(err){
        console.log(err)
    }
}

export {
    _msgEvent,
    _followEvent,
    _unfollowEvent,
}
