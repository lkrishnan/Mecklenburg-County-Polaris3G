import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( gisid || pid ){
            const { cama_pool } = locals,
                sql = `select id_pid as parcel_id, id_common_pid as common_parcel_id, propertyid as account_no, txt_legaldesc as legal_description, txt_accounttype_desc as account_type, 
                txt_taxmun_desc as municipality, cde_taxmun as municipality_code, txt_taxfire_desc as fire_district, cde_taxfire as fire_district_code, txt_taxspecdist_desc as special_district, 
                cde_TaxSpecDist as special_district_code, num_totalac as total_acres, txt_landunittype as land_unit_type 
                from tb_PubParcelInfo 
                where ${pid ? `id_pid = '${pid}'` : `id_common_pid = '${gisid}'` }`,
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