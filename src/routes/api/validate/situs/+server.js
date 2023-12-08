import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const address = url.searchParams.get( "address" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( pid || gisid || address ){
            const { assess_pool } = locals,
                filter = [ "address", "pid", "gisid" ]
                    .map( field => {
                        if( url.searchParams.get( field ) && field === "address" ){
                            return `parcels.location_address like '${address}%'`

                        }else if( url.searchParams.get( field ) && field === "pid" ){
                            return `parcels.ParcelID in ( '${pid.replace( /,/g,"','")}' )`

                        }else if( url.searchParams.get( field ) && field === "gisid" ){
                            return `parcels.AssessorMap in ( '${gisid.replace(/,/g,"','")}' )`

                        }

                    } )
                    .filter( n => n ),

                    sql = `SELECT TOP 5 parcels.location_address as value, 'SITUS' as type, parcels.location_address as srch_key
                            FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                            WHERE ${filter.join( " and " )}`,

                result  = await assess_pool.query( sql )

            response = result.recordset

        }else{
            const allowed_params = [ "address", "pid", "gisid" ],
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