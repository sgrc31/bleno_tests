var bleno = require('bleno');


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

console.log('inizializzato bleno');

var descriptorA1 = new BlenoDescriptor({
    uuid: '2901',
    value: 'valoreA1'
)};

var descriptorA2 = new BlenoDescriptor({
    uuid: '2902',
    value: 'valoreA2'
});

var caratteristica1 = new BlenoCharacteristic({
    uuid: 'fffffffffffffffffffffffffffffff1',
    properties: ['read', 'write'],
    //secure: ['read', 'write'],
    descriptors: [ 'descriptorA1', 'descriptorA2' ],
});

var mioPrimaryService = new BlenoPrimaryService({
    uuid: 'fffffffffffffffffffffffffffffff0',
    characteristics: [ 'caratteristica1' ]
});

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('miogatt', ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});
