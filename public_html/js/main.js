// if(typeof window.chrome != "object") {
//  alert('google chrome is required!');
// }


var socket = io();
var windowHeight = window.innerHeight;
var windowWidth = $(window).width() - 17;

var pairing = "";
var urlPath = "http://192.168.56.1:3000/";
//var urlPath = "http://lohei.sg:3000/";

$(function() {

  if( 'ontouchstart' in window || window.navigator.msMaxTouchPoints ) {
    window.location.href = urlPath + 'control';
  }


});


$(function(){

  $('.share-fb').click(function(e){
    var url = 'https://www.facebook.com/dialog/share?';
    url += 'app_id=986085108125982';
    url += '&display=popup';
    url += '&href=http%3A%2F%2Ffuturemadedifferent.com%2F';
    url += '&redirect_uri=http%3A%2F%2Ffuturemadedifferent.com%2F';
    window.open(url,'_blank');
    e.preventDefault();
  });

});


var currentToken = '';

var arr_pairing = [];


// $("#desktop").css({"width":windowWidth,"height":windowHeight});
// $(".ingredients-container").css({"width":windowWidth -20,"height":windowHeight,"overflow":'hidden',"top":"0px"});
// $("#screen-11").css({"width":windowWidth,"height":windowHeight});
// $("#screen-13").css({"width":windowWidth,"height":windowHeight});

$(window).resize(function(){
  windowHeight = window.innerHeight;
  windowWidth = $(window).width() - 17;

  $("#desktop").css({"width":windowWidth,"height":windowHeight});
  $(".ingredients-container").css({"width":windowWidth -20,"height":windowHeight,"overflow":'hidden',"top":"0px"});
  $("#screen-11").css({"width":windowWidth,"height":windowHeight});
  $("#screen-13").css({"width":windowWidth,"height":windowHeight});
});
  $("#desktop").css({"width":windowWidth,"height":windowHeight});
  $(".ingredients-container").css({"width":windowWidth -20,"height":windowHeight,"overflow":'hidden',"top":"0px"});
  $("#screen-11").css({"width":windowWidth,"height":windowHeight});
  $("#screen-13").css({"width":windowWidth,"height":windowHeight});



socket = io.connect(urlPath, { query: "devicetype=desktop" });
socket.on('token', function(data){
  currentToken = data;
  $('#qrcode-container').html('<img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl='+urlPath+'control?token='+data+'&choe=UTF-8" title="Link to Google.com" />'+'<br /><div class="token-txt"><strong>TOKEN : ' + data +'</strong></div>');
});


$("#screen-1").css('width',windowWidth+'px');
$("#screen-1").css('height',windowHeight +'px');

socket.on('disconnect', function(data){
  console.log('Disconnect pairing');
  arr_pairing = [];
  location.reload();
});



socket.on('deviceDesktopPaired', function(data){
    console.log(data);
    if(data.status == 'paired')
    {
        arr_pairing= {
          'desktop_socketId' : data.desktop_socketId,
          'device_socketId' : data.device_socketId,
          'token' : data.token,
          'status' : data.status
        }; 

        socket.emit("pairedSuccess", {'status':data.status,'token':data.token,'device_socketId':data.device_socketId,'desktop_socketId':data.desktop_socketId}); 
        
        $('#welcome-screen').hide();
        $('#screen-1').fadeIn("slow");
        $(".label-item").addClass("hide");
        $(".label-1").removeClass("hide"); 
    }
    else
    {
      alert('Token not exists.');
    }

});

socket.on('startTrigger', function(data){

  if(data.trigger == 'start')
  {
    $('#screen-1').hide();
    $('#screen-2').fadeIn("fast");
    $(".label-item").addClass("hide");
    $(".label-2").removeClass("hide"); 

    setTimeout(function(){
     $('#screen-2 .intro').fadeOut("slow"); 
     $('#screen-2 .stage').fadeIn("slow"); 
     setTimeout(function(){setTimeout(getDeviceOrientation('fish','animate'), 1000);},100);
     socket.emit("currentIngredient", {'platename':'Plate1','currentIngredient':'fish','token':data.token,'device_socketId':data.device_socketId,'desktop_socketId':data.desktop_socketId}); 
    },1000);

  }
  
}); 




    // [+] THIS IS FOR DESKTOP AND DEVICE PAIRING

    initIngredient('fish',"#screen-2 .ingredients-container");
    ingredientGravity('fish','false');   

    initIngredient('carrots',"#screen-6 .ingredients-container");
    ingredientGravity('carrots','false'); 

    initIngredient('greenRadish',"#screen-7 .ingredients-container");
    ingredientGravity('greenRadish','false'); 

    initIngredient('whiteRadish',"#screen-8 .ingredients-container");
    ingredientGravity('whiteRadish','false');   

    initIngredient('peanut',"#screen-9 .ingredients-container");
    ingredientGravity('peanut','false');   

    initIngredient('crunch',"#screen-10 .ingredients-container");
    ingredientGravity('crunch','false');   

    initTossIngredient();
    ingredientGravity('toss','false');  

    var waitingTrigger;
    var stopCheckPairing = 'false';

    // function checkPairing() {
    //   socket.on('devicePaired', function(data){
    //     if(data == 'true' && stopCheckPairing == 'false')
    //     {
    //       socket.emit("devicePairedWithDesktop",  {"token":currentToken,"paired": "true"});          

    //       $('#welcome-screen').hide();
    //       $('#screen-1').fadeIn("slow");
    //       $(".label-item").addClass("hide");
    //       $(".label-1").removeClass("hide");
   


    //       clearInterval(pairing);
    //       waitingTrigger = setInterval(waitForTrigger, 1000);
       
    //       stopCheckPairing = 'true';
    //     }
        
    //   });      
    // }

    // var actionTrigger;
    // var stopWaitForTrigger = 'false';
    // function waitForTrigger() {

    //     console.log('waitForTrigger');
    //     socket.on('startTrigger', function(data){

    //       if(data == 'true' && stopWaitForTrigger == 'false')
    //       {
    //         $('#screen-1').hide();
    //         $('#screen-2').fadeIn("fast");
    //         $(".label-item").addClass("hide");
    //         $(".label-2").removeClass("hide"); 
    //         clearInterval(waitingTrigger);
    //         setTimeout(function(){
    //          $('#screen-2 .intro').fadeOut("slow"); 
    //          $('#screen-2 .stage').fadeIn("slow"); 
    //          setTimeout(function(){setTimeout(getDeviceOrientation('fish','animate'), 1000);},100);
            
    //         },1000);
    //         stopWaitForTrigger = 'true';
    //       }
          
    //     }); 
    
    // }  

// [-] THIS IS FOR DESKTOP AND DEVICE PAIRING


// [+] DEVICE ORIENTATION TRIGGER
    var ctrIngredientDrop = 0;
    var stopDeviceOrientation = 'false';

    var orientation_alpha = 0;
    var orientation_beta = 0;
    var orientation_gamma = 0;
    var current_orientation_alpha = 0;
    var currentIngredientName = '';
    var limitIngredientDrop= 100;
    var nextStep = '';    
    function getDeviceOrientation(ingredientName, stepNo) {
        console.log('getDeviceOrientation');
        currentIngredientName = ingredientName;
        nextStep = stepNo;

          socket.on('deviceorientation', function(data){
            
              if(stopDeviceOrientation != 'true' && currentIngredientName != '' && nextStep != '')
              {
                  orientation_alpha = Math.round(data.alpha);
                  orientation_beta = Math.round(data.beta);
                  orientation_gamma = Math.round(data.gamma);
                   
                  console.log('alpha: ' + orientation_alpha + '<br /> beta: ' + orientation_beta + '<br />gamma: ' + orientation_gamma);

                  if(orientation_alpha != '0' && orientation_alpha != current_orientation_alpha)
                  {
                    console.log('<<<<<<<<<<<<<'+currentIngredientName);

                    if(currentIngredientName == 'toss')
                    {
                      console.log('TOSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                      limitIngredientDrop = 300;
                      tossIngredientsWithDevice(orientation_beta);
                      ctrIngredientDrop++;
                    }
                    else
                    {
                      if(orientation_alpha < 100)
                      {
                        linkIngredientsAndDevice(currentIngredientName,orientation_alpha);  ctrIngredientDrop++;
                      }
                      
                    }
                    
                   
                    

                    if(ctrIngredientDrop > limitIngredientDrop)
                    {
                      if(nextStep == 'animate')
                      {
                        loadPrepAnimation();  
                      }
                      else if(nextStep == 'greenRadish')
                      {
                        socket.emit("currentIngredient", {'platename':'Plate6','currentIngredient':'greenRadish','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
                        triggerGreenRaddish();
                      }
                      else if(nextStep == 'whiteRadish')
                      {
                        socket.emit("currentIngredient", {'platename':'Plate7','currentIngredient':'whiteRadish','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
                        triggerWhiteRaddish();
                      }
                      else if(nextStep == 'peanut')
                      {
                        socket.emit("currentIngredient", {'platename':'Plate8','currentIngredient':'peanut','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
                        triggerPeanut();
                      }   
                      else if(nextStep == 'crunch')
                      {
                        socket.emit("currentIngredient", {'platename':'Plate9','currentIngredient':'crunch','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
                        triggerCrunch();
                      }          
                      else if(nextStep == 'toss')
                      {
                        triggerPrepareToss();
                      }                                                                            
                      else if(nextStep == 'end')
                      {
                        triggerProverbs();
                      }                            
                      stopDeviceOrientation = 'true';
                    }
                    current_orientation_alpha = orientation_alpha; 
                 }
              }

          });
        
    }
// [-] DEVICE ORIENTATION TRIGGER

// triggerPrepareToss();

    // loadPrepAnimation();

    function loadPrepAnimation() {
          console.log('loadPrepAnimation' + 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
          $('#screen-2').hide();
          $('#screen-3').fadeIn("fast");
      

          setTimeout(function(){
           $('#screen-3 .intro').fadeOut("fast"); 
           $('.label-container').fadeOut("fast"); 
           $('#screen-3 .stage').fadeIn("fast"); 
           $('#screen-3 .stage').html('<img src="images/LoHei_objects/3Lime.gif"/>  '); 
           socket.emit("currentIngredient", {'platename':'Plate2','currentIngredient':'lime','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
            // PEPPER ANIMATION
            setTimeout(function(){
              $('#screen-3').hide();
              $('#screen-4').fadeIn("fast");
              $('.label-container').fadeIn("fast");           
      
              $(".label-item").addClass("hide");
              $(".label-3").removeClass("hide");  
              socket.emit("currentIngredient", {'platename':'Plate3','currentIngredient':'pepper','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
              setTimeout(function(){
               $('.label-container').fadeOut("fast"); 
               $('#screen-4 .intro').fadeOut("fast"); 
               $('#screen-4 .stage').fadeIn("fast"); 
               $('#screen-4 .stage').html('<img src="images/LoHei_objects/4Pepper.gif"/>'); 
                
                socket.emit("currentIngredient", {'platename':'Plate4','currentIngredient':'sauce','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 

                // SAUCE ANIMATION
                setTimeout(function(){
                  $('#screen-4').hide();
                  $('#screen-5').fadeIn("fast");
                  $('.label-container').fadeIn("fast"); 
                
                  $(".label-item").addClass("hide");
                  $(".label-4").removeClass("hide");  
                  socket.emit("currentIngredient", {'platename':'Plate5','currentIngredient':'oil','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 

                  setTimeout(function(){
                   $('.label-container').fadeOut("fast"); 
                   $('#screen-5 .intro').fadeOut("fast"); 
                   $('#screen-5 .stage').fadeIn("fast"); 
                   $('#screen-5 .stage').html('<img src="images/LoHei_objects/6Oil.gif"/>'); 


                  socket.emit("currentIngredient", {'platename':'Plate5','currentIngredient':'carrots','token':arr_pairing['token'],'device_socketId':arr_pairing['device_socketId'],'desktop_socketId':arr_pairing['data.desktop_socketId']}); 
                      setTimeout(function(){
                        $('#screen-5').hide();
                        triggerCarrots();

                      },3000); 




                  },3000); 

                },3000);                  

              },3000); 

            },3000);          


          },3000);          


    }

    //[+] CARROTS ANIMATION TEST NOT YET INTEGRATED
      

      function triggerCarrots(){
          $('.label-container').fadeIn("fast"); 
          $('#screen-6').fadeIn("fast");
          $('#screen-6').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-5").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-6 .intro').fadeOut("fast"); 
            $('#screen-6 .stage').fadeIn("fast"); 
            carrot();
            
            getDeviceOrientation('carrots','greenRadish');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }

      var carrot = function(e) {
              function n(s, t) {
                  return $(".carrot-animate-" + s).removeClass("hide"), $(".carrot-animate-" + (s - 1)).addClass("hide"), s > t ? carrot() : void setTimeout(function() {
                      n(s + 1, t);
                  }, 1e3 / i)
   
              }
              var i = 8,
                  s = 25;
              n(0, s)
          };
    //[-] CARROTS ANIMATION TEST NOT YET INTEGRATED

    
    //[+] GREENRADDISH ANIMATION TEST NOT YET INTEGRATED

      function triggerGreenRaddish(){
          $('#screen-6').hide();
          $('.label-container').fadeIn("fast"); 
          $('#screen-7').fadeIn("fast");
          $('#screen-7').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-6").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-7 .intro').fadeOut("fast"); 
            $('#screen-7 .stage').fadeIn("fast"); 
            greenRadish();
            
            getDeviceOrientation('greenRadish','whiteRadish');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }    
      var greenRadish = function(e) {
              function n(s, t) {
                  return $(".greenRadish-animate-" + s).removeClass("hide"), $(".greenRadish-animate-" + (s - 1)).addClass("hide"), s > t ? greenRadish() : void setTimeout(function() {
                      n(s + 1, t);
                  }, 1e3 / i)
   
              }
              var i = 8,
                  s = 25;
              n(0, s)
          };
    //[-] GREENRADDISH ANIMATION TEST NOT YET INTEGRATED


    // //[+] WHITERADDISH ANIMATION TEST NOT YET INTEGRATED

      function triggerWhiteRaddish(){
          $('#screen-7').hide();
          $('.label-container').fadeIn("fast"); 
          $('#screen-8').fadeIn("fast");
          $('#screen-8').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-7").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-8 .intro').fadeOut("fast"); 
            $('#screen-8 .stage').fadeIn("fast"); 
            whiteRadish();
            
            getDeviceOrientation('whiteRadish','peanut');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }        
      var whiteRadish = function(e) {
            function n(s, t) {
                return $(".whiteRadish-animate-" + s).removeClass("hide"), $(".whiteRadish-animate-" + (s - 1)).addClass("hide"), s > t ? whiteRadish() : void setTimeout(function() {
                    n(s + 1, t);
                }, 1e3 / i)
 
            }
            var i = 8,
                s = 25;
            n(0, s)
       };
    //   //[-] WHITERADDISH ANIMATION TEST NOT YET INTEGRATED

    // //[+] PEANUT

      function triggerPeanut(){
          $('#screen-8').hide();
          $('.label-container').fadeIn("fast"); 
          $('#screen-9').fadeIn("fast");
          $('#screen-9').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-8").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-9 .intro').fadeOut("fast"); 
            $('#screen-9 .stage').fadeIn("fast"); 
               
            getDeviceOrientation('peanut','crunch');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }    
      // //[-] PEANUT


    // //[+] PEANUT

      function triggerCrunch(){
          $('#screen-9').hide();
          $('.label-container').fadeIn("fast"); 
          $('#screen-10').fadeIn("fast");
          $('#screen-10').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-9").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-10 .intro').fadeOut("fast"); 
            $('#screen-10 .stage').fadeIn("fast"); 
               
            getDeviceOrientation('crunch','toss');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }    
      // //[-] PEANUT


    // //[+] PLATE

      function triggerPrepareToss(){
          $('#screen-10').hide();
          $('.label-container').fadeIn("fast"); 
          $('#screen-11').fadeIn("fast");
          $('#screen-11').fadeIn("fast");

          $(".label-item").addClass("hide");
          $(".label-9").removeClass("hide");                            

          setTimeout(function(){

            $('.label-container').fadeOut("fast");
            $('#screen-11').fadeOut("slow"); 
             $('#screen-12').fadeIn("fast"); 
            $('#screen-12 .intro').fadeOut("fast"); 
            $('#screen-12 .stage').fadeIn("fast"); 
               
            getDeviceOrientation('toss','end');
            stopDeviceOrientation = 'false';
            ctrIngredientDrop = 0;            
          },3000);  

      }    
      // //[-] PLATE

      // //[+] PROVERBS

        function triggerProverbs(){
            $('#screen-12').hide();
            $('.label-container').fadeIn("fast"); 

            $('#screen-13').fadeIn("slow");

            $('.label-container').fadeOut("fast");                            

  
            var randProverbs = Math.floor((Math.random() * 2) + 1);
            $('#proverbs-' + randProverbs).removeClass("hidden"); 
          
            $('#screen-13').fadeIn("slow");

        }    
        // //[-] PROVERBS



      // var e = function(e) {
      //         function n(s, t) {
      //             return $(".greenraddish-animate-" + s).removeClass("hide"), $(".greenraddish-animate-" + (s - 1)).addClass("hide"), s > t ? e() : void setTimeout(function() {
      //                 n(s + 1, t);
      //             }, 1e3 / i)
   
      //         }
      //         var i = 8,
      //             s = 13;
      //         n(0, s)
      //     };


    function linkIngredientsAndDevice(ingredientName,action_alpha)
    {
          // generateFallingIngredients('');

          var ctrItem = action_alpha;
          var degRotate = Math.floor((Math.random() * 360) + 1);
      
          var objleft = Math.floor((Math.random() * (windowWidth -200)) + 1); 

          // if(ctrItem > 300)
          // {
          //   ctrItem = ctrItem - 300;
          // }
          // else if(ctrItem > 100 && ctrItem < 200)
          // {
          //   ctrItem = ctrItem - 100;
          // }

          if($('#'+ingredientName+'-falling-'+ctrItem).length)
          {
            console.log(ingredientName + '---------------');
             console.log('#'+ingredientName+'-falling-'+ctrItem);
              var objTop = $('#'+ingredientName+'-falling-'+ctrItem).css('top'); 
              objTop =objTop.replace('px','');
       
              var rand_objtop = Math.floor((Math.random() * 300) + 1);  

              if( objTop> windowHeight)
              {
                $('#'+ingredientName+'-falling-'+ctrItem).css({'top':rand_objtop+'px','left':objleft+'px','transform':'rotate('+degRotate+'deg)','MozTransform':'rotate(-'+degRotate+'deg)'});
              }

          }
    }

    function tossIngredientsWithDevice(action_beta)
    {
          // generateFallingIngredients('');

          var ctrItem = action_beta;
          console.log(ctrItem);
         // var rand = Math.floor((Math.random() * 150) + 1);
          if(ctrItem > 20)
          {
            $('.toss-falling').each(function( index ) {

                var degRotate = Math.floor((Math.random() * 360) + 1);
                var objleft = Math.floor((Math.random() * (windowWidth -200)) + 1);   
                var objRandTop = Math.floor((Math.random() * (windowHeight)) + 1);        
      

                    var objTop =  $(this).css('top'); 
                    objTop =objTop.replace('px','');
             
                    if( objTop> windowHeight)
                    {
                       $(this).css({'top':objRandTop+'px','left':objleft+'px','transform':'rotate('+degRotate+'deg)','MozTransform':'rotate(-'+degRotate+'deg)'});
                    }

            }); 
  
          }
          // for (ctr = 0; ctr < ctrItem; ctr++)  
          // {
          //     var degRotate = Math.floor((Math.random() * 360) + 1);
          //     var objleft = Math.floor((Math.random() * (windowWidth -200)) + 1);   
          //     var objRandTop = Math.floor((Math.random() * (windowHeight)) + 1);        
          //     if($('#toss-falling-'+ctr).length)
          //     {
          //        console.log('#toss-falling-'+ctr);
          //         var objTop = $('#toss-falling-'+ctr).css('top'); 
          //         objTop =objTop.replace('px','');
           
          //         if( objTop> windowHeight)
          //         {
          //           $('#toss-falling-'+ctr).css({'top':objRandTop+'px','left':objleft+'px','transform':'rotate('+degRotate+'deg)','MozTransform':'rotate(-'+degRotate+'deg)'});
          //         }

          //     }
          // }
    }

    $(document).on('click','#btn-toss',function(e)  {
        var degRotate = Math.floor((Math.random() * 360) + 1);
        tossIngredientsWithDevice(degRotate);
    });   


    // $(document).on('click','#test-action',function(e)  {
    //     e.preventDefault();
    //     triggerIngredientsFall('carrots','');
    // });  
    // $(document).on('click','#btn-connect',function(e)  {
    //     e.preventDefault();
    //     token_connected = $('#token').val();
    //     $('#connect-container').hide();
    //     $('#display-connected-token').html(token_connected);
    // });    


    function ingredientGravity(ingredientName,stopTimer) {

        $('.'+ingredientName+'-falling').each(function( index ) {
          
          var objPosTop = $(this).css('top');
          objPosTop = objPosTop.replace('px','');

          if(objPosTop < windowHeight )
          {
            var newTop = parseInt(objPosTop)  + 100;
             $(this).css('top',newTop + 'px');
          }

        });

        if(stopTimer != 'true')
        {
          setTimeout(function() {ingredientGravity(ingredientName,stopTimer);},  100);    
        }

    }

    function initIngredient(ingredientName,targetObj) {


      var arr_ingredientsImages = {'fish':"images/LoHei_objects/Fish1.png",'carrots':"images/LoHei_objects/carrot1.png","greenRadish":"images/LoHei_objects/GreenRadish1.png","whiteRadish":"images/LoHei_objects/WhiteRadish1.png","crunch":"images/LoHei_objects/Crunch1.png"};
      var img_src = arr_ingredientsImages[ingredientName];


      for (ctr = 0; ctr <= 100; ctr++) { 
        
        if(ingredientName == 'peanut')
        {
          var arr_ingredientsPeanutImages =new Array("images/LoHei_objects/Peanut1.png","images/LoHei_objects/Peanut2.png","images/LoHei_objects/Peanut3.png","images/LoHei_objects/Peanut4.png","images/LoHei_objects/Peanut5.png");  
          var indexId = Math.floor(Math.random() * arr_ingredientsPeanutImages.length);
          img_src = arr_ingredientsPeanutImages[indexId];
        }

         degRotate = Math.floor((Math.random() * 360) + 1);
         objtop = windowHeight +100;  
         objleft = Math.floor((Math.random() * (windowWidth -200)) + 1);  
         // $("#ingredientsContainer").append('<img src="'+ingredientsImages[indexId]+'" class="ingredients-elements ingredient-'+ctr+'" id="ingredient-'+ctr+'" style="top:'+objtop+'px; left:'+objleft+'px; transform: rotate('+degRotate+'deg);MozTransform: rotate(-'+degRotate+'deg);">');
         $(targetObj).append('<img src="'+img_src+'" class="'+ingredientName+'-falling" id="'+ingredientName+'-falling-'+ctr+'" style="position:absolute;top:'+objtop+'px; left:'+objleft+'px; transform: rotate('+degRotate+'deg);MozTransform: rotate(-'+degRotate+'deg); ">');       
      }

    }

    function initTossIngredient() {
         var ingredientsImages = new Array("images/LoHei_objects/carrot1.png","images/LoHei_objects/carrot2.png","images/LoHei_objects/GreenRadish1.png","images/LoHei_objects/GreenRadish2.png","images/LoHei_objects/WhiteRadish1.png","images/LoHei_objects/WhiteRadish2.png","images/LoHei_objects/Fish1.png","images/LoHei_objects/Fish2.png","images/LoHei_objects/Peanut1.png","images/LoHei_objects/Peanut2.png","images/LoHei_objects/Peanut3.png","images/LoHei_objects/Peanut4.png","images/LoHei_objects/Peanut5.png","images/LoHei_objects/Crunch1.png");  
         $("#ingredientsContainer").css('width','70%');
         $("#ingredientsContainer").css('height',windowHeight +'px');
         for (ctr = 0; ctr < 100; ctr++) { 
           degRotate = Math.floor((Math.random() * 360) + 1);  
           objtop = Math.floor((Math.random() * (windowHeight -200)) + 1);  
           objleft = Math.floor((Math.random() * (windowWidth -350)) + 1);  
           indexId = Math.floor(Math.random() * ingredientsImages.length);
           // $("#ingredientsContainer").append('<img src="'+ingredientsImages[indexId]+'" class="ingredients-elements ingredient-'+ctr+'" id="ingredient-'+ctr+'" style="top:'+objtop+'px; left:'+objleft+'px; transform: rotate('+degRotate+'deg);MozTransform: rotate(-'+degRotate+'deg);">');
           // $("#screen-12 .ingredients-container").append('<img src="'+ingredientsImages[indexId]+'" class="toss-falling" id="toss-falling-'+ctr+'" style="position:absolute;top:'+windowHeight+'px; left:'+objleft+'px; ">');       
           $("#screen-12 .ingredients-container").append('<img src="'+ingredientsImages[indexId]+'" class="toss-falling" id="toss-falling-'+ctr+'" style="position:absolute;top:'+objtop+'px; left:'+objleft+'px; transform: rotate('+degRotate+'deg);MozTransform: rotate(-'+degRotate+'deg); ">');       
         }

    }

  $(document).ready(function(){
    $("a.share").jqSocialSharer();
  });  