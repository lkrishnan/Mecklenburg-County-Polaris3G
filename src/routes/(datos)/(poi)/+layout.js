/** @type {import('./$types').LayoutData} */

import {error} from "@sveltejs/kit"
import {last_hit, poi} from "$lib/store"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar} from "$lib/validate" 

let _last_hit

export async function load( {fetch, params, route} ){
    const getUSNG = async ( lat, lng ) => {
            const usng_resp = await fetch( `/api/query/usng?lat=${lat}&lng=${lng}` ),
                usng_json = await usng_resp.json( )

            return usng_json.usng

        },
        srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type === srch_type.toUpperCase( ) && _last_hit.value.toUpperCase( ) === srch_str )
        poi.set( { ..._last_hit, usng: await getUSNG( _last_hit.lat, _last_hit.lng ) } )

}

last_hit.subscribe( value => _last_hit = value )