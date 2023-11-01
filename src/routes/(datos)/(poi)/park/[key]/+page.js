/** @type {import('./$types').PageDataData} */

import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateAlphaNumeric} from "$lib/validate" 
import {last_hit, poi} from "$lib/store"

let _last_hit

export async function load( {fetch, params, route, url} ){
    const getUSNG = async ( lat, lng ) => {
        const usng_resp = await fetch( `/api/query/usng?lat=${lat}&lng=${lng}` ),
            usng_json = await usng_resp.json( )

        return usng_json.usng

    },
    srch_str = qrystr2srchstr( params.key ),
    srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type !== srch_type.toUpperCase( ) || _last_hit.value.toUpperCase( ) !== srch_str ){ //request must have come from address bar of browser
        if( validateAlphaNumeric( srch_str ) ){
            const validate_data = await fetch( getAPIURL( srch_type, srch_str ) ),
                data_rows = await validate_data.json( ),
                _poi = data_rows[ 0 ]
                
            if( data_rows.length > 0 ){
                last_hit.set( _poi )
                poi.set( { ..._poi, usng: await getUSNG( _poi.lat, _poi.lng ) } )
            
            }else
                throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid Park Name` } )

        }else
            throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid Park Name` } )

    }

}

last_hit.subscribe( value => _last_hit = value )