import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { assess_pool } = locals,
                sql = `SELECT parcels.ParcelID as pid, parcels.AssessorMap as gisid, convert(varchar, sales.SaleDate, 101) as sale_date, sales.SalePrice as sale_price, sales.LegalReference as legal_reference
                        FROM Assess50Mecklenburg.dbo.Polaris_HistoricalSales as sales
                        INNER JOIN Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                        ON sales.PropertyID = parcels.PropertyID
                        WHERE ${pid ? `parcels.ParcelID = '${pid}'` : `parcels.AssessorMap = '${gisid}'`}`,
                result  = await assess_pool.query( sql )
            
            response = result.recordset

        }else{
            const allowed_params = [ "pid", "gisid" ],
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