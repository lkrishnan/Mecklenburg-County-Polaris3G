import {json2URL} from "$lib/utils"
import {genError, getErrorMsg} from "$lib/api.js"
import {validateNumeric} from "$lib/validate.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let sql, result
        const gisid = url.searchParams.get( "gisid" ) ?? null,
            matid = url.searchParams.get( "matid" ) ?? null,
            { gis_pool } = locals
            
        if( gisid ){
            sql = `select m.num_addr::text as matid, m.full_address as address, m.num_parent_parcel as matpid, 
                    ST_Y( m.shape ) as y, ST_X( m.shape ) as x, ST_y( ST_transform( m.shape, 4326 ) ) as lat, ST_x( ST_transform( m.shape, 4326 ) ) as lng, 
                    p.pid as gisid, ST_AsText( p.shape ) as geom, ST_Area( p.shape ) As sqft, round(ST_x(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_y,
                    round(ST_x(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lat
                    from parcels_py p, masteraddress_pt m
                    where p.pid = '${gisid.toUpperCase( )}'
                    and ST_DWithin( p.shape, m.shape, 0 )
                    and m.txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )`

            result = await gis_pool.query( sql )
            response = result.rows
        
        }else if( matid ){
            sql = `select m.num_addr::text as matid, m.full_address as address, m.num_parent_parcel as matpid, 
                    ST_Y( m.shape ) as y, ST_X( m.shape ) as x, ST_y( ST_transform( m.shape, 4326 ) ) as lat, ST_x( ST_transform( m.shape, 4326 ) ) as lng, 
                    p.pid as gisid, ST_AsText( p.shape ) as geom, ST_Area( p.shape ) As sqft, round(ST_x(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_y,
                    round(ST_x(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lat
                    from parcels_py p, masteraddress_pt m
                    where m.num_addr::text = '${matid}'
                    and ST_DWithin( p.shape, m.shape, 0 )
                    and m.txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )`

            result = await gis_pool.query( sql )
            response = result.rows

        }else
            throw new Error( getErrorMsg( url.searchParams, [ "gisid", "matid" ] ) )
            
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}


                    
            //and txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )
            /*const args = {
                    //columns: "full_address as value, 'ADDRESS' as type, objectid as matid, groundpid as gisid, round(ST_X(the_geom)::NUMERIC,4) as x, round(ST_Y(the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as matpid, full_address as address",
                    columns: "full_address as value, 'ADDRESS' as type, objectid as matid, round(ST_X(the_geom)::NUMERIC,4) as x, round(ST_Y(the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as matpid, full_address as address",
                    limit: 8,
                    filter: `ts @@ to_tsquery('addressing_en', '${addr.toUpperCase().replace(/ /g, '&') + ':*'}')
                        and txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )
                            and the_geom is not null`
                },
                result = await fetch( `https://api.mcmap.org/v1/query/master_address_table?${jsonToURL( args )}`)

            if( result.ok )
                response = await result.json( )*/