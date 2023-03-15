import jsonToURL from "$lib/jsontourl"
import { selection, results } from "$lib/store"
import human from "$lib/human"
import { filterObj } from "$lib/utils"

export default async function finder( filter, fetch ){
    console.log( filter )
    try{

        const addgeom = async ( ) => {
            const response = await fetch( `/api/parcel/geometry?${jsonToURL( { gisid: filter.gisid } )}` ),
                    rows = await response.json( )

            if( rows.length > 0 )
                selection.set( { ...filter, geom: rows[ 0 ].geom, sqft: rows[ 0 ].sqft } )

            else
                selection.set( filter )

        }

        /**************** */
        // HAS Everything!
        /**************** */
        if( [ "matid", "pid", "gisid", "geom" ].every( key => filter.hasOwnProperty( key ) ) ){ 
            console.log( "No 0")
            selection.set( filter )

        }
        
        /********************** */
        // HAS MATID, PID, GISID 
        /********************** */
        else if( [ "matid", "pid", "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){ 
            console.log( "No 1")
            // Get sqft and parcelgeom
            const response = await fetch( `/api/parcel/geometry?${jsonToURL( { gisid: filter.gisid } )}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, geom: rows[ 0 ].geom, sqft: rows[ 0 ].sqft }, fetch )
                
        }
        
        /****************** */
        // HAS MATID, PID 
        /***************** */
        else if( [ "matid", "pid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 2")
            // Get GIS ID
            const response = await fetch( `/api/parcel/geometry?${jsonToURL( { pid: filter.pid } )}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )
            
            else
                selection.set( filter )
    
        }
        
        /***************** */
        // HAS MATID, GISID 
        /***************** */
        else if( [ "matid", "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 3")
            // Get situs
            const response = await fetch( `/api/parcel/situs?${jsonToURL( { gisid: filter.gisid } )}` ),
                rows = await response.json( )      

            if( rows.length > 0 ){
                // Find the index of the returned situs row that matches MAT information in the filter
                // Either the matpid and situs pid should match or the mat address and situs address should be similar
                const match = rows.findIndex( row => ( row.pid == filter.matpid || [ row.house_number, row.street_name ].some( str => filter.address.includes( str ) ) ) && ( true ) )
                                                         
                if( match > -1 )
                    finder( { ...filter, pid: rows[ match ].pid }, fetch )
                    
                else // Parcel might not be mapped yet (address with reserved parcel). Ask human for manual input
                    human( { 
                        ...filterObj( filter, [ "x", "y", "lat", "lng", "type", "value", "address", "matid" ] ), 
                        location: true 
                    }, fetch )
                
            }else // Parcel might not be mapped yet (address with reserved parcel). Ask human for manual input
                human( { 
                    ...filterObj( filter, [ "x", "y", "lat", "lng", "type", "value", "address", "matid" ] ), 
                    location: true 
                }, fetch )
            
        }
        
        /****************** */
        // Has GISID and PID
        /****************** */
        else if( [ "gisid", "pid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 4")
            // Get MAT ID
            const response = await fetch( `/api/address?gisid=${filter.gisid}` ),
                rows = await response.json( )      

            if( rows.length === 1 )
                // There is only one address within the ground parcel. So go with it!
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else if( rows.length > 1 ){
                // Find the index of the returned MAT row that matches the PID information in the filter
                const match = rows.findIndex( row => ( row.matpid === filter.pid ) && ( true ) ) 

                if( match > -1 )
                    finder( { ...filter, ...rows[ match ] }, fetch )
                    
                else // The MAT PID might be bad, let the user pick the right MAT in the property details card
                    addgeom( )
                
            }else // Unable to find an address point within the ground parcel, must be a vacant parcel
                addgeom( )
            
        }
        
        /********** */
        // Has MATID
        /********** */
        else if( [ "matid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 5")
            // Get MAT ID
            const response = await fetch( `/api/parcel/geometry?matid=${filter.matid}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else{ // Unable to find an intersecting ground parcel, show nearby ground parcels and ask user to manually pick one.
                const geom_resp = await fetch( `/api/parcel/geometry/nearby?x=${filter.x }&y=${filter.y}` ),
                    geom_rows = await geom_resp.json( ),
                    gisid = geom_rows.reduce( ( a, row ) => [ ...a, row.gisid ], [ ] ).join(",")
                    
                //if( gisid.includes( "," ) )

                console.log( geom_resp, geom_rows, gisid )

            }

            
        }
        
    }catch( err ){
        return { type: "error",  "msg": err }
        
    }

}