import express from 'express'
import config from 'projectRoot/config.js'
import fs from 'fs'
import crypto from 'crypto'
import {middleware} from '@line/bot-sdk'
import https from 'https'
import {Client} from 'projectRoot/utils/@line/bot-sdk.js'
import { AssertionError } from 'assert'
import lineApp from 'projectRoot/line-service/app.js'


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


app.use('/line', lineApp)





app.use((err, {}, res, {})=>{
    console.log(err)
})


app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`)
})