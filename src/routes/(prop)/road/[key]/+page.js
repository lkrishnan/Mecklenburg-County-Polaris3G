import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {formatUCWords, formatTitle} from "$lib/format"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateNumeric} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    if( !validateNumeric( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    const hit = { type: srch_type, stcode: parseInt( srch_str ), page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    const road_detail_resp = await fetch( getAPIURL( "stcode", parseInt( srch_str ) ) ),
        road_detail = await road_detail_resp.json( )
       
    return { 
            hit: hit, 
            results: rows, 
            idx: ( rows.length === 1 ? 0 : -1 ), 
            view: "ownership",
            title: ( road_detail.length > 0 ? formatTitle( road_detail[ 0 ].value ) : undefined )

        }
    
}