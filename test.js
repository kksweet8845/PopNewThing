import {POST, GET} from 'projectRoot/utils/request.js'
import request from 'request'
import https from 'https'
import cheerio from 'cheerio'
import hp2 from 'htmlparser2'

import {Builder, By, Key, until} from 'selenium-webdriver'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const googleSearch = async () => {
    try{
        var driver = await new Builder().forBrowser("chrome").build()
        await driver.get("https://ai.google/research/pubs")
        // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
        await sleep(5000)
        return driver.getPageSource()

    }finally {
    }

}


const main = async () => {


    const data = await googleSearch()
    const $ = cheerio.load(data)

    console.log($('.search__cards ').children().length)
    $('.search__cards').children().each((i, ele)=> {
        let c = $(ele).children().children('.content').children('.content__text').children()
        let title = $(c).eq(0).children('a').text()
        let name = $(c).eq(1).children('p').text()
        console.log(`title: ${title}\nauthors: ${name}, \n=====================`)
    })

}


main()