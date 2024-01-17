import {mkConfig, generateCsv} from "export-to-csv"
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
                "Postal Address": ( row?.mat ? row.mat.splice( 0, 3 ).map( mat => mat.address ).reduce( ( acc, curr ) => `${acc}|${curr}` ) : "NA" ),
                "Owner Name": ( row.owner ? row.owner.map( (o, i) => formatFullName2( o, false ) ).reduce( ( acc, curr ) => `${acc}|${curr}` ) : "NA" ), 
                
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