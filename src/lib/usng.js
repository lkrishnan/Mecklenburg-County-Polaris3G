// ***************************************************************************
// *  usng.js  (U.S. National Grid functions)
// *  Module to calculate National Grid Coordinates
// *
// *  Copyright  2007  Larry Moore
// *  larmoor@gmail.com
// ****************************************************************************/
//
//   This program is free software; you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation; either version 2 of the License, or
//   (at your option) any later version.
// 
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
// 
//   The GNU General Public License can be found at http://www.gnu.org
//   Or write to the Free Software Foundation, Inc., 
//   59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
//
//
//*****************************************************************************
//
//    References and history of this code:
//
//    For detailed info on the U.S. National Grid coordinate system, see 
//    http://www.fgdc.gov/usng
//
//    Reference ellipsoids derived from Peter H. Dana's website- 
//    http://www.utexas.edu/depts/grg/gcraft/notes/datum/elist.html
//    Department of Geography, University of Texas at Austin
//    Internet: pdana@mail.utexas.edu   
//
//    Technical reference:
//    Defense Mapping Agency. 1987b. DMA Technical Report: Supplement to 
//    Department of Defense World Geodetic System 1984 Technical Report. Part I
//    and II. Washington, DC: Defense Mapping Agency
//
//    Based on C code written by Chuck Gantz for UTM calculations
//    http://www.gpsy.com/gpsinfo/geotoutm/     -- chuck.gantz@globalstar.com
// 
//    Initially converted fro C to JavaScript by Grant Wong for use in the 
//    USGS National Map Project in August 2002
//
//    Modifications and developments continued by Doug Tallman from Dec. 19, 2002
//       for the USGS National Map viewer
//
//    Adopted with modifications by Larry Moore, January 2007, 
//       for GoogleMaps application;  
//       http://www.fidnet.com/~jlmoore/usng
//       larmoor@gmail.com
//
//    Assumes a datum of NAD83 (or its international equivalent WGS84). 
//    If NAD27 is used, set IS_NAD83_DATUM to 'false'. 
//    NAD83 and WGS84 are equivalent for all practical purposes.
//    (NAD27 computations are irrelevant to Google Maps applications)
//  
//
//*************************************************************************
// programmer interface summary
//
// 1) convert lat/lng decimal degrees to a USNG string
// function LLtoUSNG(lat, lon, precision)
//    inputs are in decimal degrees, west longitude negative, south latitude negative
//    'precision' specifies the number of digits in output coordinates
//         e.g. 5 specifies 1-meter precision (see USNG standard for explanation)
//         One digit:    10 km precision      eg. "18S UJ 2 1"
//         Two digits:   1 km precision       eg. "18S UJ 23 06"
//         Three digits: 100 meters precision eg. "18S UJ 234 064"
//         Four digits:  10 meters precision  eg. "18S UJ 2348 0647"
//         Five digits:  1 meter precision    eg. "18S UJ 23480 06470"
//    return value is a USNG coordinate as a text string
//    the return value contains spaces to improve readability, as permitted by the USNG standard
//        the form is NNC CC NNNNN NNNNN
//        if a different format or precision is desired, the calling application must make the changes 
//
// 2) convert a USNG string to lat/lng decimal degrees
// function USNGtoLL(usng_string,latlng)
//    the following formats of the input string are supported:
//        NNCCCNNNNNNNNNN
//        NNC CC NNNNNNNNNN
//        NNC CC NNNNN NNNNN
//        all precisions of the easting and northing coordinate values are also supported
//             e.g. NNC CC NNN NNN
//    output is a 2-element array latlng declared by the calling routine
//        for example, calling routine contains the line var latlng=[]
//        latlng[0] contains latitude, latlng[1] contains longitude
//           both in decimal degrees, south negative, west negative
//
// 3) convert lat/lng decimal degrees to MGRS string (same as USNG string, but with no space delimeters)
// function LLtoMGRS(lat, lon, precision)
//   create a string of Military Grid Reference System coordinates
//   Same as LLtoUSNG, except that output cannot contain space delimiters;
//
// 4) wrapper for USNGtoLL to return an instance of GLatLng 
// function GUsngtoLL(usngstr)
//   input is a USNG or MGRS string
//   return value is an instance of GLatLng
//   use this only with Google Maps applications; USNGtoLL is more generic
//
// for most purposes, these four function calls are the only things an application programmer
// needs to know to use this module

//*****************************************************************************

var ngFunctionsPresent = true;
var UNDEFINED_STR = "undefined";
var UTMEasting;
var UTMNorthing;
var zoneNumber;


/********************************* Constants ********************************/

var FOURTHPI    = Math.PI / 4;
var DEG_2_RAD   = Math.PI / 180;
var RAD_2_DEG   = 180.0 / Math.PI;
var BLOCK_SIZE  = 100000; // size of square identifier (within grid zone designation),
                      // (meters)

var IS_NAD83_DATUM = true;  // if false, assumes NAD27 datum

// For diagram of zone sets, please see the "United States National Grid" white paper.
var GRIDSQUARE_SET_COL_SIZE = 8;  // column width of grid square set  
var GRIDSQUARE_SET_ROW_SIZE = 20; // row height of grid square set

// UTM offsets
var EASTING_OFFSET  = 500000.0;   // (meters)
var NORTHING_OFFSET = 10000000.0; // (meters)

// scale factor of central meridian
var k0 = 0.9996;

var EQUATORIAL_RADIUS;
var ECCENTRICTY_SQUARED;
var ECC_PRIME_SQUARED;
var ECC_SQUARED;

// check for NAD83
if (IS_NAD83_DATUM) {
  EQUATORIAL_RADIUS    = 6378137.0; // GRS80 ellipsoid (meters)
  ECC_SQUARED = 0.006694380023; 
}
// else NAD27 datum is assumed
else {
  EQUATORIAL_RADIUS    = 6378206.4;  // Clarke 1866 ellipsoid (meters)
  ECC_SQUARED = 0.006768658;
}

var ECC_PRIME_SQUARED = ECC_SQUARED / (1 - ECC_SQUARED);

// variable used in inverse formulas (UTMtoLL function)
var E1 = (1 - Math.sqrt(1 - ECC_SQUARED)) / (1 + Math.sqrt(1 - ECC_SQUARED));

// Number of digits to display for x,y coords 
//  One digit:    10 km precision      eg. "18S UJ 2 1"
//  Two digits:   1 km precision       eg. "18S UJ 23 06"
//  Three digits: 100 meters precision eg. "18S UJ 234 064"
//  Four digits:  10 meters precision  eg. "18S UJ 2348 0647"
//  Five digits:  1 meter precision    eg. "18S UJ 23480 06470"

/************* retrieve zone number from latitude, longitude *************

    Zone number ranges from 1 - 60 over the range [-180 to +180]. Each
    range is 6 degrees wide. Special cases for points outside normal
    [-80 to +84] latitude zone.

*************************************************************************/

const getZoneNumber = function(lat, lon) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
    
        // sanity check on input
        ////////////////////////////////   /*
        if (lon > 360 || lon < -180 || lat > 90 || lat < -90) {
        alert('Bad input. lat: ' + lat + ' lon: ' + lon);
        }
        ////////////////////////////////  */
    
        // convert 0-360 to [-180 to 180] range
        var lonTemp = (lon + 180) - parseInt((lon + 180) / 360) * 360 - 180; 
        var zoneNumber = parseInt((lonTemp + 180) / 6) + 1;
    
        // Handle special case
        if ( lat >= 56.0 && lat < 64.0 && lonTemp >= 3.0 && lonTemp < 12.0 ) {
        zoneNumber = 32;
        }
    
        // Special zones for Svalbard
        if ( lat >= 72.0 && lat < 84.0 ) {
            if ( lonTemp >= 0.0  && lonTemp <  9.0 ) {
                zoneNumber = 31;
            } 
            else if ( lonTemp >= 9.0  && lonTemp < 21.0 ) {
                zoneNumber = 33;
            }
            else if ( lonTemp >= 21.0 && lonTemp < 33.0 ) {
                zoneNumber = 35;
            }
            else if ( lonTemp >= 33.0 && lonTemp < 42.0 ) {
                zoneNumber = 37;
            }
        }
        return zoneNumber;  
    }, // END getZoneNumber() function
  
  
  
  /***************** convert latitude, longitude to USNG  *******************
  
      Converts lat/long to UTM coords.  Equations from USGS Bulletin 1532 
      (or USGS Professional Paper 1395 "Map Projections - A Working Manual", 
      by John P. Snyder, U.S. Government Printing Office, 1987.)
   
      East Longitudes are positive, West longitudes are negative. 
      North latitudes are positive, South latitudes are negative
      lat and lon are in decimal degrees
  
  
  ***************************************************************************/
    LLtoUTM = function(lat,lon, utmcoords){
        // utmcoords is a 2-D array declared by the calling routine
    
        lat = parseFloat(lat);
        lon = parseFloat(lon);
    
    // Constrain reporting USNG coords to the latitude range [80S .. 84N]
    /////////////////
        if (lat > 84.0 || lat < -80.0){
            return(UNDEFINED_STR);
        }
    //////////////////////
    
        // sanity check on input - turned off when testing with Generic Viewer
    /////////////////////  /*
        if (lon > 360 || lon < -180 || lat > 90 || lat < -90) {
        alert('Bad input. lat: ' + lat + ' lon: ' + lon);
        }
    //////////////////////  */
    
        // Make sure the longitude is between -180.00 .. 179.99..
        // Convert values on 0-360 range to this range.
        var lonTemp = (lon + 180) - parseInt((lon + 180) / 360) * 360 - 180;
        var latRad = lat     * DEG_2_RAD;
        var lonRad = lonTemp * DEG_2_RAD;
    
        zoneNumber = getZoneNumber(lat, lon);
        var lonOrigin = (zoneNumber - 1) * 6 - 180 + 3;  // +3 puts origin in middle of zone
        var lonOriginRad = lonOrigin * DEG_2_RAD;
    
        // compute the UTM Zone from the latitude and longitude
        var UTMZone = zoneNumber + "" + UTMLetterDesignator(lat) + " ";
    
        var N = EQUATORIAL_RADIUS / Math.sqrt(1 - ECC_SQUARED * 
                                Math.sin(latRad) * Math.sin(latRad));
        var T = Math.tan(latRad) * Math.tan(latRad);
        var C = ECC_PRIME_SQUARED * Math.cos(latRad) * Math.cos(latRad);
        var A = Math.cos(latRad) * (lonRad - lonOriginRad);
    
        // Note that the term Mo drops out of the "M" equation, because phi 
        // (latitude crossing the central meridian, lambda0, at the origin of the
        //  x,y coordinates), is equal to zero for UTM.
        var M = EQUATORIAL_RADIUS * (( 1 - ECC_SQUARED / 4 - 3 * (ECC_SQUARED * ECC_SQUARED) / 64 - 5 * (ECC_SQUARED * ECC_SQUARED * ECC_SQUARED) / 256) * latRad - ( 3 * ECC_SQUARED / 8 + 3 * ECC_SQUARED * ECC_SQUARED / 32 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(2 * latRad) + (15 * ECC_SQUARED * ECC_SQUARED / 256 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(4 * latRad) - (35 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 3072) * Math.sin(6 * latRad));
    
        UTMEasting = ( k0 * N * ( A + ( 1 - T + C ) * ( A * A * A ) / 6 + ( 5 - 18 * T + T * T + 72 * C - 58 * ECC_PRIME_SQUARED ) * ( A * A * A * A * A ) / 120 ) + EASTING_OFFSET );
    
        UTMNorthing = ( k0 * ( M + N * Math.tan( latRad ) * ( ( A * A ) / 2 + ( 5 - T + 9 * C + 4 * C * C ) * ( A * A * A * A ) / 24 + ( 61 - 58 * T + T * T + 600 * C - 330 * ECC_PRIME_SQUARED ) * ( A * A * A * A * A * A ) / 720 ) ) );
    
        utmcoords[ 0 ] = UTMEasting;
        utmcoords[ 1 ] = UTMNorthing;
    
        return;
    },
  
  /***************** convert latitude, longitude to USNG  *******************
     Converts lat/lng to USNG coordinates.  Calls LLtoUTM first, then
     converts UTM coordinates to a USNG string.
  
      Returns string of the format: DDL LL DDDD DDDD (4-digit precision), eg:
        "18S UJ 2286 0705" locates Washington Monument in Washington, D.C.
        to a 10-meter precision.
  
  ***************************************************************************/
  
   LLtoUSNG = function(lat, lon, precision){
        var UTMZone, USNG, USNGLetters, USNGNorthing, USNGEasting;
  
        lat = parseFloat(lat);
        lon = parseFloat(lon);
    
        // convert lat/lon to UTM coordinates
        var coords = new Array(2);
        LLtoUTM(lat, lon, coords);
    
        // ...then convert UTM to USNG
    
        if (lat < 0) {
        // Use offset for southern hemisphere
        UTMNorthing += NORTHING_OFFSET; 
        }
    
        USNGLetters  = findGridLetters(zoneNumber, UTMNorthing, UTMEasting);
        USNGNorthing = Math.round(UTMNorthing) % BLOCK_SIZE;
        USNGEasting  = Math.round(UTMEasting)  % BLOCK_SIZE;
    
        // added... truncate digits to achieve specified precision
        USNGNorthing = Math.floor(USNGNorthing / Math.pow(10,(5-precision)));
        USNGEasting = Math.floor(USNGEasting / Math.pow(10,(5-precision)));
        USNG = UTMZone + USNGLetters + " ";
    
        // REVISIT: Modify to incorporate dynamic precision ?
        for (i = String(USNGEasting).length; i < precision; i++) {
        USNG += "0";
        }
    
        USNG += USNGEasting + " ";
    
        for ( var i = String(USNGNorthing).length; i < precision; i++) {
        USNG += "0";
        }
    
        USNG += USNGNorthing;
    
        return (USNG);
  
    },   // END LLtoUSNG() function
  
  
  /************** retrieve grid zone designator letter **********************
  
      This routine determines the correct UTM letter designator for the given 
      latitude returns 'Z' if latitude is outside the UTM limits of 84N to 80S
  
      Returns letter designator for a given latitude. 
      Letters range from C (-80 lat) to X (+84 lat), with each zone spanning
      8 degrees of latitude.
  
  ***************************************************************************/
  
    UTMLetterDesignator = function(lat){
        lat = parseFloat(lat);

        var letterDesignator;
  
        if ((84 >= lat) && (lat >= 72)) 
        letterDesignator = 'X';
        else if ((72 > lat) && (lat >= 64)) 
        letterDesignator = 'W';
        else if ((64 > lat) && (lat >= 56)) 
        letterDesignator = 'V';
        else if ((56 > lat) && (lat >= 48)) 
        letterDesignator = 'U';
        else if ((48 > lat) && (lat >= 40)) 
        letterDesignator = 'T';
        else if ((40 > lat) && (lat >= 32)) 
        letterDesignator = 'S';
        else if ((32 > lat) && (lat >= 24)) 
        letterDesignator = 'R';
        else if ((24 > lat) && (lat >= 16)) 
        letterDesignator = 'Q';
        else if ((16 > lat) && (lat >= 8)) 
        letterDesignator = 'P';
        else if (( 8 > lat) && (lat >= 0)) 
        letterDesignator = 'N';
        else if (( 0 > lat) && (lat >= -8))
        letterDesignator = 'M';
        else if ((-8> lat) && (lat >= -16)) 
        letterDesignator = 'L';
        else if ((-16 > lat) && (lat >= -24)) 
        letterDesignator = 'K';
        else if ((-24 > lat) && (lat >= -32)) 
        letterDesignator = 'J';
        else if ((-32 > lat) && (lat >= -40)) 
        letterDesignator = 'H';
        else if ((-40 > lat) && (lat >= -48)) 
        letterDesignator = 'G';
        else if ((-48 > lat) && (lat >= -56)) 
        letterDesignator = 'F';
        else if ((-56 > lat) && (lat >= -64)) 
        letterDesignator = 'E';
        else if ((-64 > lat) && (lat >= -72)) 
        letterDesignator = 'D';
        else if ((-72 > lat) && (lat >= -80)) 
        letterDesignator = 'C';
        else 
        letterDesignator = 'Z'; // This is here as an error flag to show 
                                // that the latitude is outside the UTM limits
        return letterDesignator;
    },
    // END UTMLetterDesignator() function
  
  
  /****************** Find the set for a given zone. ************************
  
      There are six unique sets, corresponding to individual grid numbers in 
      sets 1-6, 7-12, 13-18, etc. Set 1 is the same as sets 7, 13, ..; Set 2 
      is the same as sets 8, 14, ..
  
      See p. 10 of the "United States National Grid" white paper.
  
  ***************************************************************************/
  
    findSet = function(zoneNum){
  
        zoneNum = parseInt(zoneNum);
        zoneNum = zoneNum % 6; 
        switch (zoneNum) {
            case 0: 
                return 6; 
            case 1: 
                return 1; 
            case 2: 
                return 2; 
            case 3: 
                return 3; 
            case 4: 
                return 4; 
            case 5: 
                return 5; 
            default: 
                return -1; 
        }
    },    
  // END findSet() function
  
  
  /**************************************************************************  
    Retrieve the square identification for a given coordinate pair & zone  
    See "lettersHelper" function documentation for more details.
  
  ***************************************************************************/
  
    findGridLetters = function(zoneNum, northing, easting){
        var row, col, east_1m;

        zoneNum  = parseInt(zoneNum);
        northing = parseFloat(northing);
        easting  = parseFloat(easting);
        row = 1;
  
        // northing coordinate to single-meter precision
        var north_1m = Math.round(northing);
    
        // Get the row position for the square identifier that contains the point
        while (north_1m >= BLOCK_SIZE) {
        north_1m = north_1m - BLOCK_SIZE;
        row++;
        }
    
        // cycle repeats (wraps) after 20 rows
        row = row % GRIDSQUARE_SET_ROW_SIZE;
        col = 0;
    
        // easting coordinate to single-meter precision
        east_1m = Math.round(easting);
    
        // Get the column position for the square identifier that contains the point
        while (east_1m >= BLOCK_SIZE){
        east_1m = east_1m - BLOCK_SIZE;
        col++;
        }
  
        // cycle repeats (wraps) after 8 columns
        col = col % GRIDSQUARE_SET_COL_SIZE;

        
    
        return lettersHelper(findSet(zoneNum), row, col);
    
    },
  
  // END findGridLetters() function 
  
  /**************************************************************************  
      Retrieve the Square Identification (two-character letter code), for the
      given row, column and set identifier (set refers to the zone set: 
      zones 1-6 have a unique set of square identifiers; these identifiers are 
      repeated for zones 7-12, etc.) 
  
      See p. 10 of the "United States National Grid" white paper for a diagram
      of the zone sets.
  
  ***************************************************************************/
  
    lettersHelper = function(set, row, col){
        // handle case of last row
        if (row === 0) {
            row = GRIDSQUARE_SET_ROW_SIZE - 1;
        }	 
        else {
            row--;
        }
  
        // handle case of last column
        if (col === 0) {
            col = GRIDSQUARE_SET_COL_SIZE - 1;
        }
        else {
            col--;     
        }
  
        switch(set) {
            case 1:
                l1="ABCDEFGH";              // column ids
                l2="ABCDEFGHJKLMNPQRSTUV";  // row ids
                return l1.charAt(col) + l2.charAt(row);
            case 2:
                l1="JKLMNPQR";
                l2="FGHJKLMNPQRSTUVABCDE";
                return l1.charAt(col) + l2.charAt(row);
            case 3:
                l1="STUVWXYZ";
                l2="ABCDEFGHJKLMNPQRSTUV";
                return l1.charAt(col) + l2.charAt(row);
            case 4:
                l1="ABCDEFGH";
                l2="FGHJKLMNPQRSTUVABCDE";
                return l1.charAt(col) + l2.charAt(row);
            case 5:
                l1="JKLMNPQR";
                l2="ABCDEFGHJKLMNPQRSTUV";
                return l1.charAt(col) + l2.charAt(row);
            case 6:
                l1="STUVWXYZ";
                l2="FGHJKLMNPQRSTUVABCDE";
                return l1.charAt(col) + l2.charAt(row);
        }
    },
    // END lettersHelper() function
  
    /**************  convert UTM coords to decimal degrees *********************
     
        Equations from USGS Bulletin 1532 (or USGS Professional Paper 1395)
        East Longitudes are positive, West longitudes are negative. 
        North latitudes are positive, South latitudes are negative.
    
        Expected Input args:
            UTMNorthing   : northing-m (numeric), eg. 432001.8
            UTMEasting    : easting-m  (numeric), eg. 4000000.0
            UTMZoneNumber : 6-deg longitudinal zone (numeric), eg. 18
            UTMZoneLetter : 8-deg latitudinal zone (String), eg. "S"
    
        Returns space-delimited string with lat-lon coords, eg:
            "49.32567 -82.32242" (decimal degrees). 
    
    ***************************************************************************/
  
    UTMtoLL = function(UTMNorthing, UTMEasting, UTMZoneNumber,ret) {
  
        // remove 500,000 meter offset for longitude
        var xUTM = parseFloat(UTMEasting) - EASTING_OFFSET; 
        var yUTM = parseFloat(UTMNorthing);
        var zoneNumber = parseInt(UTMZoneNumber);
    
        // origin longitude for the zone (+3 puts origin in zone center) 
        var lonOrigin = (zoneNumber - 1) * 6 - 180 + 3; 
    
        // M is the "true distance along the central meridian from the Equator to phi
        // (latitude)
        var M = yUTM / k0;
        var mu = M / ( EQUATORIAL_RADIUS * (1 - ECC_SQUARED / 4 - 3 * ECC_SQUARED * 
                        ECC_SQUARED / 64 - 5 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 256 ));
    
        // phi1 is the "footprint latitude" or the latitude at the central meridian which
        // has the same y coordinate as that of the point (phi (lat), lambda (lon) ).
        var phi1Rad = mu + ( 3 * E1 / 2 - 27 * E1 * E1 * E1 / 32 ) * Math.sin( 2 * mu ) + ( 21 * E1 * E1 / 16 - 55 * E1 * E1 * E1 * E1 / 32 ) * Math.sin( 4 * mu ) + ( 151 * E1 * E1 * E1 / 96 ) * Math.sin( 6 * mu );
        var phi1 = phi1Rad * RAD_2_DEG;
    
        // Terms used in the conversion equationsl
        var N1 = EQUATORIAL_RADIUS / Math.sqrt( 1 - ECC_SQUARED * Math.sin(phi1Rad) * 
                    Math.sin(phi1Rad));
        var T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
        var C1 = ECC_PRIME_SQUARED * Math.cos(phi1Rad) * Math.cos(phi1Rad);
        var R1 = EQUATORIAL_RADIUS * (1 - ECC_SQUARED) / Math.pow(1 - ECC_SQUARED * 
                    Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
        var D = xUTM / (N1 * k0);
    
        // Calculate latitude, in decimal degrees
        var lat = phi1Rad - ( N1 * Math.tan( phi1Rad ) / R1 ) * ( D * D / 2 - ( 5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ECC_PRIME_SQUARED ) * D * D * D * D / 24 + ( 61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * ECC_PRIME_SQUARED - 3 * C1 * C1 ) * D * D * D * D * D * D / 720 );
        lat = lat * RAD_2_DEG;
    
        // Calculate longitude, in decimal degrees
        var lon = ( D - ( 1 + 2 * T1 + C1 ) * D * D * D / 6 + ( 5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ECC_PRIME_SQUARED + 24 * T1 * T1 ) * D * D * D * D * D / 120 ) / Math.cos( phi1Rad );
    
        lon = lonOrigin + lon * RAD_2_DEG;
        ret.lat = lat;
        ret.lon = lon;
        return;
    
    },
  
  // END UTMtoLL() function
  
  /********************** USNG to UTM **************************************
  
      The Follwing functions are used to convert USNG Cords to UTM Cords.
  
  ***************************************************************************/ 
  UTMGzdLetters="NPQRSTUVWX",
  USNGSqEast = "ABCDEFGHJKLMNPQRSTUVWXYZ",
  USNGSqLetOdd="ABCDEFGHJKLMNPQRSTUV",
  USNGSqLetEven="FGHJKLMNPQRSTUVABCDE",
  /*********************************************************************************** 
  
                     USNGtoUTM(zone,let,sq1,sq2,east,north,ret) 
  Expected Input args:
        zone: Zone (integer), eg. 18
        let: Zone letter, eg S
        sq1:  1st USNG square letter, eg U
        sq2:  2nd USNG square Letter, eg J 
        east:  Easting digit string, eg 4000
        north:  Northing digit string eg 4000
        ret:  saves zone,let,Easting and Northing as properties ret 
  
  ***********************************************************************************/ 
  
    USNGtoUTM = function(zone, letr, sq1, sq2, east, north, ret ) { 
        var zoneBase = [ 0, 0.8, 1.7, 2.6, 3.5, 4.4, 5.3, 6.2, 7.0, 7.9 ];//Starts of Northing zones in millons of meteres
        var segBase = [ 0, 0, 0, 2, 2, 4, 4, 6, 6, 6 ];  //Starts of 2 million meter segments, indexed by zone 
    
        // convert easting to UTM
        var eSqrs = USNGSqEast.indexOf( sq1 );          
        var appxEast = 1 + ( eSqrs % 8 ); 
        var nSqrs;
        // convert northing to UTM
        var letNorth = "NPQRSTUVWX".indexOf( letr );
        if( zone % 2 ){ //odd number zone
        nSqrs = "ABCDEFGHJKLMNPQRSTUV".indexOf( sq2 ); 
        }else{ // even number zone
        nSqrs = "FGHJKLMNPQRSTUVABCDE".indexOf( sq2 ); 
        }        
        
        var zoneStart = zoneBase[ letNorth ];
        var appxNorth = Number( segBase[ letNorth ] ) + ( nSqrs / 10 );
        if( appxNorth < zoneStart )
            appxNorth += 2; 	  
    
        ret.N=appxNorth*1000000+Number(north)*Math.pow(10,5-north.length);
        ret.E=appxEast*100000+Number(east)*Math.pow(10,5-east.length);
        ret.zone=zone;
        ret.letter=letr;
    
        return;
    
    }, 
    // parse a USNG string and feed results to USNGtoUTM, then the results of that to UTMtoLL
    USNGtoLL = function(usngStr_input,latlon){
        // latlon is a 2-element array declared by calling routine
        var usngp = { };
    
        parseUSNG_str(usngStr_input,usngp);
        var coords = { };
    
        // convert USNG coords to UTM; this routine counts digits and sets precision
        USNGtoUTM(usngp.zone,usngp.let,usngp.sq1,usngp.sq2,usngp.east,usngp.north,coords); 
    
        UTMtoLL(coords.N, coords.E, usngp.zone, coords);
        latlon[0] = coords.lat;
        latlon[1] = coords.lon;
  
    },
  
    // convert lower-case characters to upper case, remove space delimeters, separate string into parts
    parseUSNG_str = function( usngStr_input, parts ){
        var j = 0;
        var usngStr = [];
        var usngStr_temp = [];
  
        usngStr_temp = usngStr_input.toUpperCase();
  
        // put usgn string in 'standard' form with no space delimiters
        var regexp = /%20/g;
        usngStr = usngStr_temp.replace(regexp,"");
        regexp = / /g;
        usngStr = usngStr_temp.replace(regexp,"");
  
        if (usngStr.length < 7) {
            alert("This application requires minimum USNG precision of 10,000 meters");
            return 0;
        }
  
        // break usng string into its component pieces
        parts.zone = usngStr.charAt(j++)*10 + usngStr.charAt(j++)*1;
        parts.let = usngStr.charAt(j++);
        parts.sq1 = usngStr.charAt(j++);
        parts.sq2 = usngStr.charAt(j++);
  
        parts.precision = (usngStr.length-j) / 2;
        parts.east='';
        parts.north='';
  
        for( var k=0; k<parts.precision; k++ ){
            parts.east += usngStr.charAt(j++);
        }
  
        if (usngStr[j] == " "){ 
        j++; 
        }
     
        for( k = 0; k < parts.precision; k++ ){
            parts.north += usngStr.charAt( j++ );
        }
    
    },
  
    // checks a string to see if it is valid USNG;
    //    if so, returns the string in all upper case, no delimeters
    //    if not, returns 0
    isUSNG = function(inputStr){
        var j = 0;
        var k;
        var usngStr = [];
        var strregexp;
  
        // convert all letters to upper case
        usngStr = inputStr.toUpperCase();
    
        // get rid of space delimeters
        var regexp = /%20/g;
        usngStr = usngStr.replace(regexp,"");
        regexp = / /g;
        usngStr = usngStr.replace(regexp,"");
    
        if (usngStr.length > 15) {
            return 0;
        }
    
        strregexp = new RegExp("^[0-9]{2}[CDEFGHJKLMNPQRSTUVWX]$");
        if (usngStr.match(strregexp)) {
            alert("Input appears to be a UTM zone...more precision is required to display a correct result.");
            return 0;
        }
    
        strregexp = new RegExp("^[0-9]{2}[CDEFGHJKLMNPQRSTUVWX][ABCDEFGHJKLMNPQRSTUVWXYZ][ABCDEFGHJKLMNPQRSTUV]([0-9][0-9]){0,5}");
        if (!usngStr.match(strregexp)) {
            return 0;
        }
    
        if (usngStr.length < 7) {
            alert(usngStr+" Appears to be a USNG string, but this application requires precision of at least 10,000 meters");
            return 0;
        }
    
        // all tests passed...return the upper-case, non-delimited string
        return usngStr;
  
    },
  
  
    // create a Military Grid Reference System string.  this is the same as a USNG string, but
    //    with no spaces.  space delimiters are optional but allowed in USNG, but are not allowed
    //    in MGRS notation.  but the numbers are the same.
    LLtoMGRS = function(lat, lon, precision){
        var mgrs_str="";
        var usng_str = LLtoUSNG(lat, lon, precision);
    
        // remove space delimiters to conform to mgrs spec
        var regexp = / /g;
        mgrs_str = usng_str.replace(regexp,"");
    
        return(mgrs_str);

    },
  
    // wrapper function specific to Google Maps, to make a converstion to lat/lng return a GLatLon instance.  
    // takes a usng string, converts it to lat/lng using a call to USNGtoLL,
    // and returns an instance of GLatLng
    GUsngtoLL = function(str){
        var latlng=[];
        USNGtoLL(str,latlng);
        return(new GLatLng(latlng[0],latlng[1]));
    
    }

export { getZoneNumber, LLtoUTM, LLtoUSNG, UTMLetterDesignator, findSet, findGridLetters, lettersHelper, UTMtoLL, USNGtoUTM, USNGtoLL, parseUSNG_str, isUSNG, LLtoMGRS, GUsngtoLL }