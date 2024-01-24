import {formatIdentifyResult} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {fetch, params} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( encodeURI( `/api/query/gis?table=buildingpermits_pt&filter=ST_DWithin(geom, ST_GeomFromText('POINT(${xy[0]} ${xy[1]})',2264),50) and compldate >= (current_date-365) and typeofbldg IN ('New', 'New Bldg') and permtreqco = 'Y' and occupancy LIKE 'R3%'` ) ),
        rows =  await response.json( )

        return formatIdentifyResult( rows, "projname" )
   
}