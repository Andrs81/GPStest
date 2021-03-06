
var gpsd = require('node-gpsd');

var port = 5051;
var program = 'gpsd';
var device = '/dev/ttyUSB0';

var currentLatitude = 0.0;
var currentLongitude = 0.0;
var currentMode = 0;

function PositionBasedOnGPSD (program, device, port) {

    var daemon = new gpsd.Daemon({
        port
    });

    daemon.start(function() {
        var listener = new gpsd.Listener({port: port});
    
        listener.on('TPV', function (tpv) {
            currentMode = tpv.mode;
            
            if (tpv.mode === 2 || tpv.mode === 3) {
                currentLatitude = tpv.lat;
                currentLongitude = tpv.lon;
            }

        });
    
        listener.connect(function() {
            listener.watch();
        });

    });
}

PositionBasedOnGPSD.prototype.getPosition = function() {

        return {
            mode: currentMode,
            latitude: currentLatitude, 
            longitude: currentLongitude,
            success: 1
        }
    
}

module.exports = PositionBasedOnGPSD;