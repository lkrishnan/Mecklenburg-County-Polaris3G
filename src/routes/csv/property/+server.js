import {mkConfig, generateCsv} from "export-to-csv"
import {genError, getInvalidParams} from "$lib/api"
import {formatDate, formatLandArea, formatFullName2, formatDeed, formatMoney} from "$lib/format"
import {getAnlyzAllowedParams} from "$lib/formhelp"
import {json2URL, arrHasAllElems} from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( {url, locals, fetch} ) => {
	let response, options = { status: 200 }

    try{
        const csvConfig = mkConfig({ useKeysAsHeaders: true });

        const allowed = getAnlyzAllowedParams( ),
            params = { limit: 1800, ...Object.fromEntries( url.searchParams ) }
        
        if( !arrHasAllElems( allowed, Object.keys( params ) ) )
            throw new Error( `invalid paramater(s) sent: ${ getInvalidParams( params, allowed ).join( ', ' ) }` )

         //Get CAMA data
        const bolt_resp = await fetch( `/api/bolt/cama?${json2URL(params)}` )

        if( !bolt_resp.ok )
             throw new Error( "No CAMA data available" )
 
         const rows = await bolt_resp.json( )
 
        if( rows.length === 0 )
             throw new Error( "No CAMA data available" )

        const data = rows.map( ( row, idx ) => ( {
                "No": `${String( idx + 1 )}.`, 
                "Parcel ID": row.pid, 
                "Postal Address": ( row?.mat ? row.mat.splice( 0, 1 ).map( mat => mat.address ).reduce( ( acc, curr ) => `${acc}${curr}` ) : "" ),
                "Land Area": formatLandArea( row.land_size, row.land_unit, row.sqft ),
                "Sale Price": ( row.sale.length > 0 ? formatMoney( row.sale[ 0 ].sale_price, {  minimumFractionDigits: 0, } ) : "" ),
                "Sale Date": ( row.sale.length > 0 ? formatDate( row.sale[ 0 ].sale_date ) : "" ),
                "Market Val": ( row.market_value ? formatMoney( row.market_value, {  minimumFractionDigits: 0, } ) : "" ),
                "Sq. Ft": ( row.bldg.length > 0 ? row.bldg[ 0 ].total_sqft ?? "" : "" ),
                "Year Built": ( row.bldg.length > 0 ? row.bldg[ 0 ].year_built ?? "" : "" ),
                "Bedrooms": ( row.bldg.length > 0 ? row.bldg[ 0 ].bedrooms ?? "" : "" ),
                "Full Baths": ( row.bldg.length > 0 ? row.bldg[ 0 ].full_baths ?? "" : "" ),

            } ) )
        
        // Converts your Array<Object> to a CsvOutput string based on the configs
        response = generateCsv(csvConfig)( data )
        options = { ...options, headers: { "Content-Type": "text/csv" } }
    
    }catch( err ){
		response =  JSON.stringify( genError( { "message": err.message, "code": err.code } ) )
        options.status = 500

    }finally{
        return new Response( response, options )

    }

}