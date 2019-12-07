import express from 'express'
import config from 'projectRoot/config.js'
import fs from 'fs'
import crypto from 'crypto'
import {middleware} from '@line/bot-sdk'
import https from 'https'
import {Client} from 'projectRoot/utils/@line/bot-sdk.js'
import { AssertionError } from 'assert'



const app = express()

const client = new Client()

const keepAliveAgent = new https.Agent({keepAlive: true})


app.use(middleware(config.line))
app.use(express.json())
/* Based on body-parser*/
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: '5GB',
    strict: true,
    parameterLimit: 1000,
    type: [
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'text/html',
        'application/xhtml+xml',
        'application/xml',
    ]
}))



app.use((req, res, next)=>{
    const hash = crypto.createHmac('SHA256', config.line.channelSecret)
                .update(Buffer.from(JSON.stringify(req.body)).toString('utf-8'))
                .digest('base64')
    if(hash !== req.headers['x-line-signature']){
        const err = new Error('Not trusted signature')
        err.status = 400
        next(err)
    }
    next()
})

app.get('/', (req, res)=> {
    console.log(req)
    res.send('I got the goddamn thing')
})



app.post('/', (req, res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    })
})

function handleEvent(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
      }
      // create a echoing text message
      const line_echo = [{
          type : 'text',
          text : event.message.text
      }]
      return client.replyMessage(event.replyToken, line_echo);
}




app.use((err, {}, res, {})=>{
    console.log(err)
})


app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`)
})