import {genError, getInvalidParams} from "$lib/api"
import {pg_escape} from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const name = url.searchParams.get( "name" ) ?? null,
            types = url.searchParams.get( "type" ) ?? "public,charter,private"

        if( name ){ 
            const { gis_pool } = locals,
                
                sql = {
                    public: `SELECT s.school as value, 'SCHOOL' as type, round(ST_X(s.shape)::NUMERIC,4) as x, round(ST_Y(s.shape)::NUMERIC,4) as y, 
                                round(ST_X(ST_Transform(s.shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.shape, 4326))::NUMERIC,4) as lat, 
                                s.school as name, s.address, s.city, NULL as state, NULL as zip, 'PUBLIC - '||s.school_typ as desc, s.grdlevl as grade_level,
                                s.school as srch_key, s.school || ' - ' || s.school_typ || ' SCHOOL' as title
                                FROM cms_schools_pt s
                                WHERE s.school ~* $$${pg_escape( name )}$$`,
                    
                    charter: `SELECT UPPER( s.name ) as value, 'SCHOOL' as type, round(ST_X(s.shape)::NUMERIC,4) as x, round(ST_Y(s.shape)::NUMERIC,4) as y, 
                                round(ST_X(ST_Transform(s.shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.shape, 4326))::NUMERIC,4) as lat, 
                                UPPER( s.name ) as name, s.address, s.city, s.state, s.zipcode::text as zip, 'CHARTER' as desc, s.grade_level,
                                UPPER( s.name ) as srch_key, UPPER( s.name ) || ' - CHARTER SCHOOL' as title
                                FROM schools_charter_pt s
                                WHERE s.name ~* $$${pg_escape( name )}$$`,

                    private: `SELECT UPPER( s.school ) as value, 'SCHOOL' as type, round(ST_X(s.shape)::NUMERIC,4) as x, round(ST_Y(s.shape)::NUMERIC,4) as y, 
                                round(ST_X(ST_Transform(s.shape, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.shape, 4326))::NUMERIC,4) as lat, 
                                UPPER( s.school ) as name, s.address, s.city, s.state, s.zip::text, 'PRIVATE' as desc, NULL as grade_level,
                                UPPER( s.school ) as srch_key, UPPER( s.school ) || ' - PRIVATE SCHOOL' as title
                                FROM schools_private_pt s
                                WHERE s.school ~* $$${pg_escape( name )}$$`

                },
                run_sql = types.split( "," )
                            .map( typ => sql[ typ ] )
                            .join( " UNION ")
                            .concat( " LIMIT 5 "),
                
                result = await gis_pool.query( run_sql )

            response = result.rows
                
        }else{
            const allowed_params = [ "name" ],
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

//Some public schools have the same but have 2 records for elementary / Primary Collinswood is an example.