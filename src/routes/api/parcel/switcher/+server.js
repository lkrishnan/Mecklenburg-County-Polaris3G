import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            { cama_pool } = locals

        if( gisid || pid ){
            const sql = `select id_pid as pid, id_common_pid as gisid 
                            from tb_PubOwner
                            where ${pid ? `id_pid = '${pid}' or id_pid like '${pid}[A-Z|a-z]'` : `id_common_pid = '${gisid}'` }
                            group by id_pid, id_common_pid`,
                result  = await cama_pool.query( sql )

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