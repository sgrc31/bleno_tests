var bleno = require('bleno');

var charSettings = new bleno.Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff2',
    properties: ['read', 'write'],
    value: '1,3,6',
    onReadRequest: function(offset, callback) {
        console.log('Effettuata lettura su settings');
    },
    onWriteRequest: function(data, offset, withoutResponse, callback) {
        console.log('Effettuata scrittura su settings= ' + data.toString('hex'));
        callback(this.RESULT_SUCCESS);
    }
});

var charIdSuoniCaptati = new bleno.Characteristic({
    uuid: 'fffffffffffffffffffffffffffffff3',
    properties: ['write'],
    value: null,
    onWriteRequest: function(data, offset, withoutResponse, callback) {
        console.log('Effettuata scrittura su id suono registrato= ' + data.toString('hex'));
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
