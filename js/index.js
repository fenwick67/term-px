
// manual listeners for change of file

var ta = document.getElementById('ta'); //textarea
var div = document.getElementById('dropzone');
var scaleInput = document.getElementById('sc')
var input = document.getElementById('fi');//file input
var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d');
var jsEl = document.getElementById('jsresult');
var ditherAlgEl = document.getElementById('dither-alg');
var sizeEl = document.getElementById('size');
var smoothingEl = document.getElementById('smoothing');
var file = null;
var img = null;
var term = new Terminal({
  rows:20,
  cols:150
});
term.open(document.getElementById('terminal'));
var RGBs =
    [//    dark         bright
      [[  0,  0,  0],[ 58, 58, 58]],// black
      [[178,  0,  0],[247, 48, 58]],// red
      [[ 50,184, 26],[ 89,255, 68]],// green
      [[185,183, 26],[255,253, 67]],// yellow
      [[  0, 21,182],[ 85, 91,253]],// blue
      [[177,  0,182],[246,055,253]],// magenta
      [[ 47,186,184],[ 86,255,255]],// cyan
      [[184,184,184],[255,255,255]] // white
    ];

var flatRGBs = RGBs.reduce(function(a, b) {
  return a.concat(b);
});

[ditherAlgEl,scaleInput,smoothingEl].forEach(function(el){
  el.addEventListener('change',function(){
  console.log('!')
    if(img){
      renderAndCompute();
    }
  })
})

input.addEventListener('change', function(){
        for (var i = 0; i < this.files.length; i ++){
          gotImage(this.files[i]);
        }
    }, false);


    var cancelDrag = function(){
      div.style = "";
      return false
    }
    div.ondragexit = div.ondragend = div.ondragleave = cancelDrag;

    div.ondrop = function(event){
      event.preventDefault();
      cancelDrag();
      var files = event.dataTransfer.files;
      gotImage(files[0])
      return false;
    }

    div.ondragover = function(event){
      div.style = "border-style: dashed"
      return false;
    }

function gotImage(file){

  if (!isImg(file.name)){
    return;
  }
  file = file;


  // get image data from the file
  img = document.createElement('img');

  var reader = new FileReader();
  if (isImg(file.name)){
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
  }
  reader.readAsDataURL(file);

  img.onload =  renderAndCompute

  img.file = file;
}


function renderAndCompute(){

    var invScale = Number(scaleInput.value)
    var scale = invScale > 0? 1/invScale:1;
    var w = Math.floor(img.width*scale);
    var h = Math.floor(img.height*scale);
    console.log(smoothingEl.checked);
    if(smoothingEl.checked){
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled       = true;
      ctx.webkitImageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled    = true;
      ctx.msImageSmoothingEnabled     = true;
      ctx.oImageSmoothingEnabled      = true;
    }else{
      ctx.imageSmoothingEnabled       = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled    = false;
      ctx.msImageSmoothingEnabled     = false;
      ctx.oImageSmoothingEnabled      = false;
    }

    ctx.width = canvas.width = w;
    ctx.height = canvas.height = h;
    ctx.drawImage(img,0,0,w,h);

    console.log(w,h);
    // get image data
    var data = ctx.getImageData(0,0,w,h);
    var dat= data.data;

    //dither
    var alg = ditherAlgEl.value;
    if (alg != 'none' && alg !='rgb'){
      var djs = new DitherJS({
        palette:flatRGBs,
        algorithm:alg,
        step:1
      })
      djs.ditherImageData(data);
    }

    var ansi = termPx.convertImage(data,{format:alg=='rgb'?'rgb':false,reset:'line'}).replace(/\n/g,'\r\n')

    ta.value = ansi;
    term.resize(w,20);
    sizeEl.innerHTML = 'dimensions: '+w+'x'+h;
    term.clear();
    term.write(ansi);
    jsEl.value = jsEscape(ansi);
  };


function isImg(filename){
  var ext = getExt(filename).toLowerCase();
  var n = ['png','gif','bmp','svg','tif','jpg','jpeg'];
  return (n.indexOf(ext) > -1)
}

function getExt(n){
  var i = n.lastIndexOf('.');
  if (i > -1){
    return n.slice(i+1);
  }else{return ''}
}
function getRgbCss(rgb){
  return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
}

function jsEscape(s){
  return '"' + s.replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\033/g,'\\033') + '"';
}
