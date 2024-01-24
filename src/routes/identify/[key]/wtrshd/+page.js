import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( encodeURI( `/api/query/gis?table=watershed_stormwater_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264),shape)` ) ),
        rows =  await response.json( )

        return formatIdentifyResult( rows, "name" )
   
}