import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const address = url.searchParams.get( "address" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( pid || gisid || address ){
            const { cama_pool } = locals,
                filter = [ "address", "pid", "gisid" ]
                    .map( field => {
                        if( url.searchParams.get( field ) && field === "address" ){
                            return `LTRIM(CONCAT( IIF(LEN(ISNULL(LTRIM(RTRIM(l.num_HouseNo)),'' ))>0, LTRIM(RTRIM(l.num_HouseNo)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.txt_stdir)),'' ))>0, ' ' +LTRIM(RTRIM(l.txt_stdir)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.txt_stname)),'' ))>0, ' ' +LTRIM(RTRIM(l.txt_stname)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.txt_STTYPE)),'' ))>0, ' ' +LTRIM(RTRIM(l.txt_STTYPE)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.txt_STSUFFIX)),'' ))>0, ' ' +LTRIM(RTRIM(l.txt_STSUFFIX)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.num_HouseUnit)),'' ))>0, ' ' +LTRIM(RTRIM(l.num_HouseUnit)), ''),
                            IIF(LEN(ISNULL(LTRIM(RTRIM(l.CDE_MUNIC_DESC)),'' ))>0, ' ' +LTRIM(RTRIM(l.CDE_MUNIC_DESC)), '')
                            )) like '${address}%'`

                        }else if( url.searchParams.get( field ) && field === "pid" ){
                            return `l.id_Pid in ( '${pid.replace( /,/g,"','")}' )`

                        }else if( url.searchParams.get( field ) && field === "gisid" ){
                            return `l.id_common_pid in ( '${gisid.replace(/,/g,"','")}' )`

                        }

                    } )
                    .filter( n => n ),
                sql = `SELECT top 500 l.id_pid as pid, l.id_common_pid as gisid, 
                        l.num_HouseNo as addrno, rtrim( l.txt_stdir ) as prefix, 
                        rtrim( l.txt_stname ) as stname, rtrim( l.txt_STTYPE ) as sttype, rtrim( l.txt_STSUFFIX ) as suffix, 
                        ISNULL( l.num_HouseUnit, '' ) as unit, l.CDE_MUNIC_DESC AS juris, 
                        ( select ltrim( rtrim( coalesce( o.nme_OwnerLastName, '' ) ) ) + ';' + ltrim( rtrim( coalesce( o.nme_OwnerFirstName, '' ) ) ) + ' | ' from polaris.tb_PubOwner as o where o.id_PID = l.id_PID order by o.txt_OwnerNumber for xml path( '' ) ) AS owner_names 
                        FROM polaris.tb_PubLocation as l
                        WHERE ${filter.join( " and " )}
                        GROUP BY l.id_PID, l.id_Common_Pid, l.num_HouseNo, l.txt_StDir, l.txt_StName, l.txt_StType, l.txt_StSuffix, l.num_HouseUnit, l.cde_Munic_Desc
                        ORDER BY l.cde_Munic_Desc, l.txt_StName, l.txt_StType, l.txt_StDir, l.txt_StSuffix, l.num_HouseNo`,

                result  = await cama_pool.query( sql )

            response = result.recordset

        }else{
            const allowed_params = [ "address", "pid", "gisid" ],
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