import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        const x = url.searchParams.get( "x" ) ?? null,
            y = url.searchParams.get( "y" ) ?? null,
            in_epsg = url.searchParams.get( "epsg" ) ?? "2264",
            out_epsg = url.searchParams.get( "epsg" ) ?? "4326"

        if( x && y ){ 
            const { gis_pool } = locals,
                sql = `select ST_X(ST_Transform(ST_GeomFromText('POINT(${x} ${y})',${in_epsg}),${out_epsg}) ) As x, ST_Y(ST_Transform(ST_GeomFromText('POINT(${x} ${y})',${in_epsg}),${out_epsg}) ) As y`,
                result = await gis_pool.query( sql )
        
            response = result.rows

        }else{
            const allowed_params = [ "x", "y", "in_epsg", "out_epsg" ],
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