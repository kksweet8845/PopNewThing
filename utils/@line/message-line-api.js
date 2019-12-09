import {POST, GET} from 'projectRoot/utils/request.js'
import config from 'projectRoot/config.js'
import path from 'path'

const msg_path = '/v2/bot/message/'
const header_h = (type, auth) => {
    return {
        'Content-Type': type,
        'Authorization' : auth
    }
}

const _replyMessage = async (replyToken, msg, agent, path, note) => {
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

const _getMessageContent = (messageId, agent) => {
    try{
        return GET({
            hostname : config.agent.get_content,
            path : path.join(msg_path, messageId, 'content'),
            headers : {
                'Authorization' : config.agent.auth
            },
            agent : agent
        })
    }catch(err){
        console.log(err)
    }
}

export {
    _replyMessage,
    _getMessageContent,
}

