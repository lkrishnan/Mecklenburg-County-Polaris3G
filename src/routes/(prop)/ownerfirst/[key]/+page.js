import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatUCWords, formatTitle} from "$lib/format"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateName} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        error( 404, { message: `Polaris 3G can't find anything. Enter a valid Owner First Name` } );

    if( !validateName( srch_str ) )
    error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid Owner First Name` } );

    const hit = { type: srch_type, firstname: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid Owner First Name` } );
        
    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        title: formatTitle( srch_str ), 

    }
    
}