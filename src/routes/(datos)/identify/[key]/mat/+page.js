/** @type {import('./$types').PageData} */
import { formatIdentifyResult, formatDecimal, formatDate } from "$lib/format"

export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=masteraddress_pt&filter=ST_DWithin(shape, ST_GeomFromText('POINT(${xy[0]} ${xy[1]})',2264), 50)` ),
        rows =  await response.json( ),
        field_format = {
            "num_x_coord": val => formatDecimal( val ),
            "num_y_coord": val => formatDecimal( val ),
            "txt_street_number": val => parseInt( val ),
            "county_street_code": val => parseInt( val ),
            "dte_add": val => formatDate( val ),
            "dte_upd": val => formatDate( val ),
            "latitude": val => formatDecimal( val ),
            "longitude": val => formatDecimal( val ),
            "effective_from_date": val => formatDate( val ),
            "effective_to_date": val => formatDate( val ),
            
        }

        return formatIdentifyResult( rows, "address" )
    
}