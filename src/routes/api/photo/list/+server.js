import {genError, getInvalidParams} from "$lib/api"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    const allowed = [ "lat", "lng" ]
                
    try{
        let qry_str = { }

        allowed.forEach( key => {
            if( url.searchParams.get( key ) )
                qry_str[ key ] = url.searchParams.get( key )
                        
        } )

        if( Object.keys( qry_str ).length > 0 ){
            const {eagleview_token} = locals,
                eagleview_response = await fetch( `https://pol.pictometry.com/Gateway/v1/search/${qry_str.lat},${qry_str.lng}/${eagleview_token}` ),
                eagleview_result = await eagleview_response.json( ),
                image_id = eagleview_result.response.transactionId

            response = Object.values( eagleview_result.response.images ).map( item => ( {
                    photo_url: `${url.origin}/api/photo/image?id=${image_id}&orientation=${item[ 0 ].orientation.toLowerCase( )}`,
                    photo_view: item[ 0 ].orientation.toLowerCase( ),
                    photo_date: item[ 0 ].date,
                    photo_width: item[ 0 ].imageWidth,
                    photo_height: item[ 0 ].imageHeight,

                } ) )            

        }else{
            const invalid_params = getInvalidParams( url.searchParams, allowed ).join( ', ' )
                
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