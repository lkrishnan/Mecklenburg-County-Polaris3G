/** @type {import('./$types').PageDataData} */

import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateGISID} from "$lib/validate" 
import {last_hit} from "$lib/store"

let _last_hit

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type !== srch_type.toUpperCase( ) || _last_hit.value !== srch_str.toUpperCase( ) ){ //request must have come from address bar of browser
        const arr = srch_str.split( "|" )

        if( arr.length === 2 ){
            const gisid = arr[ 0 ],
                buffer = parseInt( arr[ 1 ] )

            if( validateGISID( gisid ) && ( buffer >= 0 && buffer <= 5280 ) ){
                const filter = { value: srch_str, type: srch_type, buffer: srch_str, page: 1, view: "deed" }

                last_hit.set( filter )
                finder( filter, fetch )

            }else
                throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid GIS ID and buffer between (0-5280 ft)` } ) 
        
        }else
            throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid GIS ID and buffer between (0-5280 ft)` } ) 
        
    }

}

last_hit.subscribe( value => _last_hit = value )