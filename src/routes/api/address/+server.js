import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const addr = url.searchParams.get( "addr" ) ?? null,
        args = {
                columns: "full_address as value, 'ADDRESS' as type, objectid as matid, groundpid as gisid, round(ST_X(the_geom)::NUMERIC,4) as x, round(ST_Y(the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address",
                limit: 8,
                filter: `ts @@ to_tsquery('addressing_en', '${addr.toUpperCase().replace(/ /g, '&') + ':*'}')
                        and txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )
                            and the_geom is not null`
            },
        response = await fetch( `https://api.mcmap.org/v1/query/master_address_table?${jsonToURL( args )}`)

    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200, statusText: "OK" } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}