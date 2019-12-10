#!/usr/bin/env bash

# install chrome
sudo curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add
sudo su -c "echo 'deb http://www.duinsoft.nl/pkg debs all' >> /etc/apt/sources.list"
sudo apt-get -y update
sudo apt-get -y install google-chrome-stable

# move webdriver
sudo cp driver/chromedriver /usr/local/bin/

