import {error} from "@sveltejs/kit"
import {getAPIURL} from "$lib/api"
import {last_hit, poi} from "$lib/store"
import {qrystr2srchstr} from "$lib/utils"
import {validateCNumber, validateNumeric, validateSpChar} from "$lib/validate" 

let _last_hit

last_hit.subscribe( value => _last_hit = value )

/** @type {import('./$types').LayoutData} */
export async function load( {fetch, params, route} ){
    const getUSNG = async ( lat, lng ) => {
            const usng_resp = await fetch( `/api/query/usng?lat=${lat}&lng=${lng}` ),
                usng_json = await usng_resp.json( )

            return usng_json.usng

        },
        srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( _last_hit.type === srch_type.toUpperCase( ) && _last_hit.value.toUpperCase( ) === srch_str )
        poi.set( { ..._last_hit, usng: await getUSNG( _last_hit.lat, _last_hit.lng ) } )

    else if( !validateNumeric( srch_str ) || !validateCNumber( srch_str ) ){
        const validate_resp = await fetch( getAPIURL( srch_type, srch_str ) ),
            validate_rows = await validate_resp.json( )

        if( validate_rows.length > 0 ){
            const row = validate_rows[ 0 ]
            
            poi.set( { ...row, usng: await getUSNG( row.lat, row.lng ) } )
        
        }else
            throw error( 404, { message: "Search String not found" } )

    }

}