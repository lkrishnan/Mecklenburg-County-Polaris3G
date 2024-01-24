import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatUCWords, formatTitle} from "$lib/format"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar,validateOwnerName} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid Owner Name` } )

    if( !validateOwnerName( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid Owner Name` } )

    const comma_split = srch_str.split( "," ).map( item => item.trim( ) ),
        hit = { type: srch_type, lastname: comma_split[ 0 ], firstname: comma_split[ 1 ], page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid Owner Name` } )
        
    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        title: formatTitle( srch_str ),

    }

}