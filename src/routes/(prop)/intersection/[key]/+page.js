import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import finder from "$lib/finder"
import {formatDecimal, formatUCWords, formatTitle} from "$lib/format"
import {getPOI} from "$lib/api"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateNumeric} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        error( 404, { message: `Polaris 3G can't find anything. Enter a valid ${formatUCWords( srch_type )} Name.` } );

    if( !srch_str.split( "&" ).map( stcode => validateNumeric( stcode ) ).reduce( ( prev, curr ) => prev && curr ) )
        error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )}: ${srch_str.replace( "&", " & ")}. Enter a valid ${formatUCWords( srch_type )}.` } );

    const validate_data = await fetch( getAPIURL( "intersectionstcode", srch_str ) ),
        data_rows = await validate_data.json( )
        
    if( data_rows.length === 0 )
        error( 404, { message: `Polaris 3G can't find ${formatUCWords( srch_type )} with street codes: ${srch_str.replace( "&", " & ")}. Enter a valid ${formatUCWords( srch_type )}.` } );

    const poi = data_rows[ 0 ],
        hit = { type: srch_type, isrch_key: srch_str }

    return { 
            hit: hit, 
            results: [ ], 
            idx: -1, 
            view: null,
            poi: await getPOI( poi, fetch ),
            title: formatTitle( poi.value ) 

        }
        
}