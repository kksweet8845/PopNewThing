import https from 'https'
import assert from 'assert'


var headers_template = {
    'Content-Type': null,
    'Authroization': null
}

const POST = async (options={
    hostname: null,
    path: null,
    headers: null,
    agent: null
}, data) => {
    const {hostname, path, headers, agent} = options
    assert.strictEqual(typeof hostname, "string")
    assert.strictEqual(typeof path, "string")
    assert.notStrictEqual(headers, null)

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
                const buf = Buffer.from(cunk)
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
    await req.end()
    return respond
}




export {
    POST
}