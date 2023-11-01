/** @type {import('./$types').PageData} */
import { formatIdentifyResult, formatDecimal } from "$lib/format"

export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=census_blocks_2020_py&filter=ST_Within(ST_GeomFromText( 'POINT(${xy[0]} ${xy[1]})', 2264 ) , shape)` ),
        rows =  await response.json( ),
        field_format = { 
            "aland20": val => formatDecimal( parseFloat( val ), 3 ),
            "awater20": val => formatDecimal( parseFloat( val ), 3 ),
            "intptlat20": val => formatDecimal( parseFloat( val ), 3 ),
            "intptlon20": val => formatDecimal( parseFloat( val ), 3 ),

        }
    
    return formatIdentifyResult( rows, "blockce20", field_format )

}