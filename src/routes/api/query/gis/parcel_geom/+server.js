import {genError, getInvalidParams} from "$lib/api"
import {getGeomAsTxt} from "$lib/mapping"
import {json2URL, arrHasAllElems, isJSON } from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    const allowed = [ "pid", "gisid", "matid", "xy", "latlng", "rings", "nearby", "buffer", "geom" ]
        
    try{
        let params = { geom: 1, ...Object.fromEntries( url.searchParams ) }
        
        if( arrHasAllElems( allowed, Object.keys( params ) ) ){
            let sql

            if( params?.pid & !params?.gisid ){
                const switcher_response = await fetch( `/api/query/cama/switcher?pid=${params.pid}` ),
                    switcher_data = await switcher_response.json( )
    
                if( switcher_data.length > 0 )
                    params.gisid = switcher_data[ 0 ].gisid
    
                else
                    throw { message: "Supplied pid is invalid", code: 500 }

            }

            if( params?.gisid ){
                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        WHERE pid in ( '${params.gisid.replace(/,/g,"','")}' )
                        AND shape is not null`

            }else if( params?.matid ){
                sql = `SELECT p.pid as gisid, ${params.geom == 1? "ST_AsText( p.shape ) as geom,": "" } ST_Area( p.shape ) As sqft, round(ST_x(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(p.shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(p.shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py p, masteraddress_pt m
                        WHERE m.num_addr = '${params.matid}'
                        AND p.shape is not null
                        and ST_DWithin( p.shape, m.shape, 0 )
                        and m.txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )`

            }else if( params?.xy ){
                const arr = params.xy.split( "," )

                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        WHERE ST_DWithin(shape, ST_GeomFromText('POINT(${arr[0]} ${arr[1]})',2264), 0)
                        AND shape is not null`

            }else if( params?.latlng ){
                const arr = params.latlng.split( "," )

                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        WHERE ST_DWithin(shape, ST_transform(ST_GeomFromText('POINT(${arr[1]} ${arr[0]})',4326),2264), 0)
                        AND shape is not null`
                        
            }else if( params?.rings ){
                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        WHERE ST_DWithin(shape, ST_GeomFromText('${ ( isJSON( params.rings ) ? getGeomAsTxt( JSON.parse(params.rings) ) : params.rings )}',2264), 0 )
                        AND shape is not null`

            }else if( params?.nearby ){
                const arr = params.nearby.split( "," )

                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        WHERE shape is not null
                        ORDER BY round((parcels_py.shape <-> ST_GeomFromText('POINT(${arr[0]} ${arr[1]})',2264))::Numeric,2)
                        LIMIT 5`

            }else if( params?.buffer ){
                const arr = params.buffer.split( "|" )

                sql = `SELECT pid as gisid, ${params.geom == 1? "ST_AsText( shape ) as geom,": "" } ST_Area( shape ) As sqft, round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y,
                        round(ST_x(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lon, round(ST_y(ST_PointOnSurface(ST_transform(shape,4326)))::NUMERIC,4) as centroid_lat
                        FROM parcels_py 
                        where ST_DWithin( shape, (select shape from parcels_py where pid = '${arr[0]}' ), ${arr[1]} )`

            }

            const { gis_pool } = locals,
                result = await gis_pool.query( sql )

            response = result.rows

        }else{
            const invalid_params = getInvalidParams( url.searchParams, allowed ).join( ', ' )
                
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