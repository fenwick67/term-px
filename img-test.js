//decode image and print it to term

var bmp = require('bmp-js');
var fs = require('fs');
var rgbPairToChar = require('./index.js');
var ansiEscapes = require('ansi-escapes');
var cache = {};


setInterval(alternate,1000)

var i = 1;
function alternate(){
  
  i++;
  if (i%2==0){
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
  
  
 //console.log(bmpData.width)
  var dat = bmpData.data;

  process.stdout.write(ansiEscapes.cursorUp(1+ bmpData.height / 2));

  var i = 0;
  while (i < dat.length){
    
    // each row
    
    //it's RGBA
    var top = [dat[i],dat[i+1],dat[i+2]];
    var bottom = [dat[i + bmpData.width*4 ],dat[i + bmpData.width*4+1],dat[i + bmpData.width*4+2]];
    
    process.stdout.write(rgbPairToChar(top,bottom));
    
    i = i + 4;
    if ( (i/4) % bmpData.width == 0 ){
      process.stdout.write('\n');
      i = i + bmpData.width*4;//skip line
    }
  } 
  
}

//printing starts here

alternate();

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
});

process.stdout.write('\n');

colorMatx.forEach(function(row){
  process.stdout.write(rgbPairToChar(row[1],row[0]));
});

