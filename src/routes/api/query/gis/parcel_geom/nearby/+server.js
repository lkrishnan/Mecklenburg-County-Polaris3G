import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        const x = url.searchParams.get( "x" ) ?? null,
            y = url.searchParams.get( "y" ) ?? null,
            lat = url.searchParams.get( "lat" ) ?? null,
            lng = url.searchParams.get( "lng" ) ?? null,
            limit = url.searchParams.get( "limit" ) ?? "5"

        if( ( x && y ) || ( lat && lng ) ){
            const { gis_pool } = locals,
                sql = `select pid as gisid, ST_AsText( shape ) as geom, ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                            round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat,
                            round((parcels_py.shape <-> ST_GeomFromText('POINT(${x?x:lng} ${y?y:lat})',${x?2264:4326}))::Numeric,2) AS dist
                            from parcels_py 
                            where shape is not null
                            order by dist
                            limit ${limit}`,
                result = await gis_pool.query( sql )
    
                response = result.rows

        }else{
            const allowed_params = [ "x", "y", "lat", "lng" ],
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