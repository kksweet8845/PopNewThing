
<p align="center">
<img src="https://i.imgur.com/IKFY3BB.png" alt="Papop", width="300"/>
</p>

# PopNewThing

This is a paper crawling chatbot, which crawls the paper from [google AI](https://ai.google/research/pubs/) and [open AI](https://openai.com/progress/#releases). It is implemented by [NodeJs](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/). However, this chatbot is in free trail right now, so the push message to client will be forbiddened. It can't be deployed on the heroku, because it use the [Selenium WebDriver](https://selenium.dev/) to crawl the dynamical website, which is needed to download the corresponding webdriver to activate the browser. The workflow is implmented by [xstate](https://github.com/davidkpiano/xstate).

## FSM
This app can be viewd with interactive website in [here](https://xstate.js.org/viz/?gist=663aafc4a01ae0ef3df8d67f71dd69a5). The overview of the digram is shown as following.

<img src=https://i.imgur.com/CQvm3Wh.png>


## How to deploy on cloud machine
  In this app, I deploy the service on the google-cloud-platform, It is easy to use and maintain.

- On the VM, clone the this repo
```
$ git clone git@github.com:kksweet8845/PopNewThing.git
```
- Type `npm install` to install the required package
```
$ npm install
```
- Put the webdriver binary source file in directory, driver to the ENVIRONMENT PATH
```
$ echo $PATH
$ mv webdriver /one/of/env-path/webdriver
```
- Set up the config file. 
  - execute `npm run p` to create a new config.js file. 
    - This file contain some property which is needed to be specified.

  - execute `npm run pdb` to create a new database config.js file
    - If there is authentication restriction on your database server, you need to specified the user name and password when connecting to the databse.

- Activate the mongoDB, you need to install the mongodb in your server
```
$ mkdir history
$ mkdir mongodb-data
$ mongod -dbpath=./mongodb-data
```

- Set up the chrome
```
$ chmod u+x ./scripts/chrome-setup.sh
$ ./scripts/chrome-setup.sh
```

- Activate the service
```
$ npm run d
```


## QR code
![](https://i.imgur.com/s0PR0g6.png)

