import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const stname = url.searchParams.get( "stname" ) ?? null,
        args = {
                columns: "streetname as value, 'Road' as type, streetname as streetname",
                limit: 8,
                filter: `streetname ~* $$${stname}$$`
            }
    
            console.log( `https://maps.mecklenburgcountync.gov/api/gis/v1/query/streetfile_tb?${jsonToURL( args )}` )

    const response = await fetch( `https://maps.mecklenburgcountync.gov/api/gis/v1/query/streetfile_tb?${jsonToURL( args )}`)
        
    

    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}