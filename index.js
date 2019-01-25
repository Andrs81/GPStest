
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
            console.log({"currentMode ": currentMode, "tpv.mode ": tpv.mode});
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

function getPosition(attempts) {
    console.log("attempts: "+attempts)
    if(currentMode === 0 || currentMode === 1){
        
        if(attempts > 10){
            return {success: 0, error: "GPS device is not fixed"};
        }

        getPosition(attempts + 1)
        
    } else {
        return {
            mode: currentMode ,
            latitude: currentLatitude, 
            longitude: currentLongitude,
            success: 1
        };
    }
    
}
PositionBasedOnGPSD.prototype.getPosition = getPosition

//module.exports = PositionBasedOnGPSD;
var positionSendor = new PositionBasedOnGPSD(program, device, port)
let result = {Position: positionSendor.getPosition(0)}
console.log(result)