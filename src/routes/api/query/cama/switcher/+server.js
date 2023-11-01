import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    const allowed = [ "pid", "gisid" ]

    try{
        let qry_str = { }

        allowed.forEach( key => {
            if( url.searchParams.get( key ) )
                qry_str[ key ] = url.searchParams.get( key )
                        
        } )

        if( Object.keys( qry_str ).length > 0 ){
            const { assess_pool } = locals,
                filter = ( qry_str.hasOwnProperty( "pid" ) ? `parcels.parcelid = '${qry_str.pid}' or parcels.parcelid like '${qry_str.pid}[A-Z|a-z]'` : `parcels.AssessorMap = '${qry_str.gisid}'` ), 
                sql = `SELECT parcels.parcelid as pid, parcels.AssessorMap as gisid 
                        FROM dbo.Polaris_AllParceldata as parcels 
                        WHERE ${ filter } 
                        GROUP BY parcels.parcelid, parcels.AssessorMap`,
                result  = await assess_pool.query( sql )

            response = result.recordset

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