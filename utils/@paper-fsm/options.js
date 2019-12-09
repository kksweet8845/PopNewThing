import {
    _greetUser,
    _infoDes,
    _tryToRegister,
    _listFunc,
    _searchPaper,
    _chooseAI,
    _chooseYear,
} from 'utils/@paper-fsm/lib.js'
import {assign} from 'xstate'

const options = {
    actions : {
        greetUser : (context, event, actState)=> {
            if(event.client)
                return _greetUser(event.replyToken, event.client, actState.state.meta[`paperMachine.${actState.state.value}`])
            return console.log('Traverse')
        },
        infoDes   : (context, event, actState) => {
            return _infoDes(event.replyToken, event.client, actState.state.meta[`paperMachine.${actState.state.value}`])
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
        addToFavorite : (context, event) => {
            console.log('Add to favorite')
            console.log(event)
        },
        retrieveFavorite : (context, event) => {
            console.log('Retrieve favrotes')
            console.log(event)
        },
        toggleNote : (context, event) => {
            console.log(`toggle notificationDisabled : ${context.notificationDisabled}`)
            context.notificationDisabled = !context.notificationDisabled
            console.log(`Toggle finished notificationDisabled : ${context.notificationDisabled}`)
            console.log(event)
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