import { genError } from "$lib/api.js"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid ){ //use parcels layer
            const { gis_pool } = locals,
                sql = `select pid as value, 'GISID' as type, pid as gisid 
                        from parcels_py 
                        where pid ~* '${gisid}' and shape is not null
                        group by pid
                        limit 5`,
                result = await gis_pool.query( sql )
            
            response = result.rows

        }else if( pid ){ //use cama tables
            const { cama_pool } = locals,
                sql = `select top 5 LTRIM(RTRIM(id_Pid)) as value, 'PID' as type, LTRIM(RTRIM(id_Pid)) as pid, LTRIM(RTRIM(id_Common_Pid)) as gisid 
                        from tb_PubLocation 
                        where id_Pid like '${pid}%'`,
                result  = await cama_pool.query( sql )
            
            response = result.recordset

        }else{
            const allowed_params = [ "gisid", "pid" ],
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