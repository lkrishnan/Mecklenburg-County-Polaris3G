/** @type {import('./$types').PageDataData} */
import {error} from "@sveltejs/kit"
import {getAnlyzAllowedParams} from "$lib/formhelp"
import finder from "$lib/finder"
import {arrHasAllElems, qrystr2srchstr, URL2Obj} from "$lib/utils"
import {validateSpChar} from "$lib/validate" 

export async function load( {fetch, params, route, url} ){
    const srch_str = qrystr2srchstr( params.key ),
        srch_type = route.id.split( "/" ).filter( item => !validateSpChar( item ) && item.length > 0 )[ 0 ],
        passed_params = URL2Obj( url.search )

    if( !arrHasAllElems( getAnlyzAllowedParams( ), Object.keys( passed_params ) ) )
        throw error( 404, { message: `Polaris 3G can't work with passed params. Redo Market Analysis.` } )

    const hit = { type: srch_type, ...passed_params, page: 1 },
        rows = await finder( hit, fetch )

    return { 
            hit: hit, 
            results: rows, 
            idx: ( rows.length === 1 ? 0 : -1 ), 
            view: "property",
            poi: { }, 

        }
    
}