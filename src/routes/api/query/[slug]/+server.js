import {json2URL, unEscape} from "$lib/utils"
import {genError, getErrorMsg} from "$lib/api.js"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch, params } ) => {
    let response, status = 200

    try{
        let sql, result
        const table = url.searchParams.get( "table" ) ?? null,
            columns = url.searchParams.get( "columns" ) ?? "*",
            filter = url.searchParams.get( "filter" ) ?? null,
            sort = url.searchParams.get( "sort" ) ?? null,
            limit = url.searchParams.get( "limit" ) ?? null,
            group = url.searchParams.get( "group" ) ?? null,
            conn = ( params.slug === "tax" ? "tax_pool" : "gis_pool" )
            
        if( table ){
            sql = unEscape( `SELECT ${columns} FROM ${table} ${filter ? `WHERE ${filter}` : '' } ${group ? `GROUP BY ${group}` : '' } ${sort ? `ORDER BY ${sort}` : '' } ${limit ? `LIMIT ${limit}` : '' }` )

            result = await locals[ conn ].query( sql )
            response = result.rows

        }else
            throw new Error( getErrorMsg( url.searchParams, [ "table" ] ) )
                    
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}