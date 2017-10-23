# term-px

Write pixels to the terminal using ANSI colors and half-characters.

![Demo](http://i.imgur.com/iwlN1Ru.gif)

## WHAT?

I'm kinda cheating.  Using special characters (namely ▀ █ and ▄) we're able to write an approximation of actual pixels to the terminal.

## Examples:

```javascript
var termPx = require('term-px');

/*

default usage

*/

var pixels = termPx([0,0,0],[255,255,255])
  => '\u001b[97;40m▄\u001b[0m'
  => <black on top and white on bottom>

// provide an options object with "format" set to "rgb" for use in full color terminals
var rgbPixels = termPx([0x9A,0x00,0xC4],[0xBB,0x00,0xC4],{format:"rgb"});
//  => "\u001b[38;2;154;0;196;48;2;187;0;196m▀\u001b[0m"
//  <two slightly different purples>

// set "reset" to false to not reset the color at the end.
var unClosedRgbPixels = termPx([0x9A,0x00,0xC4],[0xBB,0x00,0xC4],{format:"rgb",reset:false});
//  => "\u001b[38;2;154;0;196;48;2;187;0;196m▀"

/*

Printing images:

*/

// Image data must be in RGBA 0-255 format, and have data and width keys.
var bmp = require("bmp-js");
var bmpBuffer = fs.readFileSync('aa.bmp');
var bmpData = bmp.decode(bmpBuffer); // {data:[255,0,255,255,...],width:10,height:20}

var logo = termPx.convertImage(bmpData,{format:"rgb"});
// => '\u001b[95;40m▀\u001b[0m\u001b[91;40m▀\u001b[0m...'

process.stdout.write(logo)
// logo is shown

```

The gif above is available in img-test.js
