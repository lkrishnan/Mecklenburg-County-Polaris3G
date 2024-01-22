import {genError, getInvalidParams} from "$lib/api"
import {pg_escape} from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const name = url.searchParams.get( "name" ) ?? null

        if( name ){ 
            const { gis_pool } = locals,
                sql = `SELECT company as value, 'BUSINESS' as type, round(ST_X(shape)::NUMERIC,4) as x, round(ST_Y(shape)::NUMERIC,4) as y, 
                        round(ST_X(ST_Transform(shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(shape, 4326))::NUMERIC,4) as lat, 
                        company as name, address, city, state, (zip::INTEGER)::text as zip, company as srch_key
                        FROM businesswise_businesses_pt
                        WHERE company ~* $$${pg_escape( name )}$$
                        LIMIT 5`,
                result = await gis_pool.query( sql )

            response = result.rows
                            
        }else{
            const allowed_params = [ "name" ],
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