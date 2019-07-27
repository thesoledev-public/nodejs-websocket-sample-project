

var socket = io();
var windowHeight = window.innerHeight;
var windowWidth = $(window).width() - 17;

var pairing = "";
var urlPath = "http://168.168.37.15:3000/";
//var urlPath = "http://lohei.sg:3000/";


$(function() {

  if( 'ontouchstart' in window || window.navigator.msMaxTouchPoints ) {
   
  }
  else
  {
     window.location.href = urlPath ;
  }


});


// if(typeof window.chrome == "object") {
//  window.location.href = urlPath;
// }

var arr_pairing = {};

socket = io.connect(urlPath, { query: "devicetype=mobile"});

socket.on('deviceDesktopPaired', function(data){
    
    console.log(data);
    
    if(data.status == 'paired')
    {
      arr_pairing[data.token]= {
        'desktop_socketId' : data.desktop_socketId,
        'device_socketId' : data.device_socketId,
        'token' : data.token,
        'status' : data.status
      }; 
      $('#connect-token-container').hide();
      $('#loading-connect').show();    
    }
    else
    {
      alert('Token not exists.');
    }

});

socket.on('waitTrigger', function(data){
    
    console.log(data);

    if(data.trigger == 'pending')
    {
      $('.content-container').hide();
      $('.trigger-container').show();    
    }
    else
    {
      alert('Token not exists.');
    }

});

socket.on('disconnect', function(data){
  console.log('Disconnect pairing trigger from desktop.');
  arr_pairing = {};
  $('.content-container').show();
  $('.trigger-container').hide();    
  $('#connect-token-container').show();
  $('#loading-connect').hide();       
      window.location.href = urlPath + 'control';
});


socket.on('currentIngredient', function(data){

    console.log(data);
    changeBGPlate(data.platename);

});

// [+] GENERIC FUNCTION
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// [-] GENERIC FUNCTION

var token_connected ='';
if(getParameterByName('token'))
{
    $('#txt-token').val(getParameterByName('token'));

}

$(document).on('click','#btn-connect',function(e)  {

    if($('#txt-token').val() != '')
    {
        token_connected = $('#txt-token').val();

        socket.emit("initPairing", {"token":token_connected});



        socket.on('token_validate', function(data){
          // alert(data);
          if(data == 'success')
          {
            $('#connect-token-container').hide();
            $('#loading-connect').show();  
          }
          else
          {
            $('#connect-token-container').show();
            $('#loading-connect').hide();              
          }

            
        });

    }

});  


$(document).on('click','#btn-start',function(e)  {
    $(this).hide();
    $('#screen-2-container').show();
    socket.emit("startTrigger", {
          'desktop_socketId' : arr_pairing[token_connected].desktop_socketId,
          'device_socketId' : arr_pairing[token_connected].device_socketId,
          'token' : arr_pairing[token_connected].token,
          'trigger' : 'start',
        }

    );

    init();
});   



$(function() {

  if( 'ontouchstart' in window || window.navigator.msMaxTouchPoints ) {

      // Acceleration
      var action_ax = 0;
      var action_ay = 0;

      //initSocketConnect('mobile');


      socket.on('devicemotion', function(data){
       // $('#dataContainerMotion').html('x: ' + data.x + '<br/>y: ' + data.y + '<br />z: ' + data.z + '<br />r: ' + data.r+'<br/><br/>alpha: ' + data.r.alpha + '<br/>beta: ' + data.r.beta + '<br />gamma: ' + data.r.gamma);
      });


      socket.on('devicePairedWithDesktop', function(data){
        alert(data);
          if(data == 'true')
          {
            console.log('ffffffffffff');
            $('#connect-token-container').fadeOut("fast");
            $('#loading-connect').fadeOut("fast");
            $('#screen-1-container').fadeIn("slow");
         }


      });   


   
  }


});

function changeBGPlate(platename){

  if(platename != '')
  {
    $('.mob-plate-container').css({
      "background": "url('../images/LoHei_objects/"+platename+".png') no-repeat bottom center",
      "background-repeat": "no-repeat",
      "background-attachment": "fixed",
      "background-position": "center bottom"
    });    
  }
  // else
  // {
  //   $('.mob-plate-container').css({
  //     "background": "url('../images/LoHei_objects/Plate1.png') no-repeat bottom center";
  //     "background-repeat": "no-repeat";
  //     "background-attachment": "fixed";
  //     "background-position": "center bottom";      
  //   });    
  // }

}

$(document).on('click','img.item',function(e)  {

    });
   // Position Variables
      var x = 0;
      var y = 0;

      // Speed - Velocity
      var vx = 0;
      var vy = 0;

      // Acceleration
      var ax = 0;
      var ay = 0;

      function init() {



        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; // Detect Android devices


var initialOffset = null;

        //Find our div containers in the DOM
        var dataContainerOrientation = document.getElementById('dataContainerOrientation');
        var dataContainerMotion = document.getElementById('dataContainerMotion');

        //Check for support for DeviceOrientation event
        if(window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', function(event) {
                  var alpha = event.alpha;
                  var beta = event.beta;
                  var gamma = event.gamma;
                 
                  if(token_connected != '')
                  {
                    if (isAndroid) {
                        
                         if(initialOffset === null) {
                         initialOffset = alpha;
                         }

                         var alpha = alpha - initialOffset;

                         if(alpha < 0) {
                         alpha += 360;
                         }

                        
                    }
                    else
                    {
                       if(initialOffset === null && event.absolute !== true
                       && +event.webkitCompassAccuracy > 0 && +event.webkitCompassAccuracy < 50) {
                       initialOffset = event.webkitCompassHeading || 0;
                       }

                       var alpha = event.alpha - initialOffset;
                       if(alpha < 0) {
                       alpha += 360;
                       }                      
                    }
                    socket.emit("deviceorientation", {"token":token_connected,"alpha": alpha,"beta": beta,"gamma": gamma});
                  }
                }, false);
        }

        // Check for support for DeviceMotion events
        if(window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', function(event) {
                  var x = event.acceleration.x;
                  var y = event.acceleration.y;
                  var z = event.acceleration.z;
                  var r = event.rotationRate;
                  if(token_connected != '')
                  {
                    socket.emit("devicemotion", {"token":token_connected,"x": x,"y": y,"z": z,"r": r});
                  }
          
                });
        }

      }
