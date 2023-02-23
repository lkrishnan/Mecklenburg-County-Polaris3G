import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { cama_pool } = locals,
                sql = `SELECT id_pid as pid, txt_Common_Pid as gisid, ctb_PubLandUse.txt_LandUse_fullDesc as land_use, tb_Publand.cnt_landunits as units, tb_publand.txt_neighcode as neighborhood_code, tb_publand.txt_neigh_desc as neighborhood, cde_landunittype as land_unit_type
                        FROM tb_PubLand LEFT JOIN ctb_PubLandUse ON tb_PubLand.cde_LandUseCode = ctb_PubLandUse.cde_LandUse 
                        WHERE ${pid ? `id_pid = '${pid}'` : `id_common_pid = '${gisid}'` }
                        ORDER BY id_pid, tb_Publand.cnt_landunits desc`,
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