glose-js
========

Loïc Sander – www.akalollip.com – v1.0 – november 2013


Glose.js is a simple jQuery plugin meant to facilitate/promote the usage of sidenotes – common in print design – on the web.

Put simply, it elevates a targeted element to the position of its anchor in the web page.
To achieve this, Glose works with one/two side container/s (defined by a $mode parameter, see below for details)
the target elements are moved to the side container/s and then pushed until they face their anchor, if possible.

By default, Glose creates the side container/s based on a main container you indicate as the parameter $mainContainer.
You can have the side containers already set in the DOM tree and ask only that the target elements
be lifted up to their anchor: if the parameter $move is ‘false’, Gloze skips the moving-to-side-container part.


To use Glose, simply add & import Glose.js like any javascript file (don’t forget to have jQuery imported as well), and call .glose() on your anchor elements:

```javascript
$("a.anchor").glose(mainContainer, mode, moveOnly);
```


**Parameters**
```
– mainContainer: the element containing your main content/text
– mode: either 12, 1 or 2: 
  		12: a side column on both sides (1 & 2) of the main col
  		1: one side column to the left of the main col
  		2: one side column to the right of the main col
– moveOnly: optional boolean, add ‘true’ if you want Glose to skip the side column creation and element moving
```


* Here’s an example of the plugin at work: http://www.akalollip.com/experiment/glose/


**Disclaimer**

I’m quite new at Javascript/jQuery and I made this plugin for my own purposes, so take it as it comes, I haven’t tested it extensively yet.
There are certainly things that can be improved in terms of functionality, code clarity/quality and performance. Any suggestion/intervention will be very welcome.
