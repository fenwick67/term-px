//decode image and print it to term

var bmp = require('bmp-js');
var fs = require('fs');
var rgbPairToChar = require('./index.js');
var ansiEscapes = require('ansi-escapes');
var cache = {};


setInterval(alternate,1000)
alternate();
var i = 0;
function alternate(){
  i++;
  if (i%2){
    return printImage('test.bmp');
  }
  printImage('test2.bmp');  
}


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
  
  
 
  var dat = bmpData.data;

  process.stdout.write(ansiEscapes.cursorUp(bmpData.height / 2));

  var i = 0;
  while (i < dat.length){
    
    // each row
    
    //it's RGBA
    var top = [dat[i],dat[i+1],dat[i+2]];
    var bottom = [dat[i + bmpData.width*4 ],dat[i + bmpData.width*4+1],dat[i + bmpData.width*4+2]];
    
    process.stdout.write(rgbPairToChar(top,bottom));
    
    i = i + 4;
    if (i % bmpData.width == 0 ){
      process.stdout.write('\n');
      i = i + bmpData.width*4;//skip
    }
  } 
  
}

