//decode image and print it to term

var bmp = require('bmp-js');
var fs = require('fs');
var rgbPairToChar = require('./index.js');
var ansiEscapes = require('ansi-escapes');
var cache = {};

for (var i = 0; i < 25; i ++){
  process.stdout.write('\r\n');
}

setInterval(alternate,100)

var i = 1;
function alternate(){

  i++;
  if (i%2==0){
     printImage('test.bmp');
     return;
  }
  printImage('test2.bmp');
  return;
}


function printImage(filename){
  var bmpData;
  if (cache[filename]){
    bmpData = cache[filename]
  }else{
    var bmpBuffer = fs.readFileSync(filename);
    var bmpData = bmp.decode(bmpBuffer);
    cache[filename] = bmpData;
  }

  process.stdout.write(ansiEscapes.cursorUp( bmpData.height / 2));

  var img = rgbPairToChar.convertImage(bmpData,{reset:'line'});
  process.stdout.write(img);

}

//printing starts here

var colorMatx =
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


colorMatx.forEach(function(row){
  process.stdout.write(rgbPairToChar(row[0],row[1]));
  process.stdout.write(rgbPairToChar.reset);
});

process.stdout.write('\r\n');

colorMatx.forEach(function(row){
  process.stdout.write(rgbPairToChar(row[1],row[0]));
});

process.stdout.write(ansiEscapes.cursorUp(2));

alternate();
