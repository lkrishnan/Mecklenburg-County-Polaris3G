import {genError, getInvalidParams} from "$lib/api"

/** @type {import('../$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200

    const allowed = [ "lat", "lng", "gisid", "pid", "e911", "view" ]
                
    try{
        let qry_str = { }, list = [ ]

        allowed.forEach( key => {
            if( url.searchParams.get( key ) )
                qry_str[ key ] = url.searchParams.get( key )
                        
        } )

        if( Object.keys( qry_str ).length > 0 ){
            if( qry_str.hasOwnProperty( "lat" ) && qry_str.hasOwnProperty( "lat" ) ){
                const {eagleview_token} = locals,
                    eagleview_response = await fetch( `https://pol.pictometry.com/Gateway/v1/search/${qry_str.lat},${qry_str.lng}/${eagleview_token}` ),
                    eagleview_result = await eagleview_response.json( ),
                    image_id = eagleview_result.response.transactionId

                list = Object.values( eagleview_result.response.images )
                        .filter( item => ( qry_str.view ? item[ 0 ].orientation.charAt( 0 ) === qry_str.view : true ) )
                        .map( item => ( {
                            photo_url: `https://pol.pictometry.com/Gateway/v1/image/${image_id}/${item[ 0 ].orientation.charAt(0).toUpperCase()}/0/${eagleview_token}/width:1200;height:900`,
                            photo_view: `${item[ 0 ].orientation.toLowerCase( )} view`,
                            photo_date: item[ 0 ].date,
                            photo_width: item[ 0 ].imageWidth,
                            photo_height: item[ 0 ].imageHeight,

                        } ) )

            }

            if( qry_str.hasOwnProperty( "pid" ) || qry_str.hasOwnProperty( "gisid" ) ){
                const { tax_pool } = locals,
                    sql = `select replace( image_path, 'http', 'https' ) as photo_url, 'historic photo' as photo_view, to_char(to_timestamp(image_date,'YYYY-MM-DD HH24:MI:SS'), 'yyyy/mm/dd') as photo_date,
                            1200 as photo_width, 900 as photo_height
                            from sde.tb_property_photo 
                            where taxpid not in ('04728238', '02114204', '03519615') and ${( qry_str.hasOwnProperty( "pid" ) ? `taxpid='${qry_str.pid}'` : `gis_pid='${qry_str.gisid}'` )}`,
                    result = await tax_pool.query( sql )
                    list = [ ...list, ...result.rows ]

            }
            
            response = list   

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