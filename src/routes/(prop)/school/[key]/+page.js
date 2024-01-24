import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatDecimal, formatUCWords, formatTitle} from "$lib/format"
import {getPOI, getAPIURL} from "$lib/api"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateName} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    if( !validateName( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid ${formatUCWords( srch_type )} Name.` } )
    
    const validate_data = await fetch( getAPIURL( srch_type, srch_str ) ),
        data_rows = await validate_data.json( )
        
    if( data_rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str}. Enter a valid ${formatUCWords( srch_type )} Name.` } )

    const poi = data_rows[ 0 ],
        hit = { type: srch_type, srch_key: srch_str }

    return { 
			hit: hit, 
			results: [ ], 
			idx: -1, 
			view: null,
			poi: await getPOI( poi, fetch ), 
            title: formatTitle( poi.title )

		}

}