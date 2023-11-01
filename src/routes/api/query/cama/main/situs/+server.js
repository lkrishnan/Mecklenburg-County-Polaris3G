import { genError, getInvalidParams } from "$lib/api.js"
import { filterObj, json2URL, arrHasAllElems } from "$lib/utils.js"

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
                let main_obj = main_data.reduce( ( obj, item ) => ( obj[ item.pid ] = item, obj ), { } )

                const pids = main_data.map( row => row.pid ),
                    situs_response = await fetch( `/api/query/cama/situs?pid=${pids.join( "," )}` ),
                    situs_data = await situs_response.json( )

                    situs_data.forEach( row => { 
                        if( main_obj[ row.pid ].hasOwnProperty( "situs_address" ) )
                            main_obj[ row.pid ].situs_address.push( row.situs_address )
                        else
                            main_obj[ row.pid ].situs_address = [ row.situs_address ]

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