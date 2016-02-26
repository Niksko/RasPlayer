# RasPlayer

A nodejs application for queueing and playing video on a touchscreen Raspberry Pi connected to an external display.

## Installation instructions

Clone this repository to a local directory with:

```
git clone https://www.github.com/Niksko/RasPlayer.git
```

You will need to uninstall the legacy version of node on a stock Raspbian Jessie install with:

```
sudo apt-get remove nodejs-legacy
```

Fetch and install the latest version of node.

```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```

Change to the directory and make and install the required files.

```
cd RasPlayer
make && sudo make install
```
