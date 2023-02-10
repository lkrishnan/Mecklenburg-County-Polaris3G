import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    let response

    const pid = url.searchParams.get( "pid" ) ?? null,
        gisid = url.searchParams.get( "gisid" ) ?? null

    if( gisid ){
        const args = {
            columns: "pid as value, 'GISID' as type, pid as gisid",
            limit: 5,
            filter: `pid ~* '${gisid}' and the_geom is not null`,
            group: `pid`,

        }

        response = await fetch( `https://api.mcmap.org/v1/query/tax_parcels?${jsonToURL( args )}` )

    }else if( pid ){
        const args = {
            columns: "pid as value, 'GISID' as type, pid as gisid",
            limit: 5,
            filter: `id_Pid ~* '${pid}'`,
            group: `pid`,

        }

        response = await fetch( `https://api.mcmap.org/v1/query/cama_tb_PubLocation?${jsonToURL( args )}` )
    }

        


    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )
    
}