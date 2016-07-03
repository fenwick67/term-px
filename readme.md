# term-px

Write pixels to the terminal using only ANSI characters.

![Demo](http://i.imgur.com/iwlN1Ru.gif)

## WHAT??!?!

I'm kinda cheating.  Using special characters (namely ▀ █ and ▄) we're able to write an approximation of actual pixels to the terminal.

This library ony exposes one function, which creates the pairs of "pixels" based on two rgb values.

```
var termPx = require('term-px');

var pixels = termPx([0,0,0],[255,255,255])

  => <a pixel with black on top and white on bottom>
```

The gif above is available in img-test.js