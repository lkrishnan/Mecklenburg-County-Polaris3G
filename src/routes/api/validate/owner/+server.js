import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const lastname = url.searchParams.get( "lastname" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            typ = url.searchParams.get( "get" ) ?? "fullname"

        if( lastname || firstname ){
            let filter = [ ]

            // Determine Filter
            if( lastname && firstname ){
                filter.push( `( ( ownr.Owner1LastName like '${lastname}%' AND ownr.Owner1FirstName like '${firstname}%' ) OR ( ownr.Owner2LastName like '${lastname}%' AND ownr.Owner2FirstName like '${firstname}%' ) OR ( ownr.Owner3LastName like '${lastname}%' AND ownr.Owner3FirstName like '${firstname}%' ) )` )

            }else if( lastname ){
                filter.push( `ownr.Owner1LastName like '${lastname}%' OR ownr.Owner2LastName like '${lastname}%' OR ownr.Owner3LastName like '${lastname}%'` )

            }else if( firstname ){
                filter.push( `ownr.Owner1FirstName like '${firstname}%' OR ownr.Owner2FirstName like '${firstname}%' OR ownr.Owner3FirstName like '${firstname}%'` )
            
            }

            const { assess_pool } = locals,
                getCaseBlock = ( val ) => {
                    switch( val ){
                        case "lastname":
                                return `WHEN ( ownr.Owner1LastName like '${lastname}%' ) THEN ownr.Owner1LastName
                                        WHEN ( ownr.Owner2LastName like '${lastname}%' ) THEN ownr.Owner2LastName
                                        WHEN ( ownr.Owner3LastName like '${lastname}%' ) THEN ownr.Owner3LastName
                                        ELSE NULL`
                        
                        case "firstname":
                            return `WHEN ( ownr.Owner1FirstName like '${firstname}%' ) THEN ownr.Owner1FirstName
                                    WHEN ( ownr.Owner2FirstName like '${firstname}%' ) THEN ownr.Owner2FirstName
                                    WHEN ( ownr.Owner3FirstName like '${firstname}%' ) THEN ownr.Owner3FirstName
                                    ELSE NULL`

                        case "fullname":
                            return `WHEN ( ownr.Owner1LastName like '${lastname}%' AND ownr.Owner1FirstName like '${firstname}%' ) THEN ownr.Owner1LastName + ', ' + ownr.Owner1FirstName
                                    WHEN ( ownr.Owner2LastName like '${lastname}%' AND ownr.Owner2FirstName like '${firstname}%' ) THEN ownr.Owner2LastName + ', ' + ownr.Owner2FirstName
                                    WHEN ( ownr.Owner3LastName like '${lastname}%' AND ownr.Owner3FirstName like '${firstname}%' ) THEN ownr.Owner3LastName + ', ' + ownr.Owner3FirstName
                                    ELSE NULL`

                    }               

                },
                sql = {
                    "lastname": `SELECT top 5 CASE ${getCaseBlock( 'lastname' )} END as value, 'OWNERLAST' as type, CASE ${getCaseBlock( 'lastname' )} END as lastname
                                    FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                    WHERE ${filter.join( " and " )}
                                    GROUP BY CASE ${getCaseBlock( 'lastname' )} END`,

                    "firstname": `SELECT top 5 CASE ${getCaseBlock( 'firstname' )} END as value, 'OWNERFIRST' as type, CASE ${getCaseBlock( 'firstname' )} END as firstname
                                    FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                    WHERE ${filter.join( " and " )}
                                    GROUP BY CASE ${getCaseBlock( 'firstname' )} END`,

                    "fullname": `SELECT top 5 CASE ${getCaseBlock( 'fullname' )} END as value,'OWNER' as type, CASE ${getCaseBlock( 'lastname' )} END as lastname, CASE ${getCaseBlock( 'firstname' )} END as firstname
                                FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                                WHERE ${filter.join( " and " )}
                                GROUP BY CASE ${getCaseBlock( 'fullname' )} END, CASE ${getCaseBlock( 'lastname' )} END, CASE ${getCaseBlock( 'firstname' )} END`

                },

                result  = await assess_pool.query( sql[ typ ] )

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