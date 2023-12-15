import {mkConfig, generateCsv, download} from "export-to-csv"
import {genError, getInvalidParams} from "$lib/api"
import {formatDate, formatLandArea, formatFullName2, formatDeed} from "$lib/format"
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
                "Owner Name": ( row.owner ? row.owner.map( (o, i) => formatFullName2( o, false ) ).reduce( ( acc, curr ) => `${acc}|${curr}` ) : "NA" ), 
                "Mailing Address": ( row.mailing_address ?? "NA" ), 
                "Legal Desc": ( row.legal_description ? row.legal_description : "NA" ), 
                "Deed": ( row?.sale ? row.sale.splice( 0, 1 ).map( item => formatDeed( item.legal_reference, item.sale_date, true ) ).reduce( ( acc, curr ) => `${acc}${curr}` ) : "NA" ), 
                "Land Area": formatLandArea( row.land_size, row.land_unit, row.sqft )

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