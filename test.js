//test rgb to codes

var rgbPairToChar = require('./index.js');
var _ = require('lodash');

var red = [150,0,0]
var blu = [0,0,150]
var ltred = [255,0,0]
var ltblu = [85,91,253]

//process.stdout.write(rgbPairToChar(top,bottom));  

var print = [
  [red,red],
  [blu,blu],
  [blu,red],
  [red,blu],
    
  [ltred,ltred],
  [ltblu,ltblu],
  [ltred,ltblu],
  [ltblu,ltred],
    
  [red,ltred],
  [blu,blu],
  [blu,ltred],
  [ltred,blu],
    
  [ltred,red],
  [ltblu,ltblu],
  [red,ltblu],
  [ltblu,red]
]


process.stdout.write('\r\n Check out these pairs.  Compare to test.js to ensure they match up:\r\n');
print.forEach(function(c){
  process.stdout.write( rgbPairToChar(c[0],c[1]) );
})

function randColor(){
  return [Math.random()*255,Math.random()*255,Math.random()*255]
}

process.stdout.write('\r\n Now testing solids:');

for (var i = 0; i < 30; i ++){  
  var col = randColor();
  process.stdout.write('\r\n' + _.repeat(rgbPairToChar(col,col),10) );
}