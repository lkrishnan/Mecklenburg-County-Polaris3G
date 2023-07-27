import { selection, results, messenger } from "$lib/store"
import human from "$lib/human"
import { filterObj, json2URL, removeArrayDups } from "$lib/utils"
import { getGeom, getGeomAsTxt  } from "$lib/mapping"

export default async function finder( filter, fetch ){
    try{
        /********************** */
        // HAS MATID, PID, GISID 
        /********************** */
        if( [ "matid", "pid", "gisid" ].every( key => filter.hasOwnProperty( key ) ) ){ 
            if( !filter.hasOwnProperty( "geom" ) ){
                // Get sqft and parcelgeom
                const response = await fetch( `/api/query/gis/parcel_geom?${json2URL( { gisid: filter.gisid } )}` ),
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
            // Get GIS ID
            const response = await fetch( `/api/query/gis/parcel_geom?${json2URL( { pid: filter.pid } )}` ),
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
            // Get situs
            const response = await fetch( `/api/query/cama/situs?${json2URL( { gisid: filter.gisid } )}` ),
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
            // Get MAT ID
            const response = await fetch( `/api/query/gis/address?gisid=${filter.gisid}` ),
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

        /****************** */
        // Has GISID and buffer
        /****************** */
        else if( [ "gisid", "buffer" ].every( key => filter.hasOwnProperty( key ) ) ){
            const params = {
                table: "parcels_py",
                columns: "pid as gisid",
                filter: `ST_DWithin( shape, (select shape from parcels_py where pid = '${filter.gisid}' ), ${filter.buffer} )`
            }
            const response = await fetch( `/api/query/gis?${json2URL( params )}` ),
                rows = await response.json( )

            if( rows.length > 1 ){
                const resp = await fetch( `/api/query/cama/situs/ownership?gisid=${rows.map( row => row.gisid )}` ),
                    result_rows = await resp.json( )

                results.set( result_rows )
                messenger.set( [ { type: "add_buffer_graphic", gisid: filter.gisid, buffer: filter.buffer } ] )

            }

            else if( rows.length > 0 )
                finder( { value: filter.gisid, type: "gisid", gisid: filter.gisid }, fetch )

            else
                throw "hands_up"

        }
        
        /********** */
        // Has MATID
        /********** */
        else if( [ "matid" ].every( key => filter.hasOwnProperty( key ) ) ){
            // Get GIS ID and geometry
            const response = await fetch( `/api/query/gis/parcel_geom?matid=${filter.matid}` ),
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
            const response = await fetch( `/api/query/cama/switcher?gisid=${filter.gisid}` ),
                rows = await response.json( )

            if( rows.length > 1 )
                throw "to_human"
                
            else if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else
                throw "hands_up"
                

        }

        /********** */
        // Has ownername
        /********** */
        else if( [ "lastname", "firstname" ].some( key => filter.hasOwnProperty( key ) ) ){
            const params = Object.keys( filter )
                            .filter( key => [ "lastname", "firstname" ].includes( key ) )
                            .reduce( ( cur, key ) => { return Object.assign( cur, { [ key ]: filter[ key ] } ) }, { } ),
                response = await fetch( `/api/query/cama/owner?${json2URL( params )}` ),
                rows = await response.json( ),
                unique_pids = removeArrayDups( rows.map( row => row.pid ) )
            
            if( unique_pids.length > 1 ){
                //throw "to_human"
                const response = await fetch( `/api/query/cama/situs/ownership?lastname=${(filter.hasOwnProperty( "lastname" ) ? filter.lastname : "" ) }&firstname=${(filter.hasOwnProperty( "firstname" ) ? filter.firstname : "" ) }` ),
                    rows = await response.json( )
            
                results.set( rows )

            }
                
            else if( unique_pids.length > 0 )
                finder( { ...filter, pid: rows[ 0 ].pid, gisid: rows[ 0 ].gisid }, fetch )

            else
                throw "hands_up"

        }

        /********** */
        // Has STCODE
        /********** */
        else if( [ "stcode" ].every( key => filter.hasOwnProperty( key ) ) ){
            const keys = [ "prefix", "stname", "sttype", "suffix" ]

            let params = { }

            keys.forEach( key => {
                if( filter[ key ] )
                    params[ key ] = filter[ key ]

            } )
            
            const response = await fetch( `/api/query/cama/situs/ownership?${json2URL( params )}` ),
                rows = await response.json( )

            if( rows.length > 1 ){
                results.set( rows )
                messenger.set( [ { type: "add_road_graphic", stcode: filter.stcode } ] )

            }
            
            else if( rows.length > 0 )
                finder( { ...filter, gisid: rows[ 0 ].gisid, pid: row[ 0 ].pid }, fetch )

            else
                throw "hands_up"
                        
        }

        /********** */
        // Has XCoord and YCoord
        /********** */
        else if( [ "x", "y" ].every( key => filter.hasOwnProperty( key ) ) || [ "lat", "lng" ].every( key => filter.hasOwnProperty( key ) ) ){
            const params = Object.keys( filter )
                            .filter( key => [ "x", "y", "lat", "lng" ].includes( key ) )
                            .reduce( ( cur, key ) => { return Object.assign( cur, { [ key ]: filter[ key ] } ) }, { } ),
                response = await fetch( `/api/query/gis/parcel_geom?${json2URL( params )}` ),
                rows = await response.json( )

            if( rows.length > 1 ){
                filter = { ...filter, gisid: rows.map( row => row.gisid ) }
                //throw "to_human"
                const response = await fetch( `/api/query/cama/situs/ownership?gisid=${filter.gisid}` ),
                rows = await response.json( )

                results.set( rows )
                
            }
                
                
            else if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else
                throw "hands_up"


                                
        }

        /********** */
        // Has Nearby
        /********** */
        else if( [ "nearby" ].every( key => filter.hasOwnProperty( key ) ) ){
            const coords = filter.nearby.split( "," ),
                response = await fetch( `/api/query/gis/parcel_geom/nearby?x=${coords[ 0 ]}&y=${coords[ 1 ]}` ),
                rows = await response.json( )

            if( rows.length > 1 ){
                filter = { ...filter, gisid: rows.map( row => row.gisid ) }
                const response = await fetch( `/api/query/cama/situs/ownership?gisid=${filter.gisid}` ),
                rows = await response.json( )

                results.set( rows )

            }
                
                
            else if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else
                throw "hands_up"

        }

        /********** */
        // Has Rings
        /********** */
        else if( [ "rings" ].every( key => filter.hasOwnProperty( key ) ) ){
            let response, rows

   
            const params = {
                    table: "parcels_py",    
                    columns: "pid as gisid",
                    filter: `ST_DWithin(shape, ST_GeomFromText('${getGeomAsTxt( filter.rings )}',2264), 0 )`,
                    limit: 100
                }
            response = await fetch( `/api/query/gis?${json2URL(params)}` )
            rows = await response.json( )

            if( rows.length > 1 ){   
                filter = { ...filter, gisid: rows.map( row => row.gisid ) }
                
                response = await fetch( `/api/query/cama/situs/ownership?gisid=${filter.gisid}` )
                rows = await response.json( )

                results.set( rows )

            }

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
                    const response = await fetch( `/api/query/gis/parcel_geom?${json2URL( { gisid: filter.gisid } )}` ),
                        rows = await response.json( )

                    if( rows.length > 0 )
                        filter = { ...filter, geom: rows[ 0 ].geom, sqft: rows[ 0 ].sqft, centroid_x: rows[ 0 ].centroid_x, centroid_y: rows[ 0 ].centroid_y, centroid_lat: rows[ 0 ].centroid_lat, centroid_lon: rows[ 0 ].centroid_lon, }

                }

                selection.set( filter )

                break

        }
                
    }

}