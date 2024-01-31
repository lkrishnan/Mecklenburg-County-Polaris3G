import {formatIdentifyResult, formatDecimal, formatDate} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=ncdeq_brownfields_py&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264),shape)` ),
        rows =  await response.json( ),
        field_format = { 
            bf_acreage: val => formatDecimal( parseFloat( val ), 3 ),
            creationdate: val => formatDate( val ),
            editdate: val => formatDate( val ),
            shape_Length: val => formatDecimal( parseFloat( val ), 3 ),
            shape_Area: val => formatDecimal( parseFloat( val ), 3 )

        }

        return formatIdentifyResult( rows, "bf_name", field_format )
    
}