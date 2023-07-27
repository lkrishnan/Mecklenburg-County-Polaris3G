import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { assess_pool, assess_yr } = locals,
                sql = `SELECT parcels.PropertyID as assesspro_id, parcels.ParcelID as pid, parcels.AssessorMap as gisid, parcels.LandUseCode as land_use_code, parcels.landuse_description as land_use, parcels.LandSize as units, 
                        parcels.LandUnitDescription as land_unit_type, parcels.Neighborhood as neighborhood_code, neightbl.FullDescription
                        FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels 
                        LEFT JOIN Assess50Mecklenburg.dbo.xrNeighborhood as neightbl
                        ON parcels.Neighborhood = neightbl.Neighborhood
                        WHERE ${pid ? `parcels.ParcelID = '${pid}'` : `parcels.AssessorMap = '${gisid}'`}
                        AND neightbl.YearID = '2023'`,
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