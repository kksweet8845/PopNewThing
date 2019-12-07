import https from 'https'
import config from 'projectRoot/config.js'
import {_replyMessage} from 'projectRoot/utils/@line/message-line-api.js'
import path from 'path'


const msg_path = '/v2/bot/message/'

class Client {
    constructor(){
        this.keepAliveAgent = new https.Agent({keepAlive: true})
        this.replyMsgPath = path.join(msg_path, 'reply')
    }

    async replyMessage(replyToken, messages, note=true){
        try{
            return _replyMessage(replyToken, messages, this.keepAliveAgent, this.replyMsgPath , note)
        }catch(err){
            console.log(err)
        }
    }
}

export {
    Client
}