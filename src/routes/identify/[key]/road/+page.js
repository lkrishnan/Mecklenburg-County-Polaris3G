import {formatIdentifyResult, formatDate, formatDecimal} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=streets_ln&filter=ST_DWithin(shape, ST_GeomFromText('POINT(${xy[0]} ${xy[1]})',2264), 50)` ),
        rows =  await response.json( ),
        field_format = { 
            "lasteditdate": val => formatDate( val ),
            "dateadded": val => formatDate( val ), 
            "pavementwidth": val => formatDecimal( val ),

        }

        return formatIdentifyResult( rows, "e911", field_format )
    
}