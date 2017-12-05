var bleno = require('bleno');
var gpio = require('rpi-gpio');

//============================
// setup gpio
//============================
gpio.setMode(gpio.MODE_RPI);
gpio.setup(11, gpio.DIR_OUT);
gpio.setup(18, gpio.DIR_OUT);
console.log('gpio board settato');
//============================

var charSettings = new bleno.Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff2',
    properties: ['read', 'write'],
    value: '2,2,2',
    onReadRequest: function(offset, callback) {
        console.log('Effettuata lettura su settings');
    },
    onWriteRequest: function(data, offset, withoutResponse, callback) {
        console.log('on -> writeRequest, effettuata');
        console.log('inviato -> ' + data.toString('hex') + ' hex notation');
        console.log('inviato -> ' + data.toString('utf-8') + ' utf-8 notation');
        console.log('inviato -> ' + data.toString() + ' normal notation');
        callback(this.RESULT_SUCCESS);
        charSettings['value'] = data.toString();
        console.log('printo update: ' + charSettings['value'] + ' ' + charSettings.value);
    }
    //onWriteRequest: function(data, offset, withoutResponse, callback) {
    //    this.value = data;
    //    console.log('on -> writeRequest, effettuata');
    //    console.log('inviato -> ' + this.value);
    //}
});

var charIdSuoniCaptati = new bleno.Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff3',
    properties: ['write'],
    value: null,
    onWriteRequest: function(data, offset, withoutResponse, callback) {
        console.log('Effettuata scrittura su id suono registrato= ' + data.toString('utf-8'));
        if (data == 0) {
            console.log('accendo pin 11');
            gpio.write(11, true);
            sleep.sleep(1);
            gpio.write(11, false);
        } else if (data == 1) {
            console.log('accendo pin 18');
            gpio.write(18, true);
            sleep.sleep(1);
            gpio.write(18, false);
        }
        callback(this.RESULT_SUCCESS);
    }
});

var MioServizioPrimario = new bleno.PrimaryService({
    uuid: 'fffffffffffffffffffffffffffffff0',
    characteristics: [charSettings, charIdSuoniCaptati]
});



//=====================
// Registro servizi allo start dell'advertising
//==================================
bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([MioServizioPrimario]);
    }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});

//notifiche varie e anche poco utili
bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress);

  bleno.updateRssi();
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
});

//====================
// Inizio advertising
//=====================
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Quietude', ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});
