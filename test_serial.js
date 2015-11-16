var serial = require('./modules/serial.util.js')()

serial.init()

serial.on(function(data){
	console.log(data)
})