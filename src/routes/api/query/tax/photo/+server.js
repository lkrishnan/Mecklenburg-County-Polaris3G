import { json2URL } from "$lib/utils"
import { genError, getErrorMsg } from "$lib/api.js"
import { validateNumeric } from "$lib/validate.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let sql, result
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            { tax_pool } = locals
            
        if( pid || gisid ){
            sql = `select 'Mecklenburg County' as source, 'iLookAbout' as attribution, replace( image_path, 'http', 'https' ) as photo_url, 
                    to_char(to_timestamp(image_date,'YYYY-MM-DD HH24:MI:SS'), 'yyyymmdd') as photo_date 
                    from sde.tb_property_photo 
                    where taxpid not in ('04728238', '02114204', '03519615') and ${( pid ? `taxpid='${pid}'` : `gis_pid='${gisid}'` )}` 

            result = await tax_pool.query( sql )
            response = result.rows        
    
        }else
            throw new Error( getErrorMsg( url.searchParams, [ "pid", "gisid" ] ) )
            
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}