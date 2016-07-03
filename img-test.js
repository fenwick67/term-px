//decode image and print it to term

var bmp = require('bmp-js');
var fs = require('fs');
var rgbPairToChar = require('./index.js');

var bmpBuffer = fs.readFileSync('test.bmp');
var bmpData = bmp.decode(bmpBuffer);
var dat = bmpData.data;

console.log(dat.length);
console.log(dat);

var i = 0;
while (i < dat.length){
  
  // each row
  
  //it's ARGB
  var top = [dat[i],dat[i+1],dat[i+2]];
 // console.log(top);
 // console.log(bottom);
  var bottom = [dat[i + bmpData.width*4 ],dat[i + bmpData.width*4+1],dat[i + bmpData.width*4+2]];
  
  process.stdout.write(rgbPairToChar(top,bottom));
  
  i = i + 4;
  if (i % bmpData.width == 0 ){
    process.stdout.write('\n');
    i = i + bmpData.width*4;//skip
  }
}
