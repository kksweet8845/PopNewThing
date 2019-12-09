import cheerio from 'cheerio'
import {Builder, By, Key, until, FileDetector} from 'selenium-webdriver'

import config from 'projectRoot/config.js'


const sleep = (ms) => {
    return new Promise(resolve=>setTimeout(resolve, ms))
}

const asyncForEach = async (array, callback)=>{
    for(let i=0;i<array.length; i++){
        await callback(array[i], i, array);
    }
}

const setFilter = async (driver, type, opts) => {
    try {
        var Sec = await driver.findElement(By.id(type))
        var list = await Sec.findElement(By.className('filter__list'))
        if(!await list.isDisplayed()){
            console.log('False')
            var tbtn = await Sec
                            .findElement(By.className('filter__title'))
            var actions = driver.actions()
            await actions.click(tbtn).perform()
        }
        let checkboxs = []
        await asyncForEach(opts, async (opt)=>{
            let ele = await list.findElement(By.id(opt))
            checkboxs.push(ele)
        })
        await asyncForEach(checkboxs, async (checkbox) => {
            await driver.wait(until.elementIsEnabled(checkbox), 500)
            const actions = driver.actions()
            await actions.click(checkbox).perform()
        })
        await driver.sleep(100)
    }catch(err){
        console.log(err)
    }
}


const getFilterData = async (driver, type) => {
    try{
        var tbtn = await driver
                        .findElement(By.id(type))
                        .findElement(By.className('filter__title')).click()
        var list_ele = await driver
                            .findElement(By.id(type))
                            .findElement(By.className('filter__list'))
                            .findElements(By.className('filter__option-title'))
        var list_id_ele = await driver
                            .findElement(By.id(type))
                            .findElements(By.className('filter__option'))
        const list_id = await Promise.all(list_id_ele.map(async (ele) => {
            return {
                'id': await ele.getAttribute('id')
            }
        }))
        const list = await Promise.all(list_ele.map(async (ele)=> {
            return {
                'text': await ele.getText()
            }
        }))
        await driver
                .findElement(By.id(type))
                .findElement(By.className('filter__title')).click()
        await driver.wait(until.elementIsNotVisible(list_ele[0]), 400)
        return {
            list_id,
            list_text: list
        }
    }catch(err){
        console.log(err)
    }
}

const getPaperDetail = async (driver, path)=>{
    try{
        await driver.get(hostname + path)
        return driver.sleep(1000)
    }catch(err){
        console.log(err)
    }
}

const getData = async (data) => {
    try {
        const $ = cheerio.load(data)
        var data = []
        $('.search__cards').children().each((i, ele)=> {
            let c = $(ele).children().children('.content').children('.content__text').children()
            let title = $(c).eq(0).children('a').text()
            let href = $(c).eq(0).children('a').attr('href')
            let authors = $(c).eq(1).children('p').text()
            data.push({
                title,
                href,
                authors
            })
            // console.log(`title: ${title}\nauthors: ${authors}\n${href}\n=====================`)
        })

        return data
    }catch(err){
        console.log(err)
    }
}

const googleSearch = async (driver, url) => {
    try{
        await driver.get(url)
        return driver.sleep(2500)
    }finally{

    }
}


export {
    sleep,
    setFilter,
    getFilterData,
    getData,
    googleSearch,
}