//decode image and print it to term

var bmp = require('bmp-js');
var fs = require('fs');
var rgbPairToChar = require('./index.js');
var cache = {};


/* console.log(dat.length);
console.log(dat); */

function printImage(filename){
  var bmpData;
  if (cache[filename]){
    bmpData = cache[filename]
  }else{
    var bmpBuffer = fs.readFileSync(filename);
    var bmpData = bmp.decode(bmpBuffer);
    cache[filename] = bmpData;
  }

  var img = rgbPairToChar.convertImage(bmpData,{format:'rgb',reset:'line'});
  process.stdout.write(img);

}

printImage('testrb.bmp');
printImage('parrot.bmp');
