import { genError, getInvalidParams } from "$lib/api.js"
import { json2URL, filterObj } from "$lib/utils"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let params = Object.fromEntries( url.searchParams )

        if( Object.keys( params ).length > 0 ){
            const { assess_pool } = locals,
                main_response = await fetch( `/api/query/cama/main?${json2URL( params )}` ),
                main_data = await main_response.json( )

            if( main_data.length > 0 ){
                let main_obj = main_data.reduce( ( obj, item ) => ( obj[ item.assessproid ] = item, obj ), { } )

                const assessproids = main_data.map( row => row.assessproid ).join( "," ),
                    urls = [ 
                        `/api/query/cama/situs?assessproid=${assessproids}`, 
                        `/api/query/cama/building?assessproid=${assessproids}`, 
                    ],
                    jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )

                jsons.forEach( ( rows, idx ) => {
                    rows.forEach( row => {
                        switch( idx ){
                            case 0:
                                if( main_obj[ row.assessproid ]?.situs_address )
                                    main_obj[ row.assessproid ].situs_address.push( row.situs_address )
                                else
                                    main_obj[ row.assessproid ].situs_address = [ row.situs_address ]

                                break

                            case 1:
                                let bldg = { 
                                    bldg_seq: row.bldg_seq,
                                    total_square_feet: row.total_square_feet, 
                                    year_built: row.year_built, 
                                    bedrooms: row.bedrooms, 
                                    full_baths: row.full_baths,
            
                                }
                            
                                if( main_obj[ row.assessproid ]?.bldgs )
                                    main_obj[ row.assessproid ].bldg.push( bldg )
                                else
                                    main_obj[ row.assessproid ].bldg = [ bldg ]
                                break
                        }

                    } )

                } )

                response = Object.values( main_obj )
                
            }else
                response = main_data

        }else{
            response = genError( { "message": `No paramater(s) sent` } )
            status = 500 

        }
         
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}