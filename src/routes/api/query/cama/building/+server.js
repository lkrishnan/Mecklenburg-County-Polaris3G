import {genError, getInvalidParams} from "$lib/api.js"
import {arrHasAllElems} from "$lib/utils.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    const allowed = [ "pid", "gisid", "assessproid", "prop_use", "bedroom", "fullbath", "exterior_frame", "story_type", "year_built", "sq_ft" ]

    try{
        let params = Object.fromEntries( url.searchParams )

        if( arrHasAllElems( allowed, Object.keys( params ) ) ){
            let filter = [ ]

            if( params?.pid )
                filter.push( `parcels.parcelid in ( '${params.pid.replace( /,/g,"','")}' )` )
               
            if( params?.gisid )
                filter.push( `parcels.AssessorMap in ( '${params.gisid.replace(/,/g,"','")}' )` )
               
            if( params?.assessproid )
                filter.push( `bldgs.PropertyID in ( '${params.assessproid.replace(/,/g,"','")}' )` )

            if( params?.prop_use )
                filter.push( `bldgs.BuildingCategoryDescription = '${params.prop_use}'` )
                
            if( params?.bedroom )
                filter.push( ( params.bedroom == 5 ? `bldgs.bedrooms > 4` : `bldgs.bedrooms = ${params.bedroom}` ) )
                
            if( params?.fullbath )
                filter.push( ( params.fullbath == 5 ? `bldgs.FullBath > 4` : `bldgs.FullBath = ${params.fullbath}` ) )
          
            if( params?.exterior_frame )
                filter.push( `bldgs.extwall = '${params.exterior_frame}'` )
                            
            if( params?.story_type )
                filter.push( `bldgs.storyheight = '${params.story_type}'` )    

            if( params?.year_built )
                filter.push( `(bldgs.yearbuilt BETWEEN ${concatArr( params.year_built.split( "|" ), " AND " )} )` )
            
            if( params?.sq_ft )
                filter.push( `bldgs.totalarea BETWEEN ${concatArr( params.sq_ft.split( "|" ), " AND " )}` )

            const { assess_pool } = locals,
                sql = `SELECT bldgs.PropertyID as assessproid, 
                        ${ ( ( params?.pid || params?.gisid ) ? "parcels.ParcelID as pid, parcels.AssessorMap as gisid," : "" ) }
                        bldgs.BuildingSequence as bldg_seq, bldgs.BuildingCategoryDescription as property_use_description, bldgs.residentialunits as units, bldgs.yearbuilt as year_built,
                        bldgs.totalarea as total_square_feet, bldgs.finishedarea as heated_square_feet,
                        bldgs.foundation as foundation_description, bldgs.extwall as exterior_wall_description, bldgs.heat as heat_type, bldgs.Heat2Description as ac_type,
                        bldgs.storyheight as stories, bldgs.bedrooms as bedrooms, bldgs.FullBath as full_baths, bldgs.ThreeQuarterBath as three_quarter_baths, bldgs.HalfBath as half_baths,
                        bldgs.buildingtype as building_type
                        ${ ( ( params?.pid || params?.gisid ) ? "FROM dbo.Polaris_Buildings as bldgs INNER JOIN Polaris_AllParceldata as parcels ON bldgs.PropertyID = parcels.PropertyID" : "FROM dbo.Polaris_Buildings as bldgs" ) }
                        WHERE ${filter.join( " and " )}`,
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