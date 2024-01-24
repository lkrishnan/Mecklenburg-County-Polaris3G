import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=boe_precincts_meck_py&filter=ST_Within(ST_GeomFromText( 'POINT(${xy[0]} ${xy[1]})', 2264 ),shape)` ),
        rows =  await response.json( ),
        field_format = { 
            "precinct": val => parseInt( val ),
            "zone": val => parseInt( val ), 

        }

        return formatIdentifyResult( rows, "objectid", field_format )
    
}