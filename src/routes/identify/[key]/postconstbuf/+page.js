import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( encodeURI( `/api/query/gis?table=waterquality_buffers_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264),shape) and legend in ('30 ft PC','35 ft PC','50 ft PC','100 ft PC','50 ft PC Undisturbed','100 ft PC Undisturbed','200 ft PC Undisturbed')` ) ),
        rows =  await response.json( )

        return formatIdentifyResult( rows, "legend" )
   
}