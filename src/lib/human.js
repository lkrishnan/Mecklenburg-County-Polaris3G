import { json2URL } from "$lib/utils"
import { selection, results } from "$lib/store"

export default async function human( filter, fetch ){
    try{
        console.log( "human", filter )
        if( [ "x", "y" ].every( key => filter.hasOwnProperty( key ) ) ){
            
        }

        else if( [ "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){
            
        }
        
    }catch( err ){
        return { type: "error",  "msg": err }

    }

}


// Unable to find an intersecting ground parcel, show nearby ground parcels and ask user to manually pick one.
//const geom_resp = await fetch( `/api/parcel/geometry/nearby?x=${filter.x }&y=${filter.y}` ),
//geom_rows = await geom_resp.json( ),
//gisid = geom_rows.reduce( ( a, row ) => [ ...a, row.gisid ], [ ] ).join(",")

//if( gisid.includes( "," ) )

//console.log( geom_resp, geom_rows, gisid )

//}