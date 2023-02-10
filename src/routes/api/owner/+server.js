import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const lastname = url.searchParams.get( "lastname" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            value = url.searchParams.get( "value" ) ?? "fullname",

            columns = {
                lastname: {
                    columns: "TRIM(nme_ownerlastname) as value, 'LAST NAME' as type, TRIM(nme_ownerlastname) as last_name",
                    group: "TRIM(nme_ownerlastname)",

                },
                firstname: {
                    columns: "TRIM(nme_ownerfirstname) as value, 'FIRST NAME' as type, TRIM(nme_ownerfirstname) as first_name",
                    group: "TRIM(nme_ownerfirstname)",
                
                },
                fullname: {
                    columns: "TRIM(nme_ownerlastname) || ( CASE WHEN LENGTH( COALESCE(nme_ownerfirstname, '') ) = 0 THEN '' ELSE ', ' || TRIM(nme_ownerfirstname) END ) as value, 'OWNER' as type, TRIM(nme_ownerlastname) as last_name, TRIM(nme_ownerfirstname) as first_name",
                    group: "TRIM(nme_ownerlastname), TRIM(nme_ownerfirstname)",
                
                },

            },

            getFilter = ( ) => {
                let filter = ""

                if( lastname ){
                    filter += `nme_ownerlastname like '${lastname}%'`

                }

                if( firstname ){
                    filter += `${(filter.length>0 ? ' and ' : '' )}nme_ownerfirstname like '${firstname}%'`
                }

                return filter

            },
            args = {
                ...columns[ value ],
                limit: 8,
                filter: getFilter( )
                
            },
            response = await fetch( `https://api.mcmap.org/v1/query/cama_tb_PubOwner?${jsonToURL( args )}` )

    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}