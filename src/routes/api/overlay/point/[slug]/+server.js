import { json2URL } from "$lib/utils"
import { genError, getErrorMsg } from "$lib/api.js"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch, params } ) => {
    let response, status = 200

    try{
        let sql, result
        const x = url.searchParams.get( "x" ) ?? null,
            y = url.searchParams.get( "y" ) ?? null,
            table = url.searchParams.get( "table" ) ?? null,
            srid = url.searchParams.get( "srid" ) ?? "2264",
            columns = url.searchParams.get( "columns" ) ?? "*",
            geom_column = url.searchParams.get( "geom_column" ) ?? "shape",
            filter = url.searchParams.get( "filter" ) ?? null,
            distance = url.searchParams.get( "distance" ) ?? 0,
            sort = url.searchParams.get( "sort" ) ?? null,
            limit = url.searchParams.get( "limit" ) ?? null,
            conn = ( params.slug === "tax" ? "tax_pool" : "gis_pool" )

        if( x && y && table ){
            sql = `SELECT ${columns}
                    FROM ${table}
                    WHERE 
                        ST_DWithin(
                            ${geom_column},      
                            ST_Transform(
                                st_setsrid(
                                    st_makepoint(${x}, ${y}), 
                                    ${srid}
                                ),
                                (SELECT ST_SRID(${geom_column}) FROM ${table} LIMIT 1)
                            ), 
                            ${distance}
                        )
                  
                    -- Optional Filter
                    ${filter ? `AND ${filter}` : '' }
              
                    -- Optional sort
                    ${sort ? `ORDER BY ${sort}` : '' }
              
                    -- Optional limit
                    ${limit ? `LIMIT ${limit}` : '' }`

            result = await locals[ conn ].query( sql )
            response = result.rows

        }else
            throw new Error( getErrorMsg( url.searchParams, [ "x", "y", "table" ] ) )
        
            
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}