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
  
  
    
  if (top[0] == bottom[0] && top[1] == bottom[1] && top[2] == bottom[2]){
    if (findColor(top) == '30' ){//if it's black
      return esc + '[0m ';// black bg plus space
    }  
    return esc + '[' + topColor + 'm'+fullChar;
  }
  else{
    //use topChar every time
    //console.log( '[' + findColor(top) + ';' + findBg(bottom) + 'm' + topChar);
    

    return esc + '[' + topColor + ';' + bottomBg + 'm' + topChar + esc + '[0m';
  }  
}

//colros and bgs all have keys that are strings like '30;1' and '30'
// to get a esc seq from them, join with a ; and add '<esc>[' to the beginning and 'm' to the end

//for reference only
var styles = ['black','red','green','yellow','blue','magenta','cyan','white'];

var RGBs =
[
  [[000,000,000],[085,085,085]],//blacks
  [[205,000,000],[255,000,000]],//reds
  [[000,205,000],[000,255,000]],//greens
  [[205,205,000],[255,255,000]],//yellows
  [[000,000,205],[000,000,255]],//blues
  [[205,000,205],[255,000,255]],//magentas
  [[000,205,205],[000,255,255]],//cyans
  [[205,205,205],[255,255,255]]//whites
]




/*
notes on ANSI video escape seqs:

they are always Esc[Value;...;Valuem


*/
var colors = {};
var bgs = {};

var colorIndexes = [];

RGBs.forEach(function(rgbPair,index){
  var color = (index + 30) + '';
  var bg = (index + 40) + '';
  
  colors[color] = rgbPair[0];
  bgs[bg] = rgbPair[0];
  
  var colorBright = color + ';1';
  var bgBright = bg + ';5';// blink is bright right?
  
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