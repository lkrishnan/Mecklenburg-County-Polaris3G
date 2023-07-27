import { json2URL } from "$lib/utils"
import { genError, getErrorMsg } from "$lib/api.js"
import { validateNumeric } from "$lib/validate.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    try{
        let result
        const lat = url.searchParams.get( "lat" ) ?? null,
            lng = url.searchParams.get( "lng" ) ?? null
            
        if( lat && lng ){
            const noaa_response = await fetch( `https://www.ngs.noaa.gov/api/ncat/llh?lat=${lat}&lon=${lng}&eht=100.0&inDatum=nad83(1986)&outDatum=nad83(2011)` ),
                rows = await noaa_response.json( )
                        
            response = { usng: rows.usng }

        }else
            throw new Error( getErrorMsg( url.searchParams, [ "lat", "lng" ] ) )
            
    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}