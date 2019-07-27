var randomstring = require("randomstring");
var express = require ('express');
var app = express ();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
var arr_identifier = {};



app.get('/', function(req, res){
  res.sendFile(__dirname + '/public_html/index.html');
});

app.get('/control', function(req, res){
  res.sendFile(__dirname + '/public_html/control.html');
});

io.on('connection', function(socket){
	var devicetype = socket.handshake.query['devicetype'];

	if(devicetype == 'desktop')
	{
		console.info("Device Type: ", devicetype);
		var token = randomstring.generate({
  charset: 'hex',
  length: 7
});
		arr_identifier[socket.id] = {
			"token":token,
			"devicetype":"desktop"
		};		

		//console.info("NEW IDENTIFIER ", arr_identifier);
	    clients[token] = {
	      "desktop_socketId": socket.id
	    }; 

		io.to(socket.id).emit('token', token);  
		console.info('New client connected ('+token +' = '+ socket.id + ').');
	}
	else if(devicetype == 'mobile')
	{
		console.info("Device Type: ", devicetype);

		var desktop_socketId = '';
		var current_token = '';

		socket.on('initPairing', function(data){
			if(clients[data.token] != undefined )
			{			
				desktop_socketId = clients[data.token].desktop_socketId;		
				current_token = data.token;
				arr_identifier[socket.id] = {
					"token":data.token,
					"devicetype":"mobile"
				};		

			    clients[data.token]= {
			    	"desktop_socketId":desktop_socketId,
			      	"client_socketId": socket.id
			    }; 
			   
			    io.to(socket.id).emit('deviceDesktopPaired', {'status':'paired','token':data.token,'device_socketId':socket.id,'desktop_socketId':desktop_socketId});  
				io.to(desktop_socketId).emit('deviceDesktopPaired', {'status':'paired','token':data.token,'device_socketId':socket.id,'desktop_socketId':desktop_socketId});

				console.info("Paired: ",clients[data.token]);	


			}
			else
			{
			    io.to(socket.id).emit('deviceDesktopPaired', {'status':'failed','token':data.token,'device_socketId':'','desktop_socketId':''});  
				console.info("Paired: ERROR");					
			}
		});



		if(current_token != '')
		{
	
			if(clients[current_token] != undefined )
			{
				
			}
			else
			{
				console.info("Token "+current_token+" not exists");	
			}

		}
		else
		{
			io.to(socket.id).emit('token', token);  
		}


		// if(clients[socket.handshake.query['dekstop_token']] != undefined )
		// {


 		// 	io.to(socket.id).emit('token_validate', 'success'); 
		// 	io.to(desktop_socketId).emit('devicePaired', 'true');  

		// 	socket.on('devicemotion', function(data){
		// 		io.to(desktop_socketId).emit('devicemotion', data);
		// 	});

		socket.on('startTrigger', function(data){

			io.to(data.desktop_socketId).emit('startTrigger', data);
		});

		// 	socket.on('action', function(data){
		// 		io.to(desktop_socketId).emit('action', data);
		// 			console.info("ACTION "+data);
		// 	});

	 	// 	console.info("Paired: ", clients[socket.handshake.query['dekstop_token']]);			
		// }		
		// else
		// {
		// 	io.to(socket.id).emit('token_validate', 'failed');  	
		// 	io.to(socket.id).emit('devicePairedWithDesktop', 'false');  
			
		// 	console.info("Token "+socket.handshake.query['dekstop_token']+" not exists");

		// }

	}

	socket.on('pairedSuccess', function(data){
		console.info('YYYYYYYYYYYYYYY' + data.desktop_socketId);
		io.to(data.desktop_socketId).emit('waitTrigger', {'trigger':'pending'});
		io.to(data.device_socketId).emit('waitTrigger', {'trigger':'pending'});

	});

	socket.on('currentIngredient', function(data){
		io.to(data.device_socketId).emit('currentIngredient', data);
		console.info("XXXXXXXXXXXXXXXXXXXXXXX", data); 
	});

	socket.on('deviceorientation', function(data){
		var current_socketId = clients[data.token].desktop_socketId;	
		console.info("alpha "+Math.round(data.alpha) +" beta "+Math.round(data.beta) +" gamma "+ Math.round(data.gamma));
		io.to(current_socketId).emit('deviceorientation', data);
	});

	socket.on('devicePairedWithDesktop', function(data){
		var current_socketId = clients[data.token].client_socketId;	
		console.info("----- device Socket id  : " + current_socketId);
		console.info("devicePairedWithDesktop : " + data.paired);
		io.to(current_socketId).emit('devicePairedWithDesktop', data.paired);
	});
	// socket.on('devicemotion', function(data){
	// 	var current_socketId = clients[data.token].desktop_socketId;	
	// 	console.info("x "+ data.x + " y" + data.y + "z" + data.z + "r" + data.r);
	// 	io.to(current_socketId).emit('devicemotion', data);
	// });

	//Removing the socket on disconnect
	socket.on('disconnect', function (data) {

	
		if(arr_identifier[socket.id] != undefined )
		{
			var disc_token = arr_identifier[socket.id].token;
			if(clients[disc_token] != undefined )
			{
				if(arr_identifier[socket.id].devicetype == 'desktop')
				{
					io.to(clients[disc_token].client_socketId).emit('disconnect', {'status':'disconnect','token':disc_token,'device_socketId':clients[disc_token].desktop_socketId,'desktop_socketId':clients[disc_token].client_socketId});
				}
				else
				{
					io.to(clients[disc_token].desktop_socketId).emit('disconnect', {'status':'disconnect','token':disc_token,'device_socketId':clients[disc_token].desktop_socketId,'desktop_socketId':clients[disc_token].client_socketId});				
				}

				console.log(disc_token + ' token disconnected');
				delete clients[arr_identifier[socket.id].token];
				delete arr_identifier[socket.id];
			}
		}

		// var x = arr_identifier[socket.id]
		// console.log(x->token);

		// var unset_token = arr_identifier[socket.id].token;
		// delete clients[unset_token];
		//delete clients[socket.id];
	});

});

app.use(express.static(__dirname + '/public_html'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});