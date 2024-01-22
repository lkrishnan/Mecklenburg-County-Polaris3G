import {genError, getInvalidParams} from "$lib/api"
import {odbc_escape} from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const lastname = url.searchParams.get( "lastname" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            typ = url.searchParams.get( "get" ) ?? "fullname",
            exact = url.searchParams.get( "exact" ) ?? 0

        if( lastname || firstname ){
            let filter = [ ]

            // Determine Filter
            if( lastname && firstname ){
                if( exact > 0 )
                    filter.push( `( ( ownr.Owner1LastName = '${odbc_escape(lastname)}' AND ownr.Owner1FirstName = '${odbc_escape(firstname)}' ) OR ( ownr.Owner2LastName = '${odbc_escape(lastname)}' AND ownr.Owner2FirstName = '${odbc_escape(firstname)}' ) OR ( ownr.Owner3LastName = '${odbc_escape(lastname)}' AND ownr.Owner3FirstName = '${odbc_escape(firstname)}' ) )` )
                else
                    filter.push( `( ( ownr.Owner1LastName like '${odbc_escape(lastname)}%' AND ownr.Owner1FirstName like '${odbc_escape(firstname)}%' ) OR ( ownr.Owner2LastName like '${odbc_escape(lastname)}%' AND ownr.Owner2FirstName like '${odbc_escape(firstname)}%' ) OR ( ownr.Owner3LastName like '${odbc_escape(lastname)}%' AND ownr.Owner3FirstName like '${odbc_escape(firstname)}%' ) )` )

            }else if( lastname ){
                if( exact > 0 )
                    filter.push( `ownr.Owner1LastName = '${odbc_escape(lastname)}' OR ownr.Owner2LastName = '${odbc_escape(lastname)}' OR ownr.Owner3LastName = '${odbc_escape(lastname)}'` )
                else
                    filter.push( `ownr.Owner1LastName like '${odbc_escape(lastname)}%' OR ownr.Owner2LastName like '${odbc_escape(lastname)}%' OR ownr.Owner3LastName like '${odbc_escape(lastname)}%'` )

            }else if( firstname ){
                if( exact > 0 )
                    filter.push( `ownr.Owner1FirstName = '${odbc_escape(firstname)}' OR ownr.Owner2FirstName = '${odbc_escape(firstname)}' OR ownr.Owner3FirstName = '${odbc_escape(firstname)}'` )
                else
                    filter.push( `ownr.Owner1FirstName like '${odbc_escape(firstname)}%' OR ownr.Owner2FirstName like '${odbc_escape(firstname)}%' OR ownr.Owner3FirstName like '${odbc_escape(firstname)}%'` )
            
            }

            const { assess_pool } = locals,
                getCaseBlock = ( val ) => {
                    switch( val ){
                        case "lastname":
                                return `WHEN ( ownr.Owner1LastName like '${odbc_escape(lastname)}%' ) THEN LTRIM(RTRIM(ownr.Owner1LastName))
                                        WHEN ( ownr.Owner2LastName like '${odbc_escape(lastname)}%' ) THEN LTRIM(RTRIM(ownr.Owner2LastName))
                                        WHEN ( ownr.Owner3LastName like '${odbc_escape(lastname)}%' ) THEN LTRIM(RTRIM(ownr.Owner3LastName))
                                        ELSE NULL`
                        
                        case "firstname":
                            return `WHEN ( ownr.Owner1FirstName like '${odbc_escape(firstname)}%' ) THEN LTRIM(RTRIM(ownr.Owner1FirstName))
                                    WHEN ( ownr.Owner2FirstName like '${odbc_escape(firstname)}%' ) THEN LTRIM(RTRIM(ownr.Owner2FirstName))
                                    WHEN ( ownr.Owner3FirstName like '${odbc_escape(firstname)}%' ) THEN LTRIM(RTRIM(ownr.Owner3FirstName))
                                    ELSE NULL`

                        case "fullname":
                            return `WHEN ( ownr.Owner1LastName like '${odbc_escape(lastname)}%' AND ownr.Owner1FirstName like '${odbc_escape(firstname)}%' AND LEN(LTRIM(RTRIM(ownr.Owner1FirstName)))>0 ) THEN LTRIM(RTRIM(ownr.Owner1LastName)) + ', ' + LTRIM(RTRIM(ownr.Owner1FirstName))
                                    WHEN ( ownr.Owner2LastName like '${odbc_escape(lastname)}%' AND ownr.Owner2FirstName like '${odbc_escape(firstname)}%' AND LEN(LTRIM(RTRIM(ownr.Owner2FirstName)))>0  ) THEN LTRIM(RTRIM(ownr.Owner2LastName)) + ', ' + LTRIM(RTRIM(ownr.Owner2FirstName))
                                    WHEN ( ownr.Owner3LastName like '${odbc_escape(lastname)}%' AND ownr.Owner3FirstName like '${odbc_escape(firstname)}%' AND LEN(LTRIM(RTRIM(ownr.Owner3FirstName)))>0  ) THEN LTRIM(RTRIM(ownr.Owner3LastName)) + ', ' + LTRIM(RTRIM(ownr.Owner3FirstName))
                                    ELSE NULL`

                    }               

                },
                getSQL = typ => {
                    switch( typ ){
                        case "lastname":
                            return `SELECT top 5 CASE ${getCaseBlock( 'lastname' )} END as value, 'OWNERLAST' as type, CASE ${getCaseBlock( 'lastname' )} END as srch_key
                                        FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                        WHERE ${filter.join( " and " )}
                                        GROUP BY CASE ${getCaseBlock( 'lastname' )} END`

                        case "firstname":
                            return `SELECT top 5 CASE ${getCaseBlock( 'firstname' )} END as value, 'OWNERFIRST' as type, CASE ${getCaseBlock( 'firstname' )} END as srch_key
                                        FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                        WHERE ${filter.join( " and " )}
                                        GROUP BY CASE ${getCaseBlock( 'firstname' )} END`

                        case "fullname":
                            return `SELECT top 5 CASE ${getCaseBlock( 'fullname' )} END as value,'OWNER' as type, CASE ${getCaseBlock( 'fullname' )} END as srch_key
                                        FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                        WHERE ${filter.join( " and " )}
                                        GROUP BY CASE ${getCaseBlock( 'fullname' )} END, CASE ${getCaseBlock( 'lastname' )} END, CASE ${getCaseBlock( 'firstname' )} END`

                    }

                },
                result  = await assess_pool.query( getSQL( typ ) )

            response = result.recordset

        }else{
            const allowed_params = [ "lastname", "firstname", "get" ],
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