import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const getFilter = ( ) => {
            let filter = "the_geom is not null"
            const aliases = [ "gisid", "pid", "common_pid", "commonpid", "groundpid", "ground_pid", "id" ]

            aliases.forEach( alias => { 
                if( url.searchParams.get( alias ) ){
                    filter += ` and pid ~* '${url.searchParams.get( alias )}'`
                    return

                }

            } )

            return filter

        },
        args = {
                columns: "pid as value, 'GISID' as type, pid as gisid",
                limit: 5,
                filter: getFilter( ),
                group: `pid`,

            },
        response = await fetch( `https://api.mcmap.org/v1/query/tax_parcels?${jsonToURL( args )}`)
        
    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}