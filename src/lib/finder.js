import { selection, results } from "$lib/store"
import human from "$lib/human"
import { filterObj, json2URL } from "$lib/utils"

export default async function finder( filter, fetch ){
    console.log( filter )
    try{
        /********************** */
        // HAS MATID, PID, GISID 
        /********************** */
        if( [ "matid", "pid", "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){ 
            console.log( "No 1")
            if( !filter.hasOwnProperty( "geom" ) ){
                // Get sqft and parcelgeom
                const response = await fetch( `/api/parcel/geometry?${json2URL( { gisid: filter.gisid } )}` ),
                    rows = await response.json( )

                if( rows.length > 0 )
                    filter = { ...filter, geom: rows[ 0 ].geom, sqft: rows[ 0 ].sqft }

            }
            
            selection.set( filter )
        
        }
        
        /****************** */
        // HAS MATID, PID 
        /***************** */
        else if( [ "matid", "pid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 2")
            // Get GIS ID
            const response = await fetch( `/api/parcel/geometry?${json2URL( { pid: filter.pid } )}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )
            
            else // The parcel hasn't been mapped yet (this case is very rare)
                selection.set( filter )
    
        }
        
        /***************** */
        // HAS MATID, GISID 
        /***************** */
        else if( [ "matid", "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 3")
            // Get situs
            const response = await fetch( `/api/parcel/situs?${json2URL( { gisid: filter.gisid } )}` ),
                rows = await response.json( )      

            if( rows.length > 0 ){
                // Find the index of the returned situs row that matches MAT information in the filter
                // Either the matpid and situs pid should match or the mat address and situs address should be similar
                const match = rows.findIndex( row => ( row.pid == filter.matpid || [ row.house_number, row.street_name ].some( str => filter.address.includes( str ) ) ) && ( true ) )
                                                         
                if( match > -1 )
                    finder( { ...filter, pid: rows[ match ].pid }, fetch )
                    
                else // Parcel might not be mapped yet (address with reserved parcel). Request manual input.
                    throw "to_human"
                
            }else // Parcel might not be mapped yet (address with reserved parcel). Request manual input.
                throw "to_human"
            
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
                    throw "with_no_mat"
                
            }else // Unable to find an address point within the ground parcel, must be a vacant parcel
                throw "with_no_mat"
            
        }
        
        /********** */
        // Has MATID
        /********** */
        else if( [ "matid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 5")
            // Get GIS ID and geometry
            const response = await fetch( `/api/parcel/geometry?matid=${filter.matid}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else // Unable to find an intersecting ground parcel. Request manual input.
                throw "to_human"
            
        }

        /********** */
        // Has GIS ID
        /********** */
        else if( [ "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){
            console.log( "No 6")
            const response = await fetch( `/api/parcel/switcher?gisid=${filter.gisid}` ),
                rows = await response.json( )

            if( rows.length > 1 )
                throw "to_human"
                
            else if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else
                throw "hands_up"
                

        }
        
    }catch( exception ){
        switch( exception ){
            case "to_human":
                human( filter )
                break

            case "hands_up":
                console.log( "show unable to find page" )
                break

            case "with_no_mat":
                if( !filter.hasOwnProperty( "geom" ) ){
                    // Get sqft and parcelgeom
                    const response = await fetch( `/api/parcel/geometry?${json2URL( { gisid: filter.gisid } )}` ),
                        rows = await response.json( )

                    if( rows.length > 0 )
                        filter = { ...filter, geom: rows[ 0 ].geom, sqft: rows[ 0 ].sqft }

                }

                selection.set( filter )

                break

        }
                
    }

}