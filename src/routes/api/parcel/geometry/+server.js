import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let gisid = url.searchParams.get( "gisid" ) ?? null
        const pid = url.searchParams.get( "pid" ) ?? null

        if( pid ){ //get gisid through switcher
            const switcher_response = await fetch( `/api/parcel/switcher?pid=${pid}` ),
                switcher_data = await switcher_response.json( )

            if( switcher_data.length > 0 )
                gisid = switcher_data[ 0 ].gisid

            else
                throw { message: "Supplied pid is invalid", code: 500 }

        }

        if( gisid ){ //use parcels layer
            const { gis_pool } = locals,
                sql = `select pid as gisid, shape as geom, ST_Area(shape) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        from parcels_py 
                        where pid = '${gisid}' and shape is not null`,
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