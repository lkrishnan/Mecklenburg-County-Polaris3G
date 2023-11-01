/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateStatePlane} from "$lib/validate" 
import {last_hit} from "$lib/store"

let _last_hit

last_hit.subscribe( value => _last_hit = value )

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type !== srch_type.toUpperCase( ) || _last_hit.value !== srch_str.toUpperCase( ) ){ //request must have come from address bar of browser
        if( validateStatePlane( srch_str ) ){
            const filter = { value: srch_str, type: srch_type, xy: srch_str, page: 1, view: "ownership" }

            last_hit.set( filter )
            finder( filter, fetch )
    
        }else
            throw error( 404, { message: `Polaris 3G can't find anything. Enter valid State Plane Coordinates` } )

    }

}