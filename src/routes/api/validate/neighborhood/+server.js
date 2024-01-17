import {genError} from "$lib/api.js"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const neigh_code = url.searchParams.get( "neigh_code" ) ?? null

        if( neigh_code ){ //use cama tables
            const { assess_pool } = locals,
                sql = `SELECT parcels.Neighborhood as value, 'NEIGHCODE' as type, parcels.Neighborhood as neigh_code
                        FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels 
                        where parcels.Neighborhood like '${neigh_code}%'
                        group by parcels.Neighborhood`,
                result  = await assess_pool.query( sql )
            
            response = result.recordset

        }else{
            const allowed_params = [ "neigh_code" ],
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