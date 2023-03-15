import { genError, getInvalidParams } from "$lib/api.js"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let gisid = url.searchParams.get( "gisid" ) ?? null
        
        const pid = url.searchParams.get( "pid" ) ?? null,
            matid = url.searchParams.get( "matid" ) ?? null,
            x = url.searchParams.get( "x" ) ?? null,
            y = url.searchParams.get( "y" ) ?? null,
            lat = url.searchParams.get( "lat" ) ?? null,
            lng = url.searchParams.get( "lng" ) ?? null

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
                sql = `select pid as gisid, ST_AsText( shape ) as geom, ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        from parcels_py 
                        where pid = '${gisid}' and shape is not null`,
                result = await gis_pool.query( sql )
            
            response = result.rows

        }else if( matid ){
            const { gis_pool } = locals,
                sql = `select p.pid as gisid, ST_AsText( p.shape ) as geom, ST_Area( p.shape ) As sqft, round(ST_x(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lat
                        from parcels_py p, masteraddress_pt m
                        where m.num_addr = '${matid}'
                        and ST_DWithin( p.shape, m.shape, 0 )
                        and m.txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )`,
                result = await gis_pool.query( sql )

            response = result.rows

        }else if( ( x && y ) || ( lat && lng ) ){
            const { gis_pool } = locals,
                sql =`select pid as gisid, ST_AsText( shape ) as geom, ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                    round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                    from parcels_py 
                    where shape is not null 
                    and ST_DWithin(shape,ST_GeomFromText('POINT(${x?x:lng} ${y?y:lat})',${x?2264:4326}),0)`,
                intersect_result = await gis_pool.query( sql ) 

            if( intersect_result.rows.length > 0 ){
                response = intersect_result.rows

            }else{
                const nearby_result = await fetch( `/api/parcel/geometry/nearby?${ jsonToURL( x&&y ? { x: x, y: y } : {lng: lng, lat: lat} ) }` )

                response = await nearby_result.json( )

            }

        }else{
            const allowed_params = [ "gisid", "matid", "x", "y", "lat", "lng" ],
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