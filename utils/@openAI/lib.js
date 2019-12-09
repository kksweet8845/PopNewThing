import request from 'request'
import cheerio from 'cheerio'

const fetch_blog = async() => {
    const body = await new Promise((resolve, rej) => {
        request('https://openai.com/progress/#papers', async (err, res, body)=> {
        if(err){
            rej(err)
        }
        resolve(body)
        })
    })

    const $ = cheerio.load(body)
    const length = $('#releases').next().children().length
    var data = []
    for(let i=0;i<length;i++){
        let content = $('#releases').next('.row').children().eq(i).children('a').children('figure')
        //console.log($('#releases').next('.row').children().eq(i).html(), '\n=================')
        let href = $('#releases').next('.row').children().eq(i).children('a').attr('href')
        let title = content.children().children('img').attr('alt')
        let imgUrl = content.children('img').attr('src')
        if(imgUrl == undefined){
            imgUrl = content.children('video').children('img').attr('src')
        }
        // console.log(`${title}\n${imgUrl}\n${href}`)
        data.push({
            title,
            imgUrl,
            href,
        })
    }

    return data
}


export {
    fetch_blog,
}