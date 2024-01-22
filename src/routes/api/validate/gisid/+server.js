import {genError, getInvalidParams} from "$lib/api"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid ){ //use parcels layer
            const { gis_pool } = locals,
                sql = `select pid as value, 'GISID' as type, pid as srch_key 
                        from parcels_py 
                        where pid ~* '${gisid}' and shape is not null
                        group by pid
                        limit 5`,
                result = await gis_pool.query( sql )
            
            response = result.rows

        }else{
            const allowed_params = [ "gisid" ],
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