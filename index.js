var _ = require('lodash');

// decode an image into an approximate terminal output

var topChar = String.fromCharCode(9600);
var bottomChar = String.fromCharCode(9604);
var fullChar = String.fromCharCode(9608);
// look into  ▒ and ░

var esc = String.fromCharCode(27);
var reset = esc + '[0m';

// take rgb top and bottom pixels and convert to an terminal character
module.exports = function rgbToCodes(top,bottom){
  
  var topColor = findColor(top);
  var bottomBg = findBg(bottom)
    
    
  //same color top and bottom... save some space
  if (top[0] == bottom[0] && top[1] == bottom[1] && top[2] == bottom[2]){
    if (topColor == '30' ){//if it's black
      return esc + '[0m ';// black bg plus space
    }  
    return esc + '[' + topColor + 'm'+fullChar + reset;
  }
  else{
    //use topChar usually
    
    
    //if top = black, or bottom = white, use bottomChar and invert
    if (topColor == '30' || bottomBg == '47;5'){
      var bottomColor = findColor(bottom);
      var topBg = findBg(top);
      
      return esc + '[' + bottomColor + ';' + topBg + 'm' + bottomChar + reset;      
    }
    

    return esc + '[' + topColor + ';' + bottomBg + 'm' + topChar + reset;
  }  
}

//colros and bgs all have keys that are strings like '30;1' and '30'
// to get a esc seq from them, join with a ; and add '<esc>[' to the beginning and 'm' to the end

//for reference only
var styles = ['black','red','green','yellow','blue','magenta','cyan','white'];

// TODO: some terminals have different color grays for background and text.
var RGBs =
[//    dark         bright
  [[  0,  0,  0],[ 58, 58, 58]],// black
  [[178,  0,  0],[247, 48, 58]],// red
  [[ 50,184, 26],[ 89,255, 68]],// green
  [[185,183, 26],[255,253,067]],// yellow
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
  
  _.each(bgs,function(color,ansi){
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
  
  _.each(colors,function(color,ansi){
    var dist = rgbDistance(color,rgb);
    if (dist < closestDist){
      closestDist = dist;
      closest = ansi
    }
  });  
  
  return closest;
}