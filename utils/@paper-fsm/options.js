import {
    _greetUser,
    _infoDes,
    _tryToRegister,
    _listFunc,
    _searchPaper,
    _chooseAI,
    _chooseYear,
    _helpInfo,
    _addToFavorite,
    _retrieveFavorite,
} from 'utils/@paper-fsm/lib.js'
import {assign, send} from 'xstate'

const options = {
    actions : {
        greetUser : (context, event, actState)=> {
            if(event.client)
                return _greetUser(event.replyToken, event.client, actState.state.meta[`paperMachine.${actState.state.value}`])
            return console.log('Traverse')
        },
        infoDes   : (context, event, actState) => {
            return _infoDes(event.event.replyToken, event.client, actState.state.meta[`paperMachine.${actState.state.value}`])
        },
        helpInfo  : (context, event, actState) => {
            return _helpInfo(event.event.replyToken, event.client, actState.state.meta[`paperMachine.${actState.state.value}`])
        },
        tryToRegister : async (context, event, actState) => {
            if(event.client){
                const rst = await _tryToRegister({
                    replyToken : event.event.replyToken,
                    client     : event.client,
                    userId     : event.event.source.userId,
                    meta       : actState.state.meta[`paperMachine.${actState.state.value}`],
                    curState   : event.curState,
                    context,
                })
                console.log(rst)
                return assign({
                    register : (context, event)=> {
                        return rst
                    }
                })
            }
        },
        listFunc : (context, event, actState) => {
            console.log(event)
            return _listFunc({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId,
                meta       : actState.state.meta[`paperMachine.${actState.state.value}`],
                curState   : event.curState
            })
        },
        chooseAI : (context, event, actState) => {
            console.log('choossing ai')
            console.log(event)
            const key = Object.keys(actState.state.value)
            const value = actState.state.value[key]
            return _chooseAI({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId,
                meta       : actState.state.meta[`paperMachine.${key}.${value}`]
            })
        },
        searchPaper : (context, event, actState) => {
            console.log('Search paper')
            console.log(event)
            const key = Object.keys(actState.state.value)
            const value = actState.state.value[key]
            return _searchPaper({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId,
                meta       : actState.state.meta[`paperMachine.${key}.${value}`],
                year       : event.year,
                field      : context.field
            })
        },
        chooseYear : (context, event, actState) => {
            console.log('ChooseYear')
            console.log(event)
            const key = Object.keys(actState.state.value)
            const value = actState.state.value[key]
            return _chooseYear({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId,
                meta       : actState.state.meta[`paperMachine.${key}.${value}`],
            })
        },
        showFSM : (context, event) => {
            return event.client.replyMessage(event.event.replyToken, [{
                type : 'image',
                originalContentUrl : 'https://i.imgur.com/CQvm3Wh.png',
                previewImageUrl : 'https://img.icons8.com/officel/80/000000/slot-machine.png',
            }])
        },
        addToFavorite : (context, event) => {
            console.log('Add to favorite')
            console.log(event)
            return _addToFavorite({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId,
                url        : event.url
            })
        },
        retrieveFavorite : (context, event) => {
            console.log('Retrieve favrotes')
            console.log(event)
            return _retrieveFavorite({
                replyToken : event.event.replyToken,
                client     : event.client,
                userId     : event.event.source.userId
            })
        }
    },
    activities : {
        listenNewThings : (context, event) => {
            console.log('Popping up new things')
            console.log(event)
            // if(context.notificationDisabled)
            //     var interval = setInterval(() => console.log('Pop new things!'), 1000)
            return () => {
                console.log('exit the lobby')
            }
        },
    }
}

export default options