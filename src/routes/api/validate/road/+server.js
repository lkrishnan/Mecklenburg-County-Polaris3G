import {genError, getInvalidParams} from "$lib/api"
import {pg_escape} from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        const name = url.searchParams.get( "name" ) ?? null,
            stcode = url.searchParams.get( "stcode" ) ?? null,
            { gis_pool } = locals,
            getFilter = srch_type => {
                switch( srch_type ){
                    case "name":
                        return `regexp_replace(admkey, '\\s*:.....', ', ') || CASE
                            WHEN municipality = 'CHAR' THEN 'CHARLOTTE'
                            WHEN municipality = 'CORN' THEN 'CORNELIUS'
                            WHEN municipality = 'DAVI' THEN 'DAVIDSON'
                            WHEN municipality = 'HUNT' THEN 'HUNTERSVILLE'
                            WHEN municipality = 'MATT' THEN 'MATTHEWS'
                            WHEN municipality = 'MINT' THEN 'MINT HILL'
                            WHEN municipality = 'PINE' THEN 'PINEVILLE'
                            WHEN municipality = 'STAL' THEN 'STALLINGS'
                            WHEN municipality = 'MECK' THEN 'MECKLENBURG'
                            ELSE ''
                        END ~* $$${pg_escape( name )}$$`

                    case "stcode":
                        return `countystcode = ${stcode}`

                }
            }

        if( name || stcode ){
            const sql = `SELECT regexp_replace(admkey, '\\s*:.....', ', ') || 
                            CASE 
                                WHEN municipality = 'CHAR' THEN 'CHARLOTTE' 
                                WHEN municipality = 'CORN' THEN 'CORNELIUS'
                                WHEN municipality = 'DAVI' THEN 'DAVIDSON'
                                WHEN municipality = 'HUNT' THEN 'HUNTERSVILLE'
                                WHEN municipality = 'MATT' THEN 'MATTHEWS'
                                WHEN municipality = 'MINT' THEN 'MINT HILL'
                                WHEN municipality = 'PINE' THEN 'PINEVILLE'
                                WHEN municipality = 'STAL' THEN 'STALLINGS'
                                WHEN municipality = 'MECK' THEN 'MECKLENBURG'
                                ELSE '' 
                            END as value, 
                            'ROAD' as type,
                            countystcode as srch_key
                    FROM streetfile_tb
                    WHERE ${getFilter( name ? "name" : "stcode" )}
                    LIMIT 5`,
                result = await gis_pool.query( sql )

            response = result.rows 

        }else{
            const allowed_params = [ "name" ],
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