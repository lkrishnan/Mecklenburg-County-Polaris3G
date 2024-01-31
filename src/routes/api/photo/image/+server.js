import {getStreamAsArrayBuffer} from "get-stream"
import {genError, getInvalidParams} from "$lib/api"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, options = { status: 200 }

    const allowed = [ "id", "orientation" ]
                
    try{
        let qry_str = { }

        allowed.forEach( key => {
            if( url.searchParams.get( key ) )
                qry_str[ key ] = url.searchParams.get( key )
                        
        } )

        if( Object.keys( qry_str ).length > 0 ){
            const {eagleview_token} = locals,
                {body: readableStream} = await fetch(`https://pol.pictometry.com/Gateway/v1/image/${qry_str.id}/${qry_str.orientation.charAt(0).toUpperCase()}/0/${eagleview_token}/width:1000;height:600`)

            response = Buffer.from( await getStreamAsArrayBuffer(readableStream) )
            options = { ...options, headers: { "Content-Type": "image/jpg" } }

        }else{
            const invalid_params = getInvalidParams( url.searchParams, allowed ).join( ', ' )
                
            response = genError( { "message": `invalid paramater(s) sent: ${invalid_params}` } )
            status = 500 
            
        }

    }catch( err ){
		response =  JSON.stringify( genError( { "message": err.message, "code": err.code } ) )
        options.status = 500

    }finally{
        return new Response( response, options )

    }

}