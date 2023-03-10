import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const address = url.searchParams.get( "address" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            typ = url.searchParams.get( "type" ) ?? "info"

        if( pid || gisid || address ){
            const { cama_pool } = locals,
                filter = [ "address", "pid", "gisid" ]
                    .map( field => {
                        if( url.searchParams.get( field ) && field === "address" ){
                            return `LTRIM(CONCAT( IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseNo)),'' ))>0, LTRIM(RTRIM(num_HouseNo)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stdir)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stdir)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stname)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stname)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STTYPE)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STTYPE)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STSUFFIX)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STSUFFIX)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseUnit)),'' ))>0, ' ' +LTRIM(RTRIM(num_HouseUnit)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(CDE_MUNIC_DESC)),'' ))>0, ' ' +LTRIM(RTRIM(CDE_MUNIC_DESC)), '')
                            )) like '${address}%'`

                        }else if( url.searchParams.get( field ) && field === "pid" ){
                            return `id_Pid = '${pid}'`

                        }else if( url.searchParams.get( field ) && field === "gisid" ){
                            return `id_common_Pid = '${gisid}'`

                        }

                    } )
                    .filter( n => n ),

                sql = {
                    validate: `select top 5 LTRIM( CONCAT( IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseNo)),'' ))>0, LTRIM(RTRIM(num_HouseNo)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stdir)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stdir)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stname)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stname)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STTYPE)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STTYPE)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STSUFFIX)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STSUFFIX)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseUnit)),'' ))>0, ' ' +LTRIM(RTRIM(num_HouseUnit)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(CDE_MUNIC_DESC)),'' ))>0, ' ' +LTRIM(RTRIM(CDE_MUNIC_DESC)), '') ) ) as value, 
                                'SITUS' as type, id_pid as pid, id_common_pid as gisid, 
                                LTRIM( CONCAT( IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseNo)),'' ))>0, LTRIM(RTRIM(num_HouseNo)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stdir)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stdir)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_stname)),'' ))>0, ' ' +LTRIM(RTRIM(txt_stname)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STTYPE)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STTYPE)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(txt_STSUFFIX)),'' ))>0, ' ' +LTRIM(RTRIM(txt_STSUFFIX)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(num_HouseUnit)),'' ))>0, ' ' +LTRIM(RTRIM(num_HouseUnit)), ''),
                                IIF(LEN(ISNULL(LTRIM(RTRIM(CDE_MUNIC_DESC)),'' ))>0, ' ' +LTRIM(RTRIM(CDE_MUNIC_DESC)), '') ) )as fulladdress
                                from tb_PUBLOCATION
                                where ${filter.join( " and " )}`,
                                                                
                    info: `select id_pid as parcel_id, id_common_pid as common_parcel_id, LTRIM(RTRIM(num_HouseNo)) as house_number, LTRIM(RTRIM(txt_stdir)) as prefix, 
                            LTRIM(RTRIM(txt_stname)) as street_name, LTRIM(RTRIM(txt_STTYPE)) as road_type, LTRIM(RTRIM(txt_STSUFFIX)) as suffix, ISNULL(LTRIM(RTRIM(num_HouseUnit)),'') as unit, 
                            CDE_MUNIC_DESC AS city 
                            from tb_PUBLOCATION
                            where ${filter.join( " and " )}`

                },

                result  = await cama_pool.query( sql[ typ ] )

            response = result.recordset

        }else{
            const allowed_params = [ "address", "pid", "gisid", "get" ],
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