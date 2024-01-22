import {genError, getInvalidParams} from "$lib/api"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null

        if( pid ){ //use cama tables
            const { assess_pool } = locals,
                sql = `SELECT parcels.ParcelID as value, 'PID' as type, parcels.ParcelID as srch_key
                        FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels 
                        where parcels.ParcelID like '${pid}%'`,
                result  = await assess_pool.query( sql )
            
            response = result.recordset

        }else{
            const allowed_params = [ "pid" ],
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