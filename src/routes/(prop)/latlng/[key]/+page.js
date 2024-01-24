import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {formatDecimal, formatTitle} from "$lib/format"
import {getPOI} from "$lib/api"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateLatLng} from "$lib/validate" 

/** @type {import('./$types').PageDataData} */
export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( srch_str.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter valid Latitude and Longitude.` } )

    if( !validateLatLng( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find Latitude and Longitude: ${srch_str}. Enter valid Latitude and Longitude.` } )

    const hit = { type: srch_type, latlng: srch_str, page: 1 },
        latlng =  hit.latlng.split( "," ).map( elem => parseFloat( elem ) ),
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find Latitude and Longitude: ${srch_str}. Enter valid Latitude and Longitude.` } )

    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        poi: ( rows.length > 0 ? { } : await getPOI( { lat: latlng[ 0 ], lng: latlng[ 1 ] }, fetch ) ), 
        title: formatTitle( srch_str )

    }

}

