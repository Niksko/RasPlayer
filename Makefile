# Vim makefile
# (c) Nikolas Skoufis, 2016
# Last updated: 26/02/16
# 
# This makefile will fetch npm and bower dependencies, compile sass to css and install the files to /usr/local

# Color code variables for pretty output
ccgreen=$(shell echo -e "\033[1;32m")
ccyellow=$(shell echo -e "\033[1;33m")
ccred=$(shell echo -e "\033[1;31m")
ccend=$(shell echo -e "\033[0m")

build:
	@echo "$(ccyellow)Main install tasks."
	@echo "Install npm dependencies$(ccend)"
	npm install
	@echo "$(ccyellow)Install bower$(ccend)"
	npm install bower
	@echo "$(ccyellow)Install bower dependencies$(ccend)"
	bower install
	@echo "$(ccyellow)Compile sass into css$(ccend)"
	node_modules/node-sass/bin/node-sass public/index.scss index.css
	node_modules/node-sass/bin/node-sass public/filesystem-browser.scss filesystem-browser.css
	@echo "$(ccgreen)Build completed successfully$(ccend)"

install:
	@echo "$(ccyellow)Installing to /usr/share$(ccend)"
	mkdir /usr/share/RasPlayer
	cp ./* /usr/share/RasPlayer
	cp /usr/share/RasPlayer/rasplayer /usr/bin
	@echo "$(ccyellow)Creating desktop shortcut$(ccend)"
	cp /usr/share/RasPlayer/rasplayer.desktop /home/pi/Desktop/
	@echo "$(ccgreen)Installation successful$(ccend)"
