import https from 'https'
import assert from 'assert'


var headers_template = {
    'Content-Type': null,
    'Authroization': null
}

const POST = async (options={
    hostname: null,
    path: null,
    agent: null
}, data) => {
    const {hostname, path, agent} = options
    assert.strictEqual(typeof hostname, "string")
    assert.strictEqual(typeof path, "string")

    var respond = {
        data : null,
    }
    const req = https.request({
        hostname: hostname,
        path    : path,
        method  : 'POST',
        headers : headers,
        agent   : agent
    },(res)=> {
        console.log(`STATUS: ${res.statusCode}`)
        res.setEncoding('utf-8')
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
        })
    })
    req.on('error', (e)=> {
        throw e
    })
    req.write(JSON.stringify(data))
    req.end()
    return respond
}


const GET = async (options={
    hostname: null,
    path: null,
    headers: null,
    agent: null
}) => {
    const {hostname, path, headers, agent} = options
    assert.strictEqual(typeof hostname, "string")
    assert.strictEqual(typeof path, "string")
    assert.notStrictEqual(headers, null)

    var respond = {
        data : null,
    }

    const req = await new Promise((resolve, rej)=> {
        https.request({
            hostname: hostname,
            path    : path,
            method  : 'GET',
            agent   : agent
        },(res)=> {
            console.log(`STATUS: ${res.statusCode}`)
            res.setEncoding('utf-8')
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
                resolve()
                console.log('POST ending')
            })
            res.on('error', () => {
                rej()
                console.log('GET erroring')
            })
        })
    })

    req.on('error', (e)=> {
        throw e
    })
    req.end()
    respond.data = respond.data.toString('utf8')
    return respond
}




export {
    POST,
    GET
}