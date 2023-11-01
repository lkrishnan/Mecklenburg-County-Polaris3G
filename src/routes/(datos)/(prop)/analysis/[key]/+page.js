/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {qrystr2srchstr, objIsEqual, filterObj, URL2Obj} from "$lib/utils"
import {validateSpChar} from "$lib/validate" 
import {last_hit} from "$lib/store"

let _last_hit

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ],
        passed_params = URL2Obj( url.search )

    //needs validation

    if( _last_hit.type !== srch_type.toUpperCase( ) && !objIsEqual( filterObj( _last_hit, [ "type", "page", "view" ], false ) , passed_params ) ){
        const filter = { type: srch_type, page: 1, view: "property", ...passed_params }

        last_hit.set( filter )
        finder( filter, fetch )

    }
    
}

last_hit.subscribe( value => _last_hit = value )