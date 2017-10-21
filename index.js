
// decode an image into an approximate terminal output

var topChar = String.fromCharCode(9600);
var bottomChar = String.fromCharCode(9604);
var fullChar = String.fromCharCode(9608);

var esc = String.fromCharCode(27);
var reset = esc + '[0m';

// convert to uint8
function normalizeRgb(rgb){
  return rgb.map(function(n){
    return Math.round(  Math.max(Math.min(n,255),0)  )
  });
}

// take rgb top and bottom pixels and convert to an terminal character
function rgbToCodes(top,bottom,options){
  var options = options || {};
  var doReset = (typeof options.reset == 'boolean')?options.reset:true;
  if (options.format=="rgb"){
    return rgbToRgbCodes(top,bottom,options);
  }

  var topColor = findColor(top);
  var bottomBg = findBg(bottom);

  //same color top and bottom... save some space
  if (top[0] == bottom[0] && top[1] == bottom[1] && top[2] == bottom[2]){
    if (topColor == 30 ){//if it's black
    return esc + '[40m '+(doReset?reset:'');// black BG, then a space, then reset
    }
    return esc + '[' + topColor + 'm'+fullChar + (doReset?reset:'');
  }
  else{
    //use topChar usually

    //if top = black, or bottom = white, use bottomChar and invert
    if (topColor == 30 || bottomBg == 107){
      var bottomColor = findColor(bottom);
      var topBg = findBg(top);

      return esc + '[' + bottomColor + ';' + topBg + 'm' + bottomChar + (doReset?reset:'')
    }

    return esc + '[' + topColor + ';' + bottomBg + 'm' + topChar + (doReset?reset:'');
  }
}

module.exports = rgbToCodes;

//colors and bgs all have keys that are strings like '30;1' and '30'
// to get a esc seq from them, join with a ; and add '<esc>[' to the beginning and 'm' to the end

//for reference only
var styles = ['black','red','green','yellow','blue','magenta','cyan','white'];

// TODO: some terminals have different color grays for background and text.
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
]

/*
notes on ANSI video escape seqs:

they are always Esc[Value;...;Valuem


*/
var colors = {};
var bgs = {};

var colorIndexes = [];

RGBs.forEach(function(rgbPair,index){
  var color = index + 30;
  var bg = index + 40;

  colors[color] = rgbPair[0];
  bgs[bg] = rgbPair[0];

  var colorBright = index+ 90;
  var bgBright = index + 100;

  colors[colorBright] = rgbPair[1];
  bgs[bgBright] = rgbPair[1];

});

function rgbDistance(rgb,rgb2){
  return Math.sqrt( Math.pow(rgb[0]-rgb2[0],2) + Math.pow(rgb[1]-rgb2[1],2) + Math.pow(rgb[2]-rgb2[2],2) );
}

//find closest bg color
function findBg(rgb){
  var closest = '';
  var closestDist = 100000;

  objEach(bgs,function(color,ansi){
    var dist = rgbDistance(color,rgb);
    if (dist < 5){// executive decision: within a distance of 5 units is basically spot-on
      closest = ansi;
      return false;// break early
    }
    if (dist < closestDist){
      closestDist = dist;
      closest = ansi
    }
  });

  return closest;
}

//find closest fg color
function findColor(rgb){
  var closest = '';
  var closestDist = 100000;

  objEach(colors,function(color,ansi){
    var dist = rgbDistance(color,rgb);
    if (dist < closestDist){
      closestDist = dist;
      closest = ansi
    }
  });

  return closest;
}

function findColorRgb(rgb){
  return `38;2;${rgb[0]};${rgb[1]};${rgb[2]}`;
}
function findBgRgb(rgb){
  return `48;2;${rgb[0]};${rgb[1]};${rgb[2]}`
}

// RGB escapes!
// see https://superuser.com/questions/270214/how-can-i-change-the-colors-of-my-xterm-using-ansi-escape-sequences
function rgbToRgbCodes(top,bottom,options){

  var topColor = findColorRgb(top);
  var bottomBg = findBgRgb(bottom);
  var doReset = (typeof options.reset == 'boolean')?options.reset:true;

  //same color top and bottom... save some space
  if (top[0] == bottom[0] && top[1] == bottom[1] && top[2] == bottom[2]){
    if (topColor == 30 ){//if it's black
      return esc + '[40m '+(doReset?reset:'');// black BG, then a space, then reset
    }
    return esc + '[' + topColor + 'm'+fullChar + (doReset?reset:'');
  }
  else{
    //use topChar usually


    //if top = black, or bottom = white, use bottomChar and invert
    if (topColor == 30 || bottomBg == 107){
      var bottomColor = findColorRgb(bottom);
      var topBg = findBgRgb(top);

      return esc + '[' + bottomColor + ';' + topBg + 'm' + bottomChar + (doReset?reset:'');
    }


    return esc + '[' + topColor + ';' + bottomBg + 'm' + topChar + (doReset?reset:'');
  }
}

function objEach(o,func){
  var result;
  for (var property in o) {
    if (o.hasOwnProperty(property)) {
      // do stuff
      result = func(o[property],property);
      if (result == false){
        break;
      }
    }
  }
}

// other exports
module.exports.reset = reset;

/*
image is an object with a 'width' key for the pixel width and a 'data' key with rgba data
options are {
  format:"rgb" or 'ansi',
  reset:true('all'),false,'line', or 'end'
}
returns the string to print
*/
module.exports.convertImage = function convertImage(image,options){
  var ret = ''
  var options = options || {};
  var format = options.format || '';
  var doReset = (typeof options.reset == 'undefined')?true:options.reset;

  var dat = image.data;

  var i = 0;
  while (i < dat.length){

   // each row

   //it's RGBA
   var top = [dat[i],dat[i+1],dat[i+2]];
   var bottom;

   if (i + image.width*4+2 < dat.length - 1){
     bottom = [dat[i + image.width*4 ],dat[i + image.width*4+1],dat[i + image.width*4+2]];
   }else{
     bottom = [0,0,0];
   }

   ret += rgbToCodes(top,bottom,{
     reset:(doReset === true || doReset == 'all'),
     format:format
   });

   i = i + 4;
   if ( (i/4) % image.width == 0 ){
     ret += '\n';
     if (doReset == 'line'){
       ret += reset;
     }
     i = i + image.width*4;//skip line
   }
  }

  if (doReset == 'end'){
    ret += reset;
  }

  return ret;
}
