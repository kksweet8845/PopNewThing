import {assign, send} from 'xstate'


const searchState = {
    initial : 'initial',
    context : {
        field : '',
        year : '',
    },
    states : {
        'initial' : {
            on : {
                'OPENAI' : {
                    target : '_search',
                    actions : assign({
                        field : (context, event) => 'OPENAI'
                    })
                },
                'GOOGLEAI' : {
                    target : 'year',
                    actions : assign({
                        field : (context, event) => 'GOOGLEAI'
                    })
                }
            },
            entry : ['chooseAI'],
            meta : {
                imgUrl : 'https://cdn.openai.com/research-covers/emergent-tool-use/1x-no-mark.jpg',
                title : 'AI company',
                text : 'Please choose one of AI company',
                actions : [
                    {
                        type : 'message',
                        label : 'OpenAI',
                        text  : 'OPENAI'
                    },
                    {
                        type : 'message',
                        label : 'GoogleAI',
                        text : 'GOOGLEAI'
                    }
                ]
            }
        },
        'year' : {
            on : {
                'SEARCH' : {
                    target : '_search',
                    actions : assign({
                        year : (context, event) => event.year
                    })
                }
            },
            entry : ['chooseYear'],
            meta : {
                imgUrl : 'https://cdn.openai.com/research-covers/emergent-tool-use/1x-no-mark.jpg',
                title : 'YEAR',
                text : 'Please choose one of year shown as following',
            }
        },
        '_search' : {
            entry : ['searchPaper']
        }
    }
}


const schema = {
    id: 'paperMachine',
    initial: 'initial',
    context : {
        notificationDisabled : true,
        register : 'UNKNOWN',
    },
    states: {
        'initial' : {
            on : {
                'WELCOME' : {
                    target : 'welcome'
                },
            }
        },
        'welcome' : {
            on : {
                'REGISTER': {
                    target : 'register',
                },
                'NO' : {
                    actions: ['infoDes']
                },
            },
            entry: ['greetUser'],
            meta : {
                regist:{
                    imgUrl : 'https://cdn.openai.com/research-covers/emergent-tool-use/1x-no-mark.jpg',
                    title : 'Would you like to register ?',
                    text : 'Hello, my friend, It is a use of fucking tools',
                    actions : [{
                        type : 'message',
                        label : 'Yes',
                        text : 'REGISTER'
                    }, {
                        type : 'message',
                        label : 'No',
                        text : 'NO'
                    }]
                },
                no: {
                    type : 'text',
                    text: 'It is pity for you to not regist our service'
                }
            }
        },
        'register' : {
            on : {
                'SUCCESS' : {
                    target : 'entrance',
                    actions: [assign({
                        register : (context, event) => 'SUCCESS'
                    })]
                },
                'FAIL' : {
                    target : 'initial',
                    actions: [assign({
                        register : (context, event) => 'FAIL'
                    })]
                }
            },
            entry : ['tryToRegister'],
        },
        'entrance': {
            on : {
                'LOBBY': {
                    target : 'lobby',
                    actions : [
                        'listFunc',
                    ]
                }
            },
            entry: ['helpInfo'],
            meta : {
                listFunc : [
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/search.png',
                        action : {
                            type : 'message',
                            label : 'Search paper',
                            text : '_SEARCH'
                        }
                    },
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/check.png',
                        action : {
                            type : 'message',
                            label : 'Check my facorite',
                            text : 'RETRIEVE'
                        }
                    },
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/hint.png',
                        action : {
                            type : 'message',
                            label : 'Pop up',
                            text : 'NOTE'
                        }
                    }
                ],
                info: 'You can type \"LOBBY\" to enter the lobby.'
            }
        },
        'lobby' : {
            on : {
                'SEARCH' : {
                    target : 'search'
                },
                'RETRIEVE' : {
                    target : 'retrieve'
                },
                'LOBBY' : {
                    actions: ['listFunc']
                },
                'SHOWFSM' : {
                    actions: ['showFSM']
                }
            },
            // activities : ['listenNewThings'],
            meta : {
                listFunc : [
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/search.png',
                        action : {
                            type : 'message',
                            label : 'Search paper',
                            text : 'SEARCH'
                        }
                    },
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/check.png',
                        action : {
                            type : 'message',
                            label : 'Check my facorite',
                            text : 'RETRIEVE'
                        }
                    },
                    {
                        type : 'action',
                        imageUrl : 'https://img.icons8.com/dusk/64/000000/hint.png',
                        action : {
                            type : 'message',
                            label : 'Pop up',
                            text : 'NOTE'
                        }
                    }
                ]
            }
        },
        'search' : {
            on : {
                'FAVORITE' : {
                    target : 'favorite'
                },
                'LOBBY' : {
                    target : 'lobby',
                    actions: send((context, event)=> event )
                }
            },
            ...searchState
        },
        'favorite' : {
            on : {
                'LOBBY' : {
                    target : 'lobby',
                    actions : send((context, event)=> event)
                },
                'FAVORITE' : {
                    actions : ['addToFavorite']
                }
            },
            entry : send((context, event)=>event)
        },
        'retrieve' : {
            on : {
                '' : {
                    target : 'lobby'
                }
            },
            entry : ['retrieveFavorite']
        }
    }
}


export default schema