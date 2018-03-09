var bleno = require('bleno');
//var gpio = require('rpi-gpio');
//var sleep = require('sleep');


//============================
// setup gpio
//============================
//gpio.setMode(gpio.MODE_RPI);
//gpio.on('change', function(channel, value) {
//    console.log('Rilevata pressione bottone, spengo tutto');
//    child_process.exec('sudo systemctl poweroff');
    //console.log('Channel ' + channel + ' value is now ' + value);
//});
//gpio.setup(37, gpio.DIR_IN, gpio.EDGE_BOTH);
//gpio.setup(37, gpio.DIR_IN, readInputBottone);
//gpio.setup(35, gpio.DIR_HIGH);

//function readInputBottone() {
//    gpio.read(37, function(err, value) {
//        console.log('The value is ' + value);
//    });
//}
//console.log('gpio settato, shutdown alla pressione del bottone');
//gpio.setup(11, gpio.DIR_OUT);
//gpio.setup(18, gpio.DIR_OUT);
//console.log('gpio board settato');
//============================

//====================
// setup i2c
//====================
console.log('inizializzo');
var i2c = require('i2c-bus'),
    i2c1 = i2c.openSync(1);
console.log('inizializzato, mo scan');

console.log('trovati:');
console.log(i2c1.scanSync());


var charSettings = new bleno.Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff2',
    properties: ['read', 'write'],
    value: '2,2,2',
    onReadRequest: function(offset, callback) {
        console.log('Effettuata lettura su settings');
    },
    onWriteRequest: function(data, offset, withoutResponse, callback) {
        console.log('on -> writeRequest, effettuata');
        console.log('inviato -> ' + data.toString('utf-8') + ' utf-8 notation');
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
        console.log('Effettuata scrittura su id suono registrato = ' + data);
        if (data == 0) {
            i2c1.sendByteSync(4, 0x01);
            console.log('inviato 1 a master');
        } else if (data == 1) {
            i2c1.sendByteSync(4, 0x02);
            console.log('inviato 2 a master');
        } else if (data == 2) {
            i2c1.sendByteSync(4, 0x03);
            console.log('inviato 3 a master');
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
