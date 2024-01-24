import { formatIdentifyResult } from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        urls = [
            `/api/query/gis?table=Zoning_cityofcharlotte_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264), shape)`,
            `/api/query/tax?table=County_Towns_Zoning_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264), shape)`,
        ],
        results = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) ),
        rows = results.flat( )

        return formatIdentifyResult( rows, "objectid" )
    
}