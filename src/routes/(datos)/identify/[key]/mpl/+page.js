/** @type {import('./$types').PageData} */
import { idLayer } from "$lib/api"
import { formatIdentifyResult, formatDate, formatDecimal } from "$lib/format"

export async function load( {params} ){
    const rows = await idLayer( params.key, 60, "pt" ),
        field_format = { 
            "ADD_DATE": val => formatDate( val ),
            "INIT_INVEST_DATE": val => formatDate( val ), 
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