# homebridge-sky-plus-hd
Homebridge plugin for configuring sky plus hd box

## Summary
This plugin is based on a forked version of [dalhundal's sky-plus-hd Node.js library](https://github.com/dalhundal/sky-plus-hd/tree/v1-dev). You can see my changes [here](https://github.com/shauncampbell/sky-plus-hd). I'm hoping to clean up my code and send it back to the original developer for review at some point. I've changed some of the original behaviour so that it works a little nicer with Homebridge.


## Features

* Switch on and off the Sky Box
* Change Channels
* See what the current channel is
* See what the name of the current channel is
* See whats on the current channel.
* support for seeing whats on when viewing recorded media.



## Installation

1. Install homebridge using the instructions on the [Homebridge github page](https://github.com/nfarina/homebridge).
2. Install this plugin using the command: 
~~~
npm install -g homebridge-sky-plus-hd
~~~
3. Update your configuration file to include the following section:
~~~
"accessories": [
  {
    "accessory": "SkyPlusHDBox",
    "name": "Sky Box",
    "ipAddress": "192.168.1.103",
    "region": "scottish-west"
  }
]
~~~

The `accessory` must be `SkyPlusHDBox` for the plugin to work.
You can set the `name` parameter to anything you like. The `ipAddress` parameter should point to your Sky Box. You can find out what this is by pressing the `Services` button on your Sky Remote and selecting `Settings -> Network -> IP Address`. The `region` must be set to a valid Sky region (see the note below for more details).

### Note on Regions
 The following regions have been defined in the `sky-plus-hd` library:
 
 * atherstone
 * border-england
 * border-scotland
 * brighton
 * central-midlands
 * channel-isles
 * dundee
 * east-midlands
 * essex
 * gloucester
 * grampian
 * granada
 * henley-on-thames
 * htv-wales
 * htv-west
 * htv-west-thames-valley
 * humber
 * london
 * london-essex
 * london-thames-valley
 * london-kent
 * meridian-east
 * meridian-north
 * meridian-south
 * meridian-south-east
 * merseyside
 * norfolk
 * north-east-midlands
 * north-west-yorkshire
 * north-yorkshire
 * northern-ireland
 * oxford
 * republic-of-ireland
 * ridge-hill
 * scarborough
 * scottish-east
 * scottish-west
 * sheffield
 * south-lakeland
 * south-yorkshire
 * tees
 * thames-valley
 * tring
 * tyne
 * wales
 * west-anglia
 * west-dorset
 * westcountry