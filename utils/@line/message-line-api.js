import {POST} from 'projectRoot/utils/@line/request.js'
import config from 'projectRoot/config.js'



const header_h = (type, auth) => {
    return {
        'Content-Type': type,
        'Authorization' : auth
    }
}

const _replyMessage = (replyToken, msg, agent, path, note) => {
    try {
        if(!(msg instanceof Array)){
            const err = new Error('The messages is not array')
            err.status = 500
            throw err
        }
        return POST({
            hostname: config.agent.hostname,
            path: path,
            headers : header_h('application/json', config.agent.auth),
            agent: agent
        },{
            'replyToken' : replyToken,
            'messages' : msg,
            notificationDisabled: note
        })
    }catch(err){
        console.log(err)
        if(err.status){
            console.log(err)
            throw err
        }
    }
}



export {
    _replyMessage,
}

