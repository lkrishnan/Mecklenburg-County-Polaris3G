import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatTitle} from "$lib/format" 
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateGISID} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( !validateGISID( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid GIS ID` } )

    const hit = { type: srch_type, gisid: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find GIS ID: ${srch_str}. Enter a valid GIS ID` } )
        
    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        title: formatTitle( `GISID: ${srch_str}` ) 

    }

}