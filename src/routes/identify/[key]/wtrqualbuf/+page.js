import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( encodeURI( `/api/query/gis?table=waterquality_buffers_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264),shape) and legend in ('100 ft SW','100 ft WS','35 ft SW','40 ft WS','50 ft SW','50 ft WS','30 ft PIPED','35 ft PIPED','100 ft PIPED')` ) ),
        rows =  await response.json( )

        return formatIdentifyResult( rows, "legend" )
   
}