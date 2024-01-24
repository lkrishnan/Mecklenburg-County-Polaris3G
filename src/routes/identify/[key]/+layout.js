import {error} from "@sveltejs/kit"
import {formatTitle} from "$lib/format"
import {validateStatePlane} from "$lib/validate"

/** @type {import('./$types').LayoutData} */
export async function load( {fetch, params, route} ){
    if( validateStatePlane( params.key ) ){
        const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
            response = await fetch( `/api/query/gis/project?x=${xy[0]}&y=${xy[1]}` ),
            rows = await response.json( ),
            lat = rows[ 0 ].y.toFixed( 4 ), lng = rows[ 0 ].x.toFixed( 4 ),
            usng_resp = await fetch( `/api/query/usng?lat=${lat}&lng=${lng}` ),
            usng_json = await usng_resp.json( ),
            route_parts = route.id.split( "/" )
            
        return {
            x: xy[ 0 ],
            y: xy[ 1 ],
            lat: lat,
            lng: lng,
            usng: usng_json.usng,
            dataset: route_parts[ route_parts.length -1 ],
            title: formatTitle( `${route_parts[ route_parts.length -1 ]} @ ${xy}` )

        }

    }else
        throw error( 404, { message: "Invalid coordinates passed. Unable to Identify Layers" } )

}