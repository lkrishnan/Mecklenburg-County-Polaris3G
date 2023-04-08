import { error } from '@sveltejs/kit'
import { getAPIURL } from "$lib/api"
import { last_hit } from "$lib/store"
import finder from "$lib/finder"
import { qrystr2srchstr } from "$lib/utils"
import { validateCNumber, validateOnlyAlpha, validateOwnerName, validateAddress, validateNumeric, validateTaxPID, validateIntersection } from "$lib/validate" 

let _last_hit

last_hit.subscribe( value => _last_hit = value )

/** @type {import('./$types').LayoutData} */
export async function load({ fetch, params, route }) {
    const match = route.id.match( /(address|business|gisid|intersection|library|owner|park|pid|road|school)/ig )

    if( match ){
        const srch_str = qrystr2srchstr( params.key ),
            srch_type = match [ 0 ]

        if( _last_hit.type === srch_type.toUpperCase( ) && _last_hit.value === srch_str  )
            finder( _last_hit, fetch )

        else{ // Validate query string then call finder
            // Check for bad search strings
            if( ( srch_type === "address" && !validateAddress( srch_str ) ) ||
                ( srch_type === "intersection" && !validateIntersection( srch_str ) ) ||
                ( srch_type === "intersection" && !validateIntersection( srch_str ) ) ||
                ( srch_type === "owner" && ! validateOwnerName( srch_str ) ) ||
                [ "park", "library", "school", "business", "busstop", "lightrail" ].includes( srch_type ) && validateNumeric( srch_str ) && validateCNumber( srch_str ) ){
                throw error( 404, { message: "Search String not found" } )

            }else{
                const result = await fetch( ( srch_type === "address" ? `/api/address?fulladdr=${srch_str}` : getAPIURL( srch_type, srch_str ) ) ),
                rows = await result.json( )
    
                if( rows.length > 0)
                    finder( rows[ 0 ], fetch )

                else
                    throw error( 404, { message: "Search String not found" } )

            }

	    }

    }else{
        console.log( "handle this")
        //throw error( 404, { message: 'Not found ootha' } )

    }

}