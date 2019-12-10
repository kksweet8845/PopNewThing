#!/usr/bin/env bash


sudo apt-get update

# install chrome
sudo curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add
sudo su -c "echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google-chrome.list"
sudo apt-get -y update
sudo apt-get -y install google-chrome-stable

# move webdriver
sudo cp driver/chromedriver /usr/local/bin/

