/** @type {import('./$types').LayoutData} */
import {error} from "@sveltejs/kit"
import {last_hit} from "$lib/store"
import {qrystr2srchstr, objIsEqual, filterObj, URL2Obj} from "$lib/utils"
import {validateSpChar} from "$lib/validate"
import finder from "$lib/finder"

let _last_hit

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ).toUpperCase( ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ].toUpperCase( )

    if( _last_hit.type === srch_type ){
        if( url.search.length > 0 ){
            if( objIsEqual( filterObj( _last_hit, [ "type", "page", "view" ], false ) , URL2Obj( url.search ) ) )
                finder( _last_hit, fetch )

        }else{
            if( _last_hit.value === srch_str )
                finder( _last_hit, fetch )
            
        }
        
    }
    
}

last_hit.subscribe( value => _last_hit = value )