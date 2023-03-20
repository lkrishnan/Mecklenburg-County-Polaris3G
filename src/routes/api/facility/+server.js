import { error } from "@sveltejs/kit"
import { json2URL } from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const name = url.searchParams.get( "name" ) ?? null,
        typ = url.searchParams.get( "type" ) ?? null,

        getArgs = ( typ, name ) => {
            const args = {
                park: {
                    columns: `prkname as value, 'PARK' as type, round(ST_X(p.the_geom)::NUMERIC,4) as x, round(ST_Y(p.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lat, t.pid as gisid, prkaddr as address`,
                    limit: 5,
                    filter: `prkname ilike '%${name}%' and p.the_geom && t.the_geom`,
                
                },
                library: {
                    columns: `name as value, 'LIBRARY' as type, round(ST_X(l.the_geom)::NUMERIC,4) as x, round(ST_X(l.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, address`,
                    limit: 5,
                    filter: `name ilike '%${name}%' and l.the_geom && p.the_geom`,
                
                },
                public_school: {
                    columns: `s.schlname as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' ||s.city as address, s.type as desc`,
                    limit: 5,
                    filter: `s.schlname ilike '%${name}%' and s.the_geom && p.the_geom`,
                
                },
                charter_school: {
                    columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                    limit: 5,
                    filter: `s.school ilike '%${name}%' and s.the_geom && p.the_geom`,
                    
                },
                private_school: {
                    columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                    limit: 5,
                    filter: `s.school ilike '%${name}%' and s.the_geom && p.the_geom`
                    
                },
                business: {
                    columns: `b.company as value, 'BUSINESS' as type, round(ST_X(b.the_geom)::NUMERIC,4) as x, round(ST_X(b.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, b.address || ' ' || b.city || ' ' || b.state || ' ' || b.zip as address`,
                    limit: 5,
                    filter: `b.company ilike '%${name}%' and b.the_geom && p.the_geom`
                    
                },

            }

            return args[ typ ]
            
        },
        
        getURL = ( typ, name ) => {
            const urls = {
                    park: `https://api.mcmap.org/v1/query/parks p, tax_parcels t?${json2URL( getArgs( typ, name ) )}`,
                    library: `https://api.mcmap.org/v1/query/libraries l, tax_parcels p?${json2URL( getArgs( typ, name ) )}`,
                    public_school: `https://api.mcmap.org/v1/query/schools s, tax_parcels p?${json2URL( getArgs( typ, name ) )}`,
                    charter_school: `https://api.mcmap.org/v1/query/charter_schools s, tax_parcels p?${json2URL( getArgs( typ, name ) )}`,
                    private_school: `https://api.mcmap.org/v1/query/schools_private s, tax_parcels p?${json2URL( getArgs( typ, name ) )}`,
                    business: `https://api.mcmap.org/v1/query/businesswise_businesses b, tax_parcels p?${json2URL( getArgs( typ, name ) )}`,

                }

            return urls[ typ ]

        },
        response = await fetch( getURL( typ, name ) )
        
        
    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}