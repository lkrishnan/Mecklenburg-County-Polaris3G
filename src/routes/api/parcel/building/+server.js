import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { cama_pool } = locals,
                sql = `select id_pid as pid, id_common_pid as gisid, num_card_no as card_number, txt_propertyuse_desc as property_use_description, cnt_units as units, num_yearbuilt as year_built, 
                num_grossarea as total_square_feet, num_heatedarea as heated_square_feet, 
                txt_foundation_desc as foundation_description, txt_extwall_desc as exterior_wall_description, txt_heatingtype_desc as heat_type, txt_actype_desc as ac_type, 
                txt_storyheight_desc as stories, num_bedrooms as bedrooms, cnt_fullbaths as full_baths, cnt_threeqtrbaths as three_quarter_baths, cnt_halfbaths as half_baths, txt_buildingtype_desc as building_type, amt_netbldgvalue as building_value 
                from tb_PubBuilding where ${pid ? `id_pid = '${pid}'` : `id_common_pid = '${gisid}'` }`,
                result  = await cama_pool.query( sql )
            
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