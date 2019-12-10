import {
    createButtonsT,
    uriAction,
    createQRButtonsT,
    createCarouselT,
} from 'utils/@line/template.js'
import {
    sleep,
    setFilter,
    getFilterData,
    getData,
    googleSearch
} from 'utils/@googleAI/lib.js'
import {
    fetch_blog,
} from 'utils/@openAI/lib.js'
import {Builder, By, Key, unitl} from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import {User} from 'projectRoot/models/User.js'
import {Favorite} from 'projectRoot/models/Favorite.js'
import {mongoose} from 'projectRoot/db/mongoose.js'
import config from 'projectRoot/config.js'
import {State, doneInvoke} from 'xstate'
import path from 'path'


const toArray = (msg) => {
    return Array.isArray(msg) ? msg : [msg]
}


const _greetUser = async (replyToken, client, meta) => {
    try{
        var message = Object.assign({},
            createButtonsT({
                tiu : meta.regist.imgUrl,
                iar : 'rectangle',
                ibc : '#ffffff',
                title : meta.regist.title,
                text : meta.regist.text,
                defaultAction : uriAction('View Detailed', 'https://google.com'),
                actions : meta.regist.actions
            }))
        return client.replyMessage(replyToken, toArray(message), false)
    }catch(err){
        console.log(err)
    }
}

const _infoDes = async (replyToken, client, meta) => {
    try{
        return client.replyMessage(replyToken, toArray(meta.no), false)
    }catch(err){
        console.log(err)
    }
}

const _tryToRegister = async (obj={
    replyToken,
    client,
    userId,
    meta,
    curState
}) => {
    try {
        const {replyToken, client, userId, meta, curState, context} = obj
        const user = new User({
            userId: userId,
            curState : curState
        })
        const doc = await user.save()
        console.log(doc)
        const res = await client.replyMessage(replyToken, toArray({
            type :'text',
            text : 'Your register is successed\nYou can type \"LOBBY\"'
        }))
        if(res.status == 200){
            return 'SUCCESS'
        }else{
            return 'FAIL'
        }
    }catch(err){
        console.log(err)
        return 'FAIL'
    }
}


const _listFunc = async (obj={
    replyToken,
    client,
    userId,
    meta,
    curState,
}) => {
    try {
        const {replyToken, client, userId, meta, curState} = obj
        const doc = await User.findOne({
            userId,
        })
        if(doc == null){
            return console.log('no registered user in lobby error')
        }else{
            var msg = toArray(createQRButtonsT({
                text : 'Please select one of following function',
                items : meta.listFunc
            }))
            doc.curState = curState
            await doc.save()
            return client.replyMessage(replyToken, msg, false)
        }
    }catch(err){
        console.log(err)
    }
}


const google_search = (driver) => {

}



const _searchPaper = async (obj={
    replyToken,
    client,
    userId,
    meta,
    curState,
    year,
    field,
})=> {
    try {
        const {replyToken, client, userId, meta, curState, year, field} = obj
        const searchUrl = field == 'OPENAI' ? config.openAI.url : config.google.research
        const google_search = async () => {
            var driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(new chrome.Options().headless())
                        .build()
            await googleSearch(driver, searchUrl)
            await setFilter(driver,'year', toArray(year))
            await driver.sleep(1000)
            const html = await driver.getPageSource()
            const data = await getData(html)
            const preData = data.map(({title, authors ,href}) => {
                return {
                    imgUrl : 'https://cdn.openai.com/research-covers/emergent-tool-use/1x-no-mark.jpg',
                    ibc : '#FFFFFF',
                    text : `${title.slice(0,60)}`,
                    actions : [
                        {
                            type : 'uri',
                            label : 'View detail',
                            uri : `${config.google.hostname}${href}`
                        },
                        {
                            type : 'message',
                            label : 'Add to Favorite',
                            text : `FAVORITE ${config.google.hostname}${href}`
                        }
                    ]
                }
            })
            console.log(JSON.stringify(preData,null, 2))
            await driver.quit()
            return preData
        }
        switch(field ){
            case 'OPENAI' :
                const data = await fetch_blog()
                var preData = data.map(({title, imgUrl, href})=> {
                    return {
                        imgUrl,
                        ibc : '#FFFFFF',
                        text : title,
                        actions: [
                            {
                                type : 'uri',
                                label : 'View detail',
                                uri : `${config.openAI.hostname}${href}`
                            },
                            {
                                type : 'message',
                                label : 'Add to Favorite',
                                text : `FAVORITE ${config.openAI.hostname}${href}`
                            }
                        ]
                    }
                })
                break
            case 'GOOGLEAI':
                var preData = await google_search()
                break
        }
        return client.replyMessage(replyToken, toArray(createCarouselT({columns: preData.slice(0, 10)})), false)
    }catch(err){
        console.log(err)
    }
}


const _chooseYear = async (obj={
    replyToken,
    client,
    userId,
    meta,
    year
}) => {
    try{
        const {replyToken, client, userId, meta, year} = obj
        var driver = await new Builder()
                        .forBrowser('chrome')
                        .setChromeOptions(new chrome.Options().headless())
                        .build()
        await googleSearch(driver, config.google.research)
        const {list_id, list_text} = await getFilterData(driver, 'year')
        const actions = await Promise.all(list_text.map(async (ele)=> {
            console.log(ele)
            return {
                type : 'message',
                label : ele.text,
                text : `SEARCH ${ele.text}`,
            }
        }))
        var length = actions.length
        var numberOfMessage = Math.ceil(length/4)
        var messages = []
        for(let i=0;i<numberOfMessage;i++){
            let message = Object.assign({},
                createButtonsT({
                    tiu : meta.imgUrl,
                    iar : 'rectangle',
                    ibc : '#ffffff',
                    title : meta.title,
                    text : meta.text,
                    defaultAction : uriAction('View Detailed', 'https://google.com'),
                    actions : actions.slice(i*4, 4*(i+1))
                }))
            messages.push(message)
        }
        await driver.quit()
        return client.replyMessage(replyToken, toArray(messages.slice(0,5)), false)
    }catch(err){
        console.log(err)
    }
}


const _chooseAI = async (obj={
    replyToken,
    client,
    userId,
    meta
}) => {
    try{
        const {replyToken, client, userId, meta} = obj
        var message = Object.assign({},
            createButtonsT({
                tiu : meta.imgUrl,
                iar : 'rectangle',
                ibc : '#ffffff',
                title : meta.title,
                text : meta.text,
                defaultAction : uriAction('View Detailed', 'https://google.com'),
                actions: meta.actions,
            }))
        return client.replyMessage(replyToken, toArray(message), false)
    }catch(err){
        console.log(err)
    }
}


const _addToFavorite = async ({
    replyToken,
    client,
    userId,
    url,
}) => {
    try{
        const doc = await User.findOne({
            userId,
        })
        if(doc){
            var t = doc.favorite.find(ele => (ele === url))
            if(t === undefined )
                doc.favorite.push(url)
            var pdoc = await doc.save()
            return client.replyMessage(replyToken, toArray({
                type : 'text',
                text : `Add to favorite`
            }), false)
        }else {
            return client.replyMessage(replyToken, toArray({
                type : 'text',
                text : 'Faild to adding to favorite'
            }), false)
        }
    }catch(err){
        console.log(err)
    }
}

const _getResolveState = (machine, str) => {
    const stateDefinition = JSON.parse(str)
    const preState = State.create(stateDefinition)
    const resolvedState = machine.resolveState(preState)
    return resolvedState
}


const _retrieveFavorite = async ({
    replyToken,
    client,
    userId,
})=> {
    try{
        const doc = await User.findOne({
            userId,
        })
        if(doc){
            var favorite = doc.favorite

            var preData = favorite.map((url)=> {
                return {
                    text : url,
                    actions : [
                        {
                            type : 'uri',
                            label : 'View detail',
                            uri : url
                        }
                    ]
                }
            })
            console.log(preData)
            return client.replyMessage(replyToken, toArray(createCarouselT({columns : preData.slice(0, 10)})), false)
        }
    }catch(err){
        console.log(err)
    }
}


const _helpInfo = async ({
    replyToken,
    client,
    meta
}) => {
    try{
        return client.replyMessage(replyToken, toArray({
            type: 'text',
            text : meta.info
        }),false)
    }catch(err){
        console.log(err)
    }
}


export {
    _greetUser,
    _infoDes,
    _tryToRegister,
    _getResolveState,
    _listFunc,
    _searchPaper,
    _chooseYear,
    _chooseAI,
    _helpInfo,
    _addToFavorite,
    _retrieveFavorite,
}