import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { assess_pool } = locals,
                sql = `SELECT parcels.PropertyID as assesspro_id, parcels.ParcelID as pid, parcels.AssessorMap as gisid, bldgs.BuildingSequence as card_number, bldgs.BuildingCategoryDescription as property_use_description, bldgs.residentialunits as units, bldgs.yearbuilt as year_built,
                        bldgs.totalarea as total_square_feet, bldgs.finishedarea as heated_square_feet,
                        bldgs.foundation as foundation_description, bldgs.extwall as exterior_wall_description, bldgs.heat as heat_type, bldgs.Heat2Description as ac_type,
                        bldgs.storyheight as stories, bldgs.bedrooms as bedrooms, bldgs.FullBath as full_baths, bldgs.ThreeQuarterBath as three_quarter_baths, bldgs.HalfBath as half_baths,
                        bldgs.buildingtype as building_type,parcels.TotalBuildingValue as building_value
                        FROM Assess50Mecklenburg.dbo.Polaris_Buildings as bldgs
                        INNER JOIN Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                        ON bldgs.PropertyID = parcels.PropertyID
                        where ${pid ? `parcels.ParcelID = '${pid}'` : `parcels.AssessorMap = '${gisid}'`}`,
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