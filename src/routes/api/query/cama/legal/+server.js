import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { assess_pool } = locals,
                sql = `SELECT parcels.ParcelID as pid, parcels.AssessorMap as gisid, parcels.PropertyID as account_no, 
                        parcels.AccountTypeDescription as account_type, parcels.LegalDescription as legal_description,
                        parcels.Tax_MunDist as municipality, parcels.Tax_FireDist as fire_district, parcels.Tax_SpecialDist as special_district, rptmain.TotalArea as total_acres, 
                        RTRIM(rptmain.TotalAreaUOM) as land_unit_type, RTRIM(rptmain.TotalAreaUOMDescription) as land_unit_desc
                        FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                        LEFT JOIN Assess50Mecklenburg.dbo.RptMain as rptmain
                        ON parcels.ParcelID = rptmain.ParcelID
                        WHERE ${pid ? `parcels.ParcelID = '${pid}'` : `parcels.AssessorMap = '${gisid}'`}
                        AND rptmain.YearID = '2024'`,
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