import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=preliminary_plans_ln&filter=ST_DWithin(shape, ST_GeomFromText('POINT(${xy[0]} ${xy[1]})',2264), 50)` ),
        rows =  await response.json( )

        return formatIdentifyResult( rows, "projname" )
    
}