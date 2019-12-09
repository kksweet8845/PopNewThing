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
        var regex = RegExp('SEARCH [0-9]+')
        if(regex.test(event.message.text)){
            var [eventType, year] = event.message.text.split(' ')
        }
        service.send({
            type: regex.test(event.message.text) ? eventType : event.message.text,
            client : that.client,
            event,
            curState : event.message.text.toLowerCase(),
            year : regex.test(event.message.text) ? year : event.message.text,
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
        }else{
            const resolvedState = _getResolveState(that.machine, doc.curState)
            let service = interpret(that.machine).start(resolvedState)
            console.log(service.state.value)
            if(service.state.value == 'welcome'){
                service.send({
                    type: 'SHORTCOME',
                    client : that.client,
                    event,
                    curState : service.state
                })
            }
            doc.curState = JSON.stringify(service.state)
            await doc.save()
        }
    }catch(err){
        console.log(err)
    }
}


export {
    _msgEvent,
    _followEvent,
}
