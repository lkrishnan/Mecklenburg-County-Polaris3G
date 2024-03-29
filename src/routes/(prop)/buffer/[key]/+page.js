import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatTitle} from "$lib/format"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateGISID} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    const arr = srch_str.split( "|" )

    if( arr.length !== 2 )
        error( 404, { message: `Polaris 3G can't find anything. Enter a valid GIS ID and buffer between (0-5280 ft)` } ); 

    const gisid = arr[ 0 ],
        buffer = parseInt( arr[ 1 ] )

    if( !( validateGISID( gisid ) && ( buffer >= 0 && buffer <= 5280 ) ) )
        error( 404, { message: `Polaris 3G can't find anything. Enter a valid GIS ID and buffer between (0-5280 ft)` } ); 

    const hit = { type: srch_type, buffer: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        error( 404, { message: `No results were returned for a ${buffer} ft buffer search around a property with GIS ID: ${gisid}` } );
        
    return { 
        hit: { ...hit, gisid: gisid, buffer: buffer }, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        title: formatTitle( `GISID: ${gisid}(${buffer}ft buffer)`  )

    }

}