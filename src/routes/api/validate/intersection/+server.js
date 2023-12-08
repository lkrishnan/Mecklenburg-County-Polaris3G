import { error } from "@sveltejs/kit"
import { json2URL } from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        const street1 = url.searchParams.get( "street1" ) ?? null,
            street2 = url.searchParams.get( "street2" ) ?? null,
            { gis_pool } = locals

        if( street1 || street2 ){
            const sql = `select replace( streets, '_', ' & ' ) as value, 'INTERSECTION' as type, replace( streets, '_', ' & ' ) as intersection,
                            round(ST_X(shape)::NUMERIC,4) as x, round(ST_Y(shape)::NUMERIC,4) as y, 
                            round(ST_X(ST_Transform(shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(shape, 4326))::NUMERIC,4) as lat,
                            replace( streets, '_', ' & ' ) as srch_key
                            from streetintersections_pt
                            where controltype in ( 3, 5 )${ street1 ? ` and streets ~* '\w*${street1}\w*'` : `` }${ street2 ? ` and streets ~* '\w*${street2}\w*'` : `` }
                            LIMIT 5`,
                result = await gis_pool.query( sql )
            
            response = result.rows  

        }else{
            const allowed_params = [ "street1", "street2" ],
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