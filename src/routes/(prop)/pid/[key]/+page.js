/** @type {import('./$types').PageDataData} */

import {error} from "@sveltejs/kit"
import finder from "$lib/finder"
import {qrystr2srchstr} from "$lib/utils"
import {validateSpChar, validateTaxPID} from "$lib/validate" 

export async function load( {fetch, params, route} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ]

    if( !validateTaxPID( srch_str ) )
        throw error( 404, { message: `Polaris 3G can't find anything. Enter a valid Tax PID` } )

    const hit = { type: srch_type, pid: srch_str, page: 1 },
        rows = await finder( hit, fetch )

    if( rows.length === 0 )
        throw error( 404, { message: `Polaris 3G can't find Tax PID: ${srch_str}. Enter a valid Tax PID` } )
        
    return { 
        hit: hit, 
        results: rows, 
        idx: ( rows.length === 1 ? 0 : -1 ), 
        view: "ownership",
        poi: { }

    }

}