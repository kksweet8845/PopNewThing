const globalT = (altText) => {
    return {
        'type' : 'template',
        'altText' : altText,
        'template' : {}
    }
}


const uriAction = (label, uri) => {
    return {
        'type': 'uri',
        label,
        uri,
    }
}

const createButtonsT = (obj={
    tiu,
    iar,
    ibc,
    title,
    text,
    defaultAction,
    actions,
}) => {
    console.log(obj)
    const {tiu, iar, ibc, title, text, defaultAction, actions} = obj
    const template = Object.assign({} , {
        'type' : 'buttons',
        'imageAspectRatio' : 'rectangle',
        'imageSize' : 'cover',
        'imageBackgroundColor' : '#ffffff',
        'title' : 'Title',
    } ,{
        thumbnailImageUrl : tiu,
        imageAspectRatio : iar,
        imageBackgroundColor : ibc,
        title,
        text,
        defaultAction,
        actions,
    })
    console.log(template)
    return Object.assign({}, globalT('REGISTRATION!!'), { template, })
}


const createQRButtonsT = (obj={
    text,
    items
}) => {
    const {text, items} = obj
    return {
        type : 'text',
        text,
        quickReply : {
            items,
        }
    }
}

const createCarouselT = ({
    columns,
}) => {
    try{
        const colObject = ({imgUrl, ibc, title, text, dAction, actions}) => {
            return {
                thumbnailImageUrl : imgUrl,
                imageBackgroundColor : ibc,
                title,
                text,
                defaultAction : dAction,
                actions
            }
        }
        const template = Object.assign({}, {
            type : 'carousel',
            imageAspectRatio : 'rectangle',
            imageSize : 'cover',
            columns: columns.map(colObject)
        })
        return Object.assign({}, globalT("paper list"), {template, })
    }catch(err){
        console.log(err)
    }
}


export {
    createButtonsT,
    uriAction,
    createQRButtonsT,
    createCarouselT,
}