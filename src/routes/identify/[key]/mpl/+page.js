import {formatIdentifyResult, formatDate, formatDecimal} from "$lib/format"

/** @type {import('./$types').PageData} */
export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( encodeURI( `/api/query/gis?table=mpl_sites&filter=ST_Within(ST_GeomFromText('POINT(${xy[0]} ${xy[1]})', 2264),shape)` ) ),
        rows =  await response.json( ),
        field_format = { 
            "add_date": val => formatDate( val ),
            "init_invest_date": val => formatDate( val ), 
            "last_visit_date": val => formatDate( val ), 
            "site_status_update_date": val => formatDate( val ),
            "open_date": val => formatDate( val ),
            "close_date": val => formatDate( val ),
            "updtdate": val => formatDate( val ),
            "last_insp": val => formatDate( val ),
            "next_insp": val => formatDate( val ),
            "issue_date": val => formatDate( val ),
            "exp_date": val => formatDate( val ),
            "closedate": val => formatDate( val ),
            "Shape_Length": val => formatDecimal( val ),
            "Shape_Area": val => formatDecimal( val ),

        }
        
    return formatIdentifyResult( rows, "NAME", field_format )

}