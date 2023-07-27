import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            { assess_pool } = locals

        if( gisid || pid ){
            const sql = `SELECT parcels.parcelid as pid, parcels.AssessorMap as gisid 
                            FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels 
                            WHERE ${pid ? `parcels.parcelid = '${pid}' or parcels.parcelid like '${pid}[A-Z|a-z]'` : `parcels.AssessorMap = '${gisid}'` } 
                            GROUP BY parcels.parcelid, parcels.AssessorMap`,
                result  = await assess_pool.query( sql )

            response = result.recordset

        }else{
            const allowed_params = [ "pid", "gisid" ],
            invalid_params = getInvalidParams( url.searchParams, allowed_params ).join( ', ' )
            
            response = genError( { "message": `invalid paramater(s) sent: ${invalid_params}` } )
            status = 500
        
        }
    
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}