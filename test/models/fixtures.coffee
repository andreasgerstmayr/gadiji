Images = require 'models/images'
Image = require 'models/image'

window.fixtures =
  image: ->
    Image.idx = 0
    image = new Image {"file": "sun.jpg",  "pub_date": 1252617373000, "tags": ["Sun", "Sky"]}, {parse: true}
    
  images: ->
    Image.idx = 0
    
    img1 = new Image {"file": "moon.jpg", "pub_date": 1252617372000, "tags": []}, {parse: true}
    img2 = new Image {"file": "sun1.jpg",  "pub_date": 1252617373000, "tags": ["Sun", "Sky"]}, {parse: true}
    img3 = new Image {"file": "sun2.jpg",  "pub_date": 1252617373000, "tags": ["Sun"]}, {parse: true}
    img4 = new Image {"file": "car.jpg",  "pub_date": 1252617373000, "tags": ["Car 1 2-3"]}, {parse: true}
    
    images = new Images
    images.reset [img1, img2, img3, img4]
    
    images
