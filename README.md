# Gadiji
Gadiji is a simple image gallery.
Works on all webservers, no configuration needed (only static files).

## Features
* list all images
* filter images by tags
* show detail page of image with tags

## Installation
* Upload the contents of the ```public/``` directory to your webserver
* Store your images inside the ```images/raw```, ```images/medium``` and ```images/small``` folders (same filename, different resolution)
* Create a [images.json](#imagesjson-structure) file in the root directory with the images metadata
* That's it. No server configuration needed.

## images.json structure
example:
```
[
   {"file": "moon.jpg", "pub_date": 1252617372000, "tags": []},
   {"file": "sun.jpg",  "pub_date": 1252617373000, "tags": ["Sun", "Sky"]}
]
```

## Technology Stack
* [CoffeeScript](http://coffeescript.org)
* [Brunch](http://brunch.io)
* [Chaplin](https://github.com/chaplinjs/chaplin)
* [Backbone.js](http://documentcloud.github.com/backbone)
* [Underscore.js](http://documentcloud.github.com/underscore)
* [Handlebars.js](http://handlebarsjs.com)
* [jQuery](http://jquery.com)
* [Stylus](http://learnboost.github.com/stylus)
