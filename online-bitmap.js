class BitInformation{
    constructor(){
        this.failingBit  = -1;
        this.logAddress  = -1;
        this.bitAddress  = -1;
        this.logCol      = -1;
        this.logRow      = -1;
        this.logSec      = -1;
        this.logSeg      = -1;
        this.logWord     = -1;
        this.phycol      = -1;
        this.phyRow      = -1;
    }
}

// Create empty array for bitmap data.
var bitmapData = new Array();

// Initialize array with BitInfo objects for each physical capacitor.
for( var i = 0; i < 4194304; i++ ){

    bitmapData.push( new BitInformation() );
    
}

var devicePhyWidth  = 1024; // 1024
var devicePhyHeight = 4096; // 4096

// Create image data object used for bitmap display.
var canvas       = document.getElementById( 'Bitmap' );
var context      = canvas.getContext( '2d' );
var canvasWidth  = Math.ceil( window.innerWidth * .8 );
var canvasHeight = Math.ceil( window.innerHeight * .8 );
canvas.width     = canvasWidth;
canvas.height    = canvasHeight;

// Disable image smoothing.
context.imageSmoothingEnabled       = false;
//context.webkitImageSmoothingEnabled = false;
//context.msImageSmoothingEnabled     = false;

var imageData     = context.createImageData( devicePhyWidth, devicePhyHeight ); // The new object is filled with transparent black pixels.
var numberOfBytes = imageData.data.length;
var bytesPerPixel = 4; // Always four bytes per pixel.

// Fill bitmap with default checkerboard background.
var pixelCounter = 0;
for( var i = 0; i < numberOfBytes; i += bytesPerPixel ){

    var pixelRow = Math.floor( pixelCounter / devicePhyWidth );

    if( pixelCounter & 0x1 && pixelRow & 0x1 ){

        imageData.data[i]     = 0xCC; // Red
        imageData.data[i + 1] = 0xCC; // Green
        imageData.data[i + 2] = 0xCC; // Blue
        imageData.data[i + 3] = 0xFF; // Alpha

    }else if( ( pixelCounter & 0x1 ) == 0 && ( pixelRow & 0x1 ) === 0 ){
    
        imageData.data[i]     = 0xCC; // Red
        imageData.data[i + 1] = 0xCC; // Green
        imageData.data[i + 2] = 0xCC; // Blue
        imageData.data[i + 3] = 0xFF; // Alpha

    }else{

        imageData.data[i]     = 0xEE; // Red
        imageData.data[i + 1] = 0xEE; // Green
        imageData.data[i + 2] = 0xEE; // Blue
        imageData.data[i + 3] = 0xFF; // Alpha

    }

    pixelCounter++;
}

var imageXPos = 0; // 0 = left;
var imageYPos = 0; // 0 = top;

// Paint canvas image data.
context.putImageData( imageData, imageXPos, imageYPos );
// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
// img 	    Specifies the image, canvas, or video element to use
// sx 	    Optional. The x coordinate where to start clipping
// sy 	    Optional. The y coordinate where to start clipping
// swidth 	Optional. The width of the clipped image
// sheight 	Optional. The height of the clipped image
// x        The x coordinate where to place the image on the canvas
// y 	    The y coordinate where to place the image on the canvas
// width 	Optional. The width of the image to use (stretch or reduce the image)
// height 	Optional. The height of the image to use (stretch or reduce the image)

// Take image drawn on canvas and resize.
var xPixelsToDisplay = 10;
var yPixelsToDisplay = 10;
context.drawImage( canvas, 0, 0, xPixelsToDisplay, yPixelsToDisplay, 0, 0, canvasHeight, canvasHeight );
//context.putImageData( imageData, imageXPos, imageYPos, 0, 0, devicePhyWidth * 1000, devicePhyHeight * 1000 );

// Add canvas data to save button.
var saveLink      = document.getElementById( 'SaveLink' );
saveLink.href     = canvas.toDataURL( 'image/png' );
saveLink.download = "bitmap.png";
console.log( "Done with initial bitmap setup." );

// Setup pixel information gathering.
canvas.onmousemove = function( event ){

    // Store raw mouse x and y location.
    var xLocation = event.layerX;
    var yLocation = event.layerY;

    // Subtract canvas left and top offset from mouse position to get true bitmap mouse position.
    xLocation -= document.getElementById('Bitmap').offsetLeft;
    yLocation -= document.getElementById('Bitmap').offsetTop;

    var bitX = Math.floor( yLocation / ( canvasHeight / xPixelsToDisplay ) );
    var bitY = Math.floor( xLocation / ( canvasHeight / yPixelsToDisplay ) );

    document.getElementById( 'PhyRow' ).value = bitX;
    document.getElementById( 'PhyCol' ).value = bitY;
    
};