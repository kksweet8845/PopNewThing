import https from 'https'
import assert from 'assert'
import fs from 'fs'

var headers_template = {
    'Content-Type': null,
    'Authroization': null
}

const POST = async (options={
    hostname: null,
    path: null,
    headers : null,
    agent: null
}, data) => {
    const {hostname, headers, path, agent} = options
    assert.strictEqual(typeof hostname, "string")
    assert.strictEqual(typeof path, "string")

    var respond = {
        data : '',
    }
    await new Promise((resolve, reject) => {
        const req = https.request({
            hostname: hostname,
            path    : path,
            method  : 'POST',
            headers : headers,
            agent   : agent
        },(res)=> {
            console.log(`STATUS: ${res.statusCode}`)
            respond.headers = res.headers
            respond.status = res.statusCode
            res.on('data', (chunk)=> {
                console.log(Buffer.from(chunk).toString('utf8'))
                respond.data += chunk
            })
            res.on('end', () => {
                console.log('POST ending')
                resolve()
            })
            res.on('error', (e)=> {
                reject(e)
            })
        })
        req.on('error', (e)=> {
            reject(e)
        })
        req.write(JSON.stringify(data))
        req.end()
    })
    return respond
}


const GET = async (options={
    hostname: null,
    path: null,
    headers: null,
    agent: null
}) => {
    try{
        const {hostname, path, headers, agent} = options
        assert.strictEqual(typeof hostname, "string")
        assert.strictEqual(typeof path, "string")
        assert.notStrictEqual(headers, null)


        var respond = {
            data : null
        }

        await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: hostname,
                path    : path,
                headers : headers,
                method  : 'GET',
                agent   : agent
            },(res)=> {
                console.log(`STATUS: ${res.statusCode}`)
                respond.headers = res.headers
                respond.status = res.statusCode
                res.on('data', (chunk)=> {
                    if(!Buffer.isBuffer(respond.data))
                        respond.data = Buffer.from(chunk)
                    else{
                        const buf = Buffer.from(chunk)
                        respond.data = Buffer.concat([respond.data, buf], buf.length + respond.data.length)
                    }
                })
                res.on('end', () => {
                    console.log('POST ending')
                    resolve()
                })
                res.on('error', (err) => {
                    console.log('GET erroring')
                    reject(err)
                })
                res.pipe(fs.createWriteStream('mm.jpg'))
            })

            req.on('error', (e)=> {
                console.log(e)
            })
            req.end()
        })
        return respond
    }catch(err){
        console.log(err)
    }
}




export {
    POST,
    GET
}