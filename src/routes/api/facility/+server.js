import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"
import {removeArrayDups} from "$lib/utils.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    let args, api_url

    const srch_str = url.searchParams.get( "name" ) ?? null,
        facility_type = url.searchParams.get( "type" ) ?? null,
        getArgs = ( typ, srch_str ) => {
            const args = {
                park: {
                    columns: `prkname as value, 'PARK' as type, round(ST_X(p.the_geom)::NUMERIC,4) as x, round(ST_Y(p.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lat, t.pid as gisid, prkaddr as address`,
                    limit: 5,
                    filter: `prkname ilike '%${srch_str}%' and p.the_geom && t.the_geom`,
                
                },
                library: {
                    columns: `name as value, 'LIBRARY' as type, round(ST_X(l.the_geom)::NUMERIC,4) as x, round(ST_X(l.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, address`,
                    limit: 5,
                    filter: `name ilike '%${srch_str}%' and l.the_geom && p.the_geom`,
                
                },
                public_school: {
                    columns: `s.schlname as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' ||s.city as address, s.type as desc`,
                    limit: 5,
                    filter: `s.schlname ilike '%${srch_str}%' and s.the_geom && p.the_geom`,
                
                },
                charter_school: {
                    columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                    limit: 5,
                    filter: `s.school ilike '%${srch_str}%' and s.the_geom && p.the_geom`,
                    
                },
                private_school: {
                    columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                    limit: 5,
                    filter: `s.school ilike '%${srch_str}%' and s.the_geom && p.the_geom`
                    
                },
                business: {
                    columns: `b.company as value, 'BUSINESS' as type, round(ST_X(b.the_geom)::NUMERIC,4) as x, round(ST_X(b.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, b.address || ' ' || b.city || ' ' || b.state || ' ' || b.zip as address`,
                    limit: 5,
                    filter: `b.company ilike '%${srch_str}%' and b.the_geom && p.the_geom`
                    
                },

            }

            return args[ typ ]
            
        },
        getURL = typ => {
            const urls = {
                    park: `https://api.mcmap.org/v1/query/parks p, tax_parcels t?${jsonToURL( getArgs( 'park', srch_str ) )}`,
                    library: `https://api.mcmap.org/v1/query/libraries l, tax_parcels p?${jsonToURL( getArgs( 'library', srch_str ) )}`,
                    public_school: `https://api.mcmap.org/v1/query/schools s, tax_parcels p?${jsonToURL( getArgs( 'public_school', srch_str ) )}`,
                    charter_school: `https://api.mcmap.org/v1/query/charter_schools s, tax_parcels p?${jsonToURL( getArgs( 'charter_school', srch_str ) )}`,
                    private_school: `https://api.mcmap.org/v1/query/schools_private s, tax_parcels p?${jsonToURL( getArgs( 'private_school', srch_str ) )}`,
                    business: `https://api.mcmap.org/v1/query/businesswise_businesses b, tax_parcels p?${jsonToURL( getArgs( 'buisness', srch_str ) )}`,

                }

        }
        //check_types = ( facility_type.length > 0 ? facility_type : removeArrayDups( [ ...facility_type, ...[ "park", "library" ] ] ) )

    console.log( facility_type )
        
    /*const response = await fetch( api_url )
        
    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )*/

}