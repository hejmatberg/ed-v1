

$(document).ready(function(){


particlesJS("particles-1", {
  "particles": {
    "number": {
      "value": 1000,
      "density": {
        "enable": false,
        "value_area": 300
      }
    },
    "color": {
      "value": "#000000"
    },
    "shape": {
      "type": "image",
      "image": {
        "src": "assets/img/particle.png",
        "width": 25,
        "height": 25
      }
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": true,
        "speed": .2,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
    },
    "line_linked": {
      "enable": false,
    },
    "move": {
      "enable": true,
      "speed": .4,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "repulse": {
        "distance": 50,
        "duration": 3
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

 // Helper function to compile webGL program
  createWebGLProgram = function(ctx, vertexShaderSource, fragmentShaderSource) {

    this.ctx = ctx;

    this.compileShader = function(shaderSource, shaderType) {
      var shader = this.ctx.createShader(shaderType);
      this.ctx.shaderSource(shader, shaderSource);
      this.ctx.compileShader(shader);
      return shader;
    };

    var program = this.ctx.createProgram();
    this.ctx.attachShader(program, this.compileShader(vertexShaderSource, this.ctx.VERTEX_SHADER));
    this.ctx.attachShader(program, this.compileShader(fragmentShaderSource, this.ctx.FRAGMENT_SHADER));
    this.ctx.linkProgram(program);
    this.ctx.useProgram(program);

    return program;

  }

  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = "assets/img/secondary-img.jpg";
  
  document.querySelector('#fr2').appendChild(image);

  image.onload = function(){
    applyEffect(image);
  }
  
  
  function applyEffect(image) {

    var canvas = document.createElement('canvas');
    var mousePos = {};

    image.parentNode.insertBefore(canvas, image);
    canvas.width  = image.width;
    canvas.height = image.height;
    image.parentNode.removeChild(image);

    var ctx;
    try {
      ctx = canvas.getContext("webgl")  || canvas.getContext("experimental-webgl");
    } catch(e) {}

    if (!ctx) {
      // You could fallback to 2D methods here
      alert("Sorry, it seems WebGL is not available.");
    }

    var fragmentShaderSource = document.getElementById("fragment-shader").text;
    var vertexShaderSource = document.getElementById("vertex-shader").text;
    var program = createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource);

    // Expose canvas width and height to shader via u_resolution
    var resolutionLocation = ctx.getUniformLocation(program, "u_resolution");
    ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var mousePosition = ctx.getUniformLocation(program, "u_mouse");
    ctx.uniform2f(mousePosition, .5,.5);

    // Position rectangle vertices (2 triangles)
    var positionLocation = ctx.getAttribLocation(program, "a_position");
    var buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
       0, 0,
       image.width, 0,
       0, image.height,
       0, image.height,
       image.width, 0,
       image.width, image.height]), ctx.STATIC_DRAW);
    ctx.enableVertexAttribArray(positionLocation);
    ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

    //Position texture
    var texCoordLocation = ctx.getAttribLocation(program, "a_texCoord");
    var texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0]), ctx.STATIC_DRAW);
    ctx.enableVertexAttribArray(texCoordLocation);
    ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);

    // Create a texture.
    var texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    // Load the image into the texture.
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);

    // Draw the rectangle.
    ctx.drawArrays(ctx.TRIANGLES, 0, 6);

    canvas.addEventListener('mousemove', function(evt) {
      mousePos = (function(canvas, evt){
        var rect = canvas.getBoundingClientRect();
        return {
          x: (evt.clientX - rect.left) / canvas.width,
          y: (evt.clientY - rect.top) / canvas.height
        };
      })(canvas, evt);
      // Expose local mouse coords
      ctx.uniform2f(mousePosition, mousePos.x,  mousePos.y);
      ctx.drawArrays(ctx.TRIANGLES, 0, 6);
    });
  }



  var cancel = false;

  window.onload = function() {
    if(cancel === false){
    const container = document.querySelector('.container');
    const svg = document.querySelector('svg');
    const progressBar = document.querySelector('.progress-bar');
    // const pct = document.querySelector('.pct');
    const totalLength = progressBar.getTotalLength();
      
    setTopValue(svg);
    setLeftValue(svg);
    
    progressBar.style.strokeDasharray = totalLength;
    progressBar.style.strokeDashoffset = totalLength;
    
    window.addEventListener('scroll', () => {
      setProgress(container, progressBar, totalLength);
    });
    
    window.addEventListener('resize', () => {
      setTopValue(svg);
      setLeftValue(svg);
    });
  }
}

function setTopValue(svg) {
  svg.style.top = document.documentElement.clientHeight * 0.5 - (svg.getBoundingClientRect().height * 0.5) + 'px';
}

function setLeftValue(svg) {
  svg.style.left = document.documentElement.clientWidth * 0.5 - (svg.getBoundingClientRect().width * 0.5) + 'px';
}


function setProgress(container, progressBar, totalLength) {
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const timerH = document.querySelector('#timer').clientHeight;
  
  const percentage = scrollTop / (scrollHeight - clientHeight);

  if(percentage === 1 && cancel === false) {
    $(container).addClass('completed');
    $('.fr1').fadeOut();
    $('svg').fadeOut();
    $('#timer').addClass('active');
    
    setTimeout(function(){
      // $(container).css('background-image','url("assets/img/secondary-img.jpg")');
      $('.fr2').fadeIn();
      
      countdown();

       $('#timer').animate({
          top: '15%',
          height: '100px',
          width: '100px',
          fontSize: '20pt',
        },900);

      setTimeout(function(){
        $('.overlay').fadeOut(3000);
               
      }, 800);
   }, 800);
    

  } else {

    $('.overlay').show();
    $(container).css('background-image','url("assets/img/primary-img.jpg")');
    $('#timer').css({
      top :'50%',
      height :'300px',
      width :'300px',
      fontSize : '50pt',
    });
    $('.fr1').fadeIn();
    $('.fr2').fadeOut();

    $(container).removeClass('completed');
    $('#timer').removeClass('active');
    $('svg').fadeIn();
    
  }

  progressBar.style.strokeDashoffset = totalLength - totalLength * percentage;  
}



var interval;
function countdown() {
  clearInterval(interval);
  interval = setInterval( function() {
      var timer = $('.timer-inner').html();
      timer = timer.split(':');
      var minutes = timer[0];
      var seconds = timer[1];
      seconds -= 1;
      if (minutes < 0) return;
      else if (seconds < 0 && minutes != 0) {
          minutes -= 1;
          seconds = 59;
      }
      else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;

      $('.timer-inner').html(minutes + ':' + seconds);

      if (minutes == 0 && seconds == 0) clearInterval(interval);
  }, 1000);

};


var containerHeight = $('.container').height();

$('#next').click(function(){
  cancel = true;
  $('.overlay').hide();
  $('.container').animate({
    top: -containerHeight,
    height: 0,
  }, 2000).hide();
  $('#timer').fadeOut();
  

  setTimeout(function(){
      $('.page__container').animate({
          top:0,
      },900).css('position','absolute');

      setTimeout(function(){
        $('.top-banner h1').animate({
            top:'60%'
        },1200);

        setTimeout(function(){
          $('.arrow-icon').fadeIn();
          $('.top-banner img').fadeIn();
                   
        }, 1400);
                 
      }, 700);
               
  }, 700);
  
});
$(document).scroll(function(){
    windowScroll()
});
function windowScroll(){
  var st = $(document).scrollTop();

  $("#moveA").css({"top": 230 - st * 0.3 + "px"});
 }


// $('.swap-btns p').hover(function(){
//   if($(this).hasClass('hide')){
//     $(this).removeClass('hide');
//     $(this).siblings().addClass('hide');
//     updateBg();
//   };
// });

// function updateBg(){
// if($('.secondary').hasClass('hide')){
//   $('#sec6').css('background-image','url("assets/img/patient.png")');
// } else if($('.primary').hasClass('hide')){
//   $('#sec6').css('background-image','url("assets/img/women-at-work.png"');
// }
// }



});