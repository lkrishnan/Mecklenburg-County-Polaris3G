import { last_hit } from "$lib/store"
import finder from "$lib/finder"
import { qrystr2srchstr } from "$lib/utils"

let _last_hit

last_hit.subscribe( value => _last_hit = value )

/** @type {import('./$types').PageLoad} */
export function load({ fetch, params, route }) {
    const match = route.id.match( /(address|business|gisid|intersection|library|owner|park|pid|road|school)/ig )

    if( match ){
        const srch_str = qrystr2srchstr( params.key ),
            srch_type = match [ 0 ]

        if( [ "type", srch_type  ].every( key => _last_hit.hasOwnProperty( key ) ) &&
		    _last_hit.type === srch_type.toUpperCase( ) && _last_hit[ srch_type ] === srch_str  ){
		    finder( _last_hit, fetch )

	    }else{
		    console.log( "search then finder" )

	    }

    }

}