/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {formatDecimal} from "$lib/format"
import {getPOI} from "$lib/api"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateIntersection} from "$lib/validate" 

export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    if( !validateIntersection( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    const validate_data = await fetch( getAPIURL( srch_type, srch_str ) ),
        data_rows = await validate_data.json( ),
        poi = data_rows[ 0 ]

    if( data_rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find School: ${srch_str}. Enter a valid School Name.` } )

    const hit = { type: srch_type, intersection: srch_str }

    return { 
            hit: hit, 
            results: [ ], 
            idx: -1, 
            view: null,
            poi: await getPOI( poi, fetch ), 

        }
        
}