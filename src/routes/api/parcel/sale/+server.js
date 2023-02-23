import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { cama_pool } = locals,
                sql = `select id_pid as parcel_id, id_common_pid as common_parcel_id, convert(varchar, dte_dateofsale, 101) as sale_date, amt_price as sale_price, 
                txt_deedbook + ' ' + txt_deedpage as deed_book, [txt_legalreference] as legal_reference 
                from tb_PubSales 
                where ${pid ? `id_pid = '${pid}'` : `id_common_pid = '${gisid}'` }
                order by dte_dateofsale, txt_deedbook, txt_deedpage`,
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