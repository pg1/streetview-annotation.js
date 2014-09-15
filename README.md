# **streetview-annotation.js**

### JavaScript annotation for Google Street View maps v3.


This javascript library was written to create annotation for the latest Google Street View. Inspired by Mapsicle.

[Demo](http://pg1.github.io/streetview-annotation.js/)

## Example


```js
	//create a new instance
	var st = new STVIEWANNOTATION();

	//set node id
	st.stElementId = 'stview';

	//add data 
	st.markers = [
	    {
	     html:'<span class="anno">Hungarian Parlament</span>', 
	     panoid:"ItriXeg_d6Xu1oyPYxaqBg", 
	     heading:-95, 
	     pitch:10
	    }
	];

	//load view
	st.loadStreetview(47.507165, 19.047865);
```

## Dependencies

- [Google Maps API v3](https://developers.google.com/maps/documentation/javascript/reference)

 
## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Copyright (c) 2013 Peter Gyorffy
