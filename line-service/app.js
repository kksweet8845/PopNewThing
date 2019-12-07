import express from 'express'
import config from 'projectRoot/config.js'
import crypto from 'crypto'
import https from 'https'
import {Client} from 'projectRoot/utils/@line/bot-sdk.js'


const app = express()


app.use((err, {}, res, {}) => {
    if(err)
        console.log(err)
    if(err.status == undefined)
        err.status = 500
    res.status(err.status).send()
})