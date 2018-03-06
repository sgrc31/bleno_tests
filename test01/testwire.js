//var i2c = require('i2c');
//var address = 0x6;
//var wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL i

//console.log('startato il tutto');
//wire.write([0x01, 0x02], function(err) {});
//console.log('inviato quello che dovevo');

console.log('inizializzo');
var i2c = require('i2c-bus'),
    i2c1 = i2c.openSync(1);
console.log('inizializzato, mo scan');

console.log('trovati:');
console.log(i2c1.scanSync());

var bytez = 0x01;
var bufferone;
bufferone = new Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
i2c1.sendByteSync(6, 0x01)
//i2c1.i2cWriteSync(6, 6, bufferone);
console.log('scritto: ' + bufferone.toString('utf8'));
console.log(bufferone);

console.log('chiudo tutto');
i2c1.closeSync()
