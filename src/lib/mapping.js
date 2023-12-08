const getRings = ( geomtxt ) => {
    return geomtxt
            .replace( /(\d+)(\s+)(\d+)/g, "$1&$3" )
            .replace( / +?/g, "" )
            .replace( "MULTIPOLYGON(((", "" )
            .replace( ")))", "" )
            .replace( /\)\),\(\(/g, "!" )
            .replace( "MULTIPOLYGON(((", "" )
            .replace( ")))", "" )
            .replace( "POLYGON((", "" )
            .replace( "))", "" )
            .replace( /\),\(/g, "!" )
            .split( "!" )
            .map( coord => {
                return coord.split( "," ).map( point => {
                    const coords = point.split( "&" );
                  
                    return [ parseFloat( coords[ 0 ].trim( ) ), parseFloat( coords[ 1 ].trim( ) ) ] 
                    
                } )

            } )
            
},

getPath = ( geomtxt ) => {
    return geomtxt
            .replace( /MULTILINESTRING|LINESTRING|\)|\(/ig, '' )
            .trim( )
            .split( ',' )
            .map( coord => {
                return coord.split( " " ).map( Number )

            } )

},

getGeom = ( geom_type, geom, epsg=2264 ) => {
    switch( geom_type ){
        case "polygon":
            return {
                type: "polygon",
                rings: ( Array.isArray( geom ) ? geom : getRings( geom ) ),
                spatialReference: { wkid: epsg }
        
            }

        case "polyline":
            return {
                type: "polyline",
                paths: getPath( geom ),
                spatialReference: { wkid: epsg }
        
            }
        
        case "point":
            return {
                type: "point",
                x: geom.x, 
                y: geom.y,
                spatialReference: { wkid: epsg }
            
            }

        default:
            return null

    }

},

getGeomAsTxt = rings => {
    return "MULTIPOLYGON(" + rings.map( ring => { 
        return "((" + ring.map( coords => coords.join( " " ) ).join( "," ) + "))" 

    } ).join( "," ) + ")"
	
}

export { getGeom, getRings, getPath, getGeomAsTxt }