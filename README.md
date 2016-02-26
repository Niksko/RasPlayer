# RasPlayer

A nodejs application for queueing and playing video on a touchscreen Raspberry Pi connected to an external display.

## Installation instructions

Clone this repository to a local directory with:

```
git clone https://www.github.com/Niksko/RasPlayer.git
```

Fetch and install the latest version of node.

```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```

Note: you may need to uninstall the legacy version of node with:

```
sudo apt-get remove nodejs-legacy
```

Install some dependencies.

```
sudo apt-get install npm
```

Make and install the required files.

```
make && sudo make install
```
