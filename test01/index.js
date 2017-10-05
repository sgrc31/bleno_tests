var bleno = require('bleno');


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

console.log('inizializzato bleno');

var descriptorA1 = new BlenoDescriptor({
    uuid = '2901',
    value = 'valoreA1'
)};

var descriptorA2 = new BlenoDesciptor({
    uuid = '2902',
    value = 'valoreA2'
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

bleno.state = poweredOn;

var name = 'name';
var serviceUuids = ['fffffffffffffffffffffffffffffff0']

bleno.startAdvertising(name, serviceUuids[, callback(error)]);
