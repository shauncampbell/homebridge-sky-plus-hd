'use strict';

var Accessory, Service, Characteristic;
var skyBox, skyRemote;
var SkyPlusHD = require('sky-plus-hd');
var SkyRemote = require('sky-remote');

module.exports = function(homebridge) {
	Accessory = homebridge.platformAccessory;
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	var inherits = require('util').inherits;
	
	//	Create the characteristic for the channel number.
	Characteristic.ChannelNumber = function() {
		Characteristic.call(this, 'Channel Number','0000006E-0000-1000-8000-0037BB765291');
		this.setProps({
			format: Characteristic.Formats.INT,
			unit: Characteristic.Units.NONE,
			maxValue: 999,
			minValue: 101,
			minStep: 1,
			perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
		});
		this.value = this.getDefaultValue();
	};
	inherits(Characteristic.ChannelNumber, Characteristic);
	Characteristic.ChannelNumber.UUID = '0000006E-0000-1000-8000-0037BB765291';
	
	//	Create the characteristic for the channel name.
	Characteristic.ChannelName = function() {
		Characteristic.call(this, 'Channel Name','0000006E-0000-1000-8000-0037BB765292');
		this.setProps({
			format: Characteristic.Formats.STRING,
			perms: [Characteristic.Perms.READ]
		});
		this.value = this.getDefaultValue();
	};
	inherits(Characteristic.ChannelName, Characteristic);
	Characteristic.ChannelName.UUID = '0000006E-0000-1000-8000-0037BB765292';
	
	//	Create the characteristic for the channel show.
	Characteristic.ChannelShow = function() {
		Characteristic.call(this, 'Channel Show','0000006E-0000-1000-8000-0037BB765293');
		this.setProps({
			format: Characteristic.Formats.STRING,
			perms: [Characteristic.Perms.READ]
		});
		this.value = this.getDefaultValue();
	};
	inherits(Characteristic.ChannelShow, Characteristic);
	Characteristic.ChannelShow.UUID = '0000006E-0000-1000-8000-0037BB765293';
	
	homebridge.registerAccessory("homebridge-sky-plus-hd", "SkyPlusHDBox", SkyPlusHDBoxAccessory);
}

function SkyPlusHDBoxAccessory(log, config, api) {
	this.log = log;
	this.config = config;
	this.name = config.name || 'Sky Plus Box';
	
}

//	Create custom characteristic.




SkyPlusHDBoxAccessory.prototype = {
	setPowerState: function(powerOn, callback) {
		if (powerOn && !skyBox.checkPowerState())
		{
			skyRemote.press('power');
		}
		else if (!powerOn && skyBox.checkPowerState())
		{
			skyRemote.press('power');
		}
		callback();
	},
	
	getPowerState: function(callback) {
		callback(null, skyBox.checkPowerState());
	},
	
	setBrightness: function(brightness, callback) {
		this.log('Turning brightness to ' + brightness);
		console.log('Turning brightness to ' + brightness);
		callback();
	},
	
	
	setChannelNumber: function(channel, callback) {
		this.log('Turning channel to ' + channel);
		console.log('Turning channel to ' + channel);
		skyBox.setChannel(channel);
		callback();
	},
	
	getChannelNumber: function(callback) {
		callback(null, skyBox.whatsOn().number);
	},
	
	getChannelName: function(callback) {
		callback(null, skyBox.whatsOn().nameLong);
	},
	
	getChannelShow: function(callback) {
		callback(null, skyBox.whatsOn().show);
	},
	
	identify: function(callback) {
		this.log('Identify');
		console.log('Identify');
		callback();
	},
	
	getServices: function() {
		var config = {
			region: this.config.region,
			ip: this.config.ipAddress
		};
		
		var informationService;
		
		informationService = new Service.AccessoryInformation()
        			.setCharacteristic(Characteristic.Manufacturer, 'Sky')
        			.setCharacteristic(Characteristic.Model, 'Sky+HD Box')
        			.setCharacteristic(Characteristic.SerialNumber, '');	
		
		var findABox = SkyPlusHD.findBox(config.ip, config);
		findABox.then(function(box) {
			skyBox = box;
			skyRemote = new SkyRemote(config.ip);
			console.log(skyBox.model);
 			console.log(skyBox.capacity);
  			console.log(skyBox.software);
  			console.log(skyBox.serial);
			console.log(skyBox.currentState);
			
		});
		
		var switchService = new Service.Switch(this.name);

		//	Control the box power status.
		switchService.getCharacteristic(Characteristic.On).on('set', this.setPowerState.bind(this));
		switchService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
		
		//	Control the box channel.
		switchService.addCharacteristic(Characteristic.ChannelNumber);
		switchService.getCharacteristic(Characteristic.ChannelNumber)
					 .on('set', this.setChannelNumber.bind(this))
					 .on('get', this.getChannelNumber.bind(this));
		
		//	Provide some information about the channel name.
		switchService.addCharacteristic(Characteristic.ChannelName);
		switchService.getCharacteristic(Characteristic.ChannelName)
					 .on('get', this.getChannelName.bind(this));
		
		//	Provide some information about the show.
		switchService.addCharacteristic(Characteristic.ChannelShow);
		switchService.getCharacteristic(Characteristic.ChannelShow)
				     .on('get', this.getChannelShow.bind(this));

		return [switchService, informationService];
	}
}