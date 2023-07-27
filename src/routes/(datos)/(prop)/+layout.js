import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import {last_hit} from "$lib/store"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateOwnerName, validateAddress, validateTaxPID, validateGISID, validateIntersection, validateLatLng, validateStatePlane, validateSpChar, validateRings } from "$lib/validate" 

let _last_hit

last_hit.subscribe( value => _last_hit = value )

/** @type {import('./$types').LayoutData} */
export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type === srch_type.toUpperCase( ) && _last_hit.value.toUpperCase( ) === srch_str )
        finder( _last_hit, fetch )
        
    else if( srch_type === "address" && validateAddress( srch_str ) ){
        const validate_addr = await fetch( `/api/validate/address?fulladdr=${srch_str}` ),
            addr_rows = await validate_addr.json( )
                    
        if( addr_rows.length > 0 )
            finder( addr_rows[ 0 ], fetch )
                    
        else
            throw error( 404, { message: "Search String not found" } )
              
    }

    else if( ( srch_type === "pid" && validateTaxPID( srch_str ) ) ||
        ( srch_type === "gisid" && validateGISID( srch_str ) ) ||
        ( srch_type === "situs" && validateAddress( srch_str ) ) || 
        ( srch_type === "intersection" && validateIntersection( srch_str ) ) || 
        ( srch_type === "owner" && validateOwnerName( srch_str ) ) || 
        ( srch_type === "ownerlast" && srch_str.length > 0 ) ||
        srch_type === "road" ){

        const validate_data = await fetch( getAPIURL( srch_type, srch_str ) ),
            data_rows = await validate_data.json( )
                    
        if( data_rows.length > 0 )
            finder( data_rows[ 0 ], fetch )
                    
        else
            throw error( 404, { message: "Search String not found" } )

    }

    else if( srch_type === "nearby" && validateStatePlane( srch_str ) ){
        finder( { value: srch_str, type: srch_type, nearby: srch_str }, fetch )    

    }
            
    else if( srch_type === "xy" && validateStatePlane( srch_str ) ){
        const xy = srch_str.split( "," ).map( coord => coord.trim( ) )

        finder( { value: srch_str, type: srch_type, x: xy[ 0 ], y: xy[ 1 ] }, fetch )    

    }
    
    else if( srch_type === "latlng" && validateLatLng( srch_str ) ){
        let latlng = srch_str.split( "," ).map( coord => coord.trim( ) )
                    
        finder( { value: srch_str, type: srch_type, lat: latlng[ 0 ], lng: latlng[ 1 ] }, fetch )    

    }

    else if( srch_type === "buffer" && validateGISID( srch_str.substring( 0, srch_str.indexOf( "|" ) ) ) )
        finder( { value: srch_str, type: srch_type, gisid: srch_str.substring( 0, srch_str.indexOf( "|" ) ), buffer: parseInt( srch_str.substring( srch_str.indexOf( "|" ) +1, srch_str.length ) ) }, fetch )    

    else if( srch_type === "poly" && validateRings( JSON.parse( srch_str ) ) )
        finder( { value: srch_str, type: srch_type, rings: JSON.parse( srch_str ) }, fetch )
     
    else
        throw error( 404, { message: "Search String not found" } )

}