import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const lastname = url.searchParams.get( "lastname" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            typ = url.searchParams.get( "get" ) ?? "info"

        if( lastname || firstname || pid || gisid ){
            const { cama_pool } = locals,
                filter = [ "lastname", "firstname", "pid", "gisid" ]
                    .map( field => {
                        if( url.searchParams.get( field ) && field === "lastname" ){
                            return `nme_ownerlastname like '${lastname}%'`

                        }else if( url.searchParams.get( field ) && field === "firstname" ){
                            return `nme_ownerfirstname like '${firstname}%'`

                        }else if( url.searchParams.get( field ) && field === "pid" ){
                            return `id_Pid = '${pid}'`

                        }else if( url.searchParams.get( field ) && field === "gisid" ){
                            return `id_common_Pid = '${gisid}'`

                        }

                    } )
                    .filter( n => n ),

                sql = {
                    "lastname": `select top 5 nme_ownerlastname as value, 'LAST NAME' as type, nme_ownerlastname as last_name 
                                from tb_PubOwner 
                                where ${filter.join( " and " )} 
                                group by nme_ownerlastname`,
                                
                    "firstname": `select top 5 nme_ownerfirstname as value, 'FIRST NAME' as type, nme_ownerfirstname as first_name 
                                    from tb_PubOwner where ${filter.join( " and " )} 
                                    group by nme_ownerfirstname`,

                    "fullname": `select top 5 (nme_ownerlastname + ', ' + nme_ownerfirstname) as value, 'OWNER' as type, nme_ownerlastname as last_name, nme_ownerfirstname as first_name
                                from tb_PubOwner
                                where ${filter.join( " and " )}
                                group by nme_ownerlastname, nme_ownerfirstname`,

                    "info": `select top 5 id_pid as parcel_id, id_common_pid as common_parcel_id, txt_OwnerNumber as owner_number, nme_ownerlastname as last_name, nme_ownerfirstname as first_name, txt_ownertype_desc as owner_type, txt_mailaddr1 as address_1, ISNULL( txt_mailaddr2,'' ) as address_2, txt_city as city, txt_State as state, txt_zipcode as zipcode
                            from tb_PubOwner
                            where ${filter.join( " and " )}`

                },

                result  = await cama_pool.query( sql[ typ ] )

            response = result.recordset

        }else{
            const allowed_params = [ "lastname", "firstname", "pid", "gisid", "get" ],
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