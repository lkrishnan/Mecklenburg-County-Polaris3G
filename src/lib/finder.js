import { messenger, rsltados, historia } from "$lib/store"
import human from "$lib/human"
import { filterObj, json2URL, removeArrayDups, srchstr2qrystr } from "$lib/utils"
import { getGeom, getGeomAsTxt  } from "$lib/mapping"

let _historia, _rsltados

export default async function finder( filter, fetch ){
    try{
        //from "back to results" button
        if( _historia.rsltados.length > 0 && 
            ( _historia.hit?.type ? ( filter.type === _historia.hit.type ) : false ) && 
            ( _historia.hit?.value ? ( filter.value === _historia.hit.value ) : false ) &&
            ( _historia.hit?.page ? ( filter.page === _historia.hit.page ) : false ) ){    
                // use the stores results to prevent a duplicate request to the server
                rsltados.set( _historia.rsltados )

        }
        
        /********************** */
        // HAS MATID, PID, GISID 
        /********************** */
        else if( filter?.matid && filter?.pid && filter?.gisid ){ 
            if( !filter.hasOwnProperty( "geom" ) ){
                // Get sqft and parcelgeom
                const response = await fetch( `/api/query/gis/parcel_geom?${json2URL( { gisid: filter.gisid } )}` ),
                    rows = await response.json( )

                if( rows.length > 0 )
                    filter = { ...filter, geom: rows[ 0 ].geom }

            }

            rsltados.set( [ filter ] )
        
        }
        
        /****************** */
        // HAS MATID, PID 
        /***************** */
        else if( filter?.matid && filter?.pid ){ 
            // Get GIS ID
            const response = await fetch( `/api/query/gis/parcel_geom?${json2URL( { pid: filter.pid } )}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )
            
            else // The parcel hasn't been mapped yet (this case is very rare)
                rsltados.set( [ filter ] )
    
        }
        
        /***************** */
        // HAS MATID, GISID 
        /***************** */
        else if( filter?.matid && filter?.gisid ){ 
            // Get situs
            const response = await fetch( `/api/query/cama/situs${filter.view === "property" ? "/building" : ""}?${json2URL( { gisid: filter.gisid } )}` ),
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
        else if( filter?.gisid && filter?.pid ){ 
            // Get MAT ID
            const response = await fetch( `/api/query/gis/address?gisid=${filter.gisid}` ),
                rows = await response.json( )      

            if( rows.length > 1 ){
                // Find the index of the returned MAT row that matches the PID information in the filter
                const match = rows.findIndex( row => ( row.matpid === filter.pid ) && ( true ) ) 

                if( match > -1 )
                    finder( { ...filter, ...rows[ match ] }, fetch )
                    
                else // The MAT PID might be bad, let the user pick the right MAT in the property details card
                    throw "with_no_mat"
                
            } else if( rows.length > 0 )
                // There is only one address within the ground parcel. So go with it!
                finder( { ...filter, ...rows[ 0 ] }, fetch )
            else // Unable to find an address point within the ground parcel, must be a vacant parcel
                throw "with_no_mat"
            
        }

        /********** */
        // Has MATID
        /********** */
        else if( filter?.matid ){ 
            // Get GIS ID and geometry
            const response = await fetch( `/api/query/gis/parcel_geom?matid=${filter.matid}` ),
                rows = await response.json( )

            if( rows.length > 0 )
                finder( { ...filter, ...rows[ 0 ] }, fetch )

            else // Unable to find an intersecting ground parcel. Request manual input.
                throw "to_human"
            
        }

        else{ // prop_use, buffer, gisid, firstname, lastname, stcode, xy, latlng, nearby, rings 
            let params = { }
            
            Object.keys( filterObj( filter, [ "value", "type", "view", "stcode", "juris", "prefix", "stname", "sttype", "suffix" ], false ) ).forEach( key => { 
                switch( key ){
                    case "road":
                        params.situs_address = filter[ key ].replace( ",", "" )
                        break

                    case "rings":
                        params[ key ] = getGeomAsTxt( filter[ key ] )
                        break

                    default:
                        params[ key ] = filter[ key ]
                }    

            } )
            
            //const resp = await fetch( `/api/query/cama/main/situs${filter.view === "property" ? "/building" : ""}?${json2URL( params )}` ),
            const resp = await fetch( `/api/bolt/cama?${json2URL( params )}` ),
                rows = await resp.json( )
                
            // Add Graphic
            if( rows.length > 0 ){
                if( filter?.buffer )
                    messenger.set( [ { type: "add_buffer_graphic", gisid: filter.gisid, buffer: filter.buffer } ] )

                else if( filter?.stcode ) 
                    messenger.set( [ { type: "add_road_graphic", stcode: filter.stcode } ] )

            }
                              
            // Show data
            if( rows.length > 1 )
                rsltados.set( filter.page > 1 ? [ ..._rsltados, ...rows ] : rows )
                            
            else if( rows.length > 0 ){
                finder( { 
                    ...filter, 
                    pid: rows[ 0 ].pid, 
                    gisid: rows[ 0 ].gisid, 
                    sqft: rows[ 0 ].sqft,
                    centroid_x: rows[ 0 ].centroid_x,
                    centroid_y: rows[ 0 ].centroid_y,
                    centroid_lat: rows[ 0 ].centroid_lat,
                    centroid_lng: rows[ 0 ].centroid_lng,
                    ...( rows[ 0 ].mat.length === 1 ? rows[ 0 ].mat[ 0 ] : { } ) 

                }, fetch )

            }

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

                rsltados.set( [filter ] )

                break

        }
                
    }

}


historia.subscribe( value => { _historia = value } )
rsltados.subscribe( value => { _rsltados = value } )