import { json2URL } from "$lib/utils"
import { genError, getErrorMsg } from "$lib/api.js"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch, params } ) => {
    let response, status = 200

    try{
        let sql, result
        const table_from = url.searchParams.get( "table_from" ) ?? null,
            table_to = url.searchParams.get( "table_to" ) ?? null,
            geom_column_from = url.searchParams.get( "geom_column_from" ) ?? "shape",
            geom_column_to = url.searchParams.get( "geom_column_to" ) ?? "shape",
            columns = url.searchParams.get( "columns" ) ?? "*",
            filter = url.searchParams.get( "filter" ) ?? null,
            distance = url.searchParams.get( "distance" ) ?? 0,
            sort = url.searchParams.get( "sort" ) ?? null,
            limit = url.searchParams.get( "limit" ) ?? null,
            conn = ( params.slug === "tax" ? "tax_pool" : "gis_pool" )

        if( table_from && table_to && geom_column_from && geom_column_to ){
            sql = `SELECT ${columns}
                    FROM ${table_from},${table_to}
                    WHERE ST_DWithin(
                        ${table_from}.${geom_column_from},
                        ${table_to}.${geom_column_to},
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
            throw new Error( getErrorMsg( url.searchParams, [ "table_from", "table_to", "geom_column_from", "geom_column_to" ] ) )
        
            
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}