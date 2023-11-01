import { json2URL } from "$lib/utils"
import { rsltados, poi } from "$lib/store"

export default async function human( filter ){
    try{
        if( [ "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){
            const response = await fetch( `/api/query/cama/main/situs?gisid=${filter.gisid}` ),
                rows = await response.json( )

            rsltados.set( rows )

        }

        else if( [ "lastname", "firstname" ].some( key => filter.hasOwnProperty( key ) ) ){
            const response = await fetch( `/api/query/cama/main/situs?lastname=${(filter.hasOwnProperty( "lastname" ) ? filter.lastname : "" ) }&firstname=${(filter.hasOwnProperty( "firstname" ) ? filter.firstname : "" ) }` ),
                rows = await response.json( )
            
            rsltados.set( rows )

        }
        
    }catch( err ){
        return { type: "error",  "msg": err }

    }

}


// Unable to find an intersecting ground parcel, show nearby ground parcels and ask user to manually pick one.
//const geom_resp = await fetch( `/api/query/gis/parcel_geom/nearby?x=${filter.x }&y=${filter.y}` ),
//geom_rows = await geom_resp.json( ),
//gisid = geom_rows.reduce( ( a, row ) => [ ...a, row.gisid ], [ ] ).join(",")

//if( gisid.includes( "," ) )

//console.log( geom_resp, geom_rows, gisid )

//}