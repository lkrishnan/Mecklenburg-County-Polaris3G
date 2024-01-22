import {genError, getInvalidParams} from "$lib/api"
import {pg_escape} from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( {url, locals, fetch} ) => {
    let response, status = 200, result

    try{
        const street1 = url.searchParams.get( "street1" ) ?? null,
            street2 = url.searchParams.get( "street2" ) ?? null,
            street3 = url.searchParams.get( "street3" ) ?? null,
            stcode1 = url.searchParams.get( "stcode1" ) ?? null,
            stcode2 = url.searchParams.get( "stcode2" ) ?? null,
            stcode3 = url.searchParams.get( "stcode3" ) ?? null,
            { gis_pool } = locals

        if( street1 && street2 ){
            result = await gis_pool.query( 
                            `select replace( streets, '_', ' & ' ) as value, 'INTERSECTION' as type, replace( streets, '_', ' & ' ) as intersection,
                            round(ST_X(shape)::NUMERIC,4) as x, round(ST_Y(shape)::NUMERIC,4) as y, 
                            round(ST_X(ST_Transform(shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(shape, 4326))::NUMERIC,4) as lat,
                            ( coalesce( stunitid1, '' ) || coalesce( '&' || stunitid2, '' ) || coalesce( '&' || stunitid3, '' ) ) as srch_key
                            from streetintersections_pt
                            where controltype in ( 3, 5 )
                            ${ street1 ? ` and streets ~* $$\w*${pg_escape( street1 )}\w*$$` : `` }${ street2 ? ` and streets ~* $$\w*${pg_escape( street2 )}\w*$$` : `` }${ street3 ? ` and streets ~* $$\w*${pg_escape( street3 )}\w*$$` : `` }
                            LIMIT 5` 

                        )

            response = result.rows  

        }else if( stcode1 && stcode2 ){
            result = await gis_pool.query( 
                            `select replace( streets, '_', ' & ' ) as value, 'INTERSECTION' as type, replace( streets, '_', ' & ' ) as intersection,
                            round(ST_X(shape)::NUMERIC,4) as x, round(ST_Y(shape)::NUMERIC,4) as y, 
                            round(ST_X(ST_Transform(shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(shape, 4326))::NUMERIC,4) as lat,
                            ( coalesce( stunitid1, '' ) || coalesce( '&' || stunitid2, '' ) || coalesce( '&' || stunitid3, '' ) ) as srch_key
                            from streetintersections_pt
                            where controltype in ( 3, 5 )
                            ${ stcode1 ? ` and stunitid1 = '${stcode1}'` : `` }${ stcode2 ? ` and stunitid2 = '${stcode2}'` : `` }${ stcode3 ? ` and stunitid3 = '${stcode3}'` : `` }
                            LIMIT 5` 

                        )
            
            response = result.rows

        }else{
            const allowed_params = [ "street1", "street2", "street3" ],
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