import { error } from "@sveltejs/kit"
import jsonToURL from "$lib/jsontourl"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, fetch } ) => {
    const pid = url.searchParams.get( "pid" ) ?? null,
        gisid = url.searchParams.get( "gisid" ) ?? null,
        info = url.searchParams.get( "info" ) ?? null,

        getArgs = ( info, typ, id ) => {
            const filter_cols = {
                geom: {
                    gisid: {
                        columns: `pid as value, 'GISID' as type, pid as gisid, ST_AsText( the_geom ) as parcelgeom, ST_Area( the_geom ) As sqft`,
                        filter: `pid ~* '${id}' and the_geom is not null`,

                    }
                    
                }
                
            }

            return { }

        }, 



        getArgs = ( info, typ, id ) => {
            const args = {
                geom: {
                    pid: {
                        columns: ,
                        limit: 5,
                        filter: getFilter( info, typ, id ),

                    },
                    gisid: {
                        columns: `pid as value, 'GISID' as type, pid as gisid`,
                        limit: 5,
                        filter: getFilter( info, typ, id ),

                    }
                    
    
                }
            }
            
            return {
                columns: 

                }

        },



        getArgs = ( info, pid, gisid ) => {
            const args = {
                park: {
                    columns: `pid as value, 'GISID' as type, pid as gisid`,
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

        response = await fetch( getURL( info, ( pid ? 'pid' : 'gisid' ), ( pid ? pid : gisid ) ) )


        response = await fetch( `https://api.mcmap.org/v1/query/tax_parcels?${jsonToURL( args )}`)
        
    if( response.ok ){
        const data = await response.json( )
        
        return new Response( JSON.stringify( data ), { status: 200 } )

    }

    const err = await response.json( )

    throw error( response.status, err.message )

}