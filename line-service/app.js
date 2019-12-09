import express from 'express'
import config from 'projectRoot/config.js'
import crypto from 'crypto'
import https from 'https'
import {middleware} from '@line/bot-sdk'
import {Client} from 'projectRoot/utils/@line/bot-sdk.js'
import paperMachine from 'utils/@paper-fsm/fsm.js'
import {interpret} from 'xstate'
import {LineBot} from 'utils/@handleEvent/LineBot.js'
import fs from 'fs'


const app = express()
const lineBot = new LineBot(paperMachine)

const client = new Client(config.line)

app.post(middleware(config.line))
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

app.get('/', async (req, res)=> {
    console.log(req.body)
    res.send('OK')
})

app.post('/', async (req, res, next) => {
    try{
        console.log(req.body.events)
        Promise
        .all(req.body.events.map(lineBot.handleEvent.bind(lineBot)))
        .then((result)=> res.json(result))
        .catch(err=> {
            throw err
        })
    }catch(err){
        next(err)
    }
})



app.use((err, {}, res, {}) => {
    if(err)
        console.log(err)
    if(err.status == undefined)
        err.status = 500
    res.status(err.status).send()
})


export default app