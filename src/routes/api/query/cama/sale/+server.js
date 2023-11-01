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
                filter = ( qry_str.hasOwnProperty( "pid" ) ? `parcels.parcelid = '${qry_str.pid}'` : `parcels.AssessorMap = '${qry_str.gisid}'` ),
                sql = `SELECT parcels.ParcelID as pid, parcels.AssessorMap as gisid, convert(varchar, sales.SaleDate, 101) as sale_date, sales.SalePrice as sale_price, sales.LegalReference as legal_reference
                        FROM Assess50Mecklenburg.dbo.Polaris_HistoricalSales as sales
                        INNER JOIN Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                        ON sales.PropertyID = parcels.PropertyID
                        WHERE ${filter}`,
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