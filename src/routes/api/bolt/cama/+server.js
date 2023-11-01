import { genError, getInvalidParams } from "$lib/api.js"
import { removeArrayDups, json2URL, arrHasAllElems } from "$lib/utils.js"
import { concatArr } from "$lib/format"
import { Decimal128 } from "mongodb"

/** @type {import('./main/$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200
    
    const allowed = [ "juris", "neigh_code", "stcode", "buffer", "rings", "nearby", "xy", "latlng", "gisid", 
        "pid", "assessproid", "lastname", "firstname", "situs_address", 
        "market_value", "sale_price", "sale_date", "land_size_acreage", "land_size_no_acreage", "parcel_acreage",
        "prop_use", "sq_ft", "year_built", "bedroom", "fullbath", "exterior_frame", "story_type", "page", "limit" ],
        str2ArrOfStr = val => ( val.indexOf( "," ) > -1 ? { $in: val.toUpperCase( ).split( "," ) } : val.toUpperCase( ) ),
        str2ArrOfInt = val => ( val.indexOf( "," ) > -1 ? { $in: val.split( "," ).map( item => parseInt( item ) ) } : parseInt( val ) ),
        rangeInt = val => { const arr = val.split( "|" ); return { $gte: parseInt( arr[ 0 ] ), $lte: parseInt( arr[ 1 ] ) }; },
        rangeFloat = ( val, mult=1 )  => { const arr = val.split( "|" ); return { $gte: parseFloat( arr[ 0 ] ) * mult, $lte: parseFloat( arr[ 1 ] ) * mult }; },
        rangeDate = val => { const arr = val.split( "|" ); return { $gte: new Date( arr[ 0 ] ), $lte: new Date( arr[ 1 ] ) }; },
        cleanseObj = obj => {
            Object.keys( obj ).forEach( k  => {
                if( obj[ k ] instanceof Decimal128) 
                    obj[ k ] = parseFloat( obj[ k ] )
                
            } )
        
            return obj
        
        }, 

        getIntersectingGISIDs = async spatial_filter => {
            console.log( spatial_filter )
            const response = await fetch( `/api/query/gis/parcel_geom?${spatial_filter[ 0 ]}=${spatial_filter[ 1 ]}&geom=0` ),
                rows = await response.json( )

            return rows.reduce( ( acc, row ) => acc + ( acc.length > 0 ? "," : "" ) + row.gisid, "" )
        }
                
    try{
        let params = { page: 1, limit: 20, ...Object.fromEntries( url.searchParams ) },
            filter = [ ],
            fnd = { },
            gisids = ""
            
        if( arrHasAllElems( allowed, Object.keys( params ) ) ){
            if( params?.juris )
                filter.push( { municipality: params.juris.toUpperCase( ) } )

            if( params?.neigh_code )
                filter.push( { neighborhood_code: params.neigh_code } )

            if( params?.stcode )
                filter.push( { stcode: parseInt( params.stcode ) } )

            // taking care of spatial filters
            if( params?.buffer )
                gisids += ( gisids.length > 0 ? "," : "" ) + await getIntersectingGISIDs( [ "buffer", params.buffer ] )

            if( params?.rings )
                gisids += ( gisids.length > 0 ? "," : "" ) + await getIntersectingGISIDs( [ "rings", params.rings ] )

            if( params?.nearby )
                gisids += ( gisids.length > 0 ? "," : "" ) + await getIntersectingGISIDs( [ "nearby", params.nearby ] )

            if( params?.xy )
                gisids += ( gisids.length > 0 ? "," : "" ) + await getIntersectingGISIDs( [ "xy", params.xy ] )

            if( params?.latlng )
                gisids += ( gisids.length > 0 ? "," : "" ) + await getIntersectingGISIDs( [ "xy", params.latlng ] )

            if( params?.gisid )
                gisids += ( gisids.length > 0 ? "," : "" ) + params.gisid

            if( gisids.length > 0 ){
                console.log( gisids )
                filter.push( { gisid: str2ArrOfStr( gisids ) } )

            }
            
            if( params?.pid )
                filter.push( { pid: str2ArrOfStr( params.pid ) } )
            
            if( params?.assessproid )
                filter.push( { assessproid: str2ArrOfInt( params.assessproid ) } )

            // owner filter
            if( params?.lastname && params?.firstname )
                filter.push( { "owner": { $elemMatch: { "lastname": params.lastname.toUpperCase( ), "firstname": params.firstname.toUpperCase( ) } } } )
            else if( params?.lastname )
                filter.push( { "owner.lastname": params.lastname.toUpperCase( ) } )
            else if( params?.firstname )
                filter.push( { "owner.firstname": params.firstname.toUpperCase( ) } )

            if( params?.situs_address )
                filter.push( { "situs": params.situs } )

            if( params?.market_value )
                filter.push( { market_value: rangeInt( params.market_value ) } )

            if( params?.sale_price ){
                filter.push( { sale_price: rangeInt( params.sale_price ) } )
            }

            if( params?.sale_date )
                filter.push( { sale_date: rangeDate( params.sale_date ) } )
            
            // parcel acreage and land size
            if( params?.land_size_acreage )
                filter.push( { $or: [ { $and: [ { land_unit: { $in: [ 'ACRE', 'CALC AREA', 'SMALL ACRE' ] } }, { land_size: rangeFloat( params.land_size_acreage ) } ] }, { $and: [ { land_unit: 'SQUARE FEET' }, { land_size: rangeFloat( params.land_size_acreage, 43560 ) } ] } ] } )

            else if( params?.land_size_no_acreage )
                filter.push( { $and: [ { land_unit: { $in: [ 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' ] } }, { land_size: rangeFloat( params.land_size_no_acreage ) } ] } )
            
            else if( params?.parcel_acreage )
                filter.push( { land_unit: { $in: ( Boolean( params.parcels_acreage ) ? [ 'ACRE', 'CALC AREA', 'SMALL ACRE', 'SQUARE FEET' ] : [ 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' ] ) } } ) 

            // building filter
            if( params?.prop_use ){
                if( params.prop_use != "Vacant Land" ){
                    let bldg_filter = { }
    
                    bldg_filter.property_use = params.prop_use
    
                    if( params?.sq_ft )
                        bldg_filter.total_sqft = rangeInt( params.sq_ft )
                    
                    if( params?.year_built )
                        bldg_filter.year_built = rangeInt( params.year_built )
    
                    if( params?.bedroom )
                        bldg_filter.bedrooms = ( params.bedroom == 5 ? { $gt: parseInt( 4 ) } : parseInt( params.bedroom ) )
    
                    if( params?.fullbath )
                        bldg_filter.full_baths = ( params.fullbath == 5 ? { $gt: parseInt( 4 ) } : parseInt( params.fullbath ) )
    
                    if( params?.exterior_frame )
                        bldg_filter.exterior_wall = params.exterior_frame
                    
                    if( params?.story_type )
                        bldg_filter.stories = params.story_type
    
                    filter.push( { bldg: { $elemMatch: bldg_filter } } )
    
                }

            }

            if( filter.length > 0 ){
                const { mongo_pool } = locals,
                database = mongo_pool.db( "polaris" ),
                cama = database.collection( "cama" )

                response = await cama.find( ( filter.length > 1 ? { $and: filter } : ( filter.length > 0 ? filter[ 0 ] : { } ) ) )
                                    .project( { "_id": 0 } )
                                    .sort( { assessproid: 1 } )
                                    .skip( ( params.page - 1 ) * 20 )
                                    .limit( parseInt( params.limit ) )
                                    .toArray( )
                                    .then( rows => {
                                        return rows.map( row => {
                                            row = cleanseObj( row )
                                            
                                            if( row?.mat )
                                                row.mat = row.mat.map( mat_row => cleanseObj( mat_row ) )
                                    
                                            return row
                                    
                                        } )
                                    } )

                //const temp = await cama.find( fnd ).sort( { pid: 1 } ).skip( ( params.page - 1 ) * 20 ).limit( parseInt( params.limit ) ).explain( "executionStats" )
                //response = temp

            }else
                throw new Error( "no paramater(s) sent" )
            
        }else
            throw new Error( `invalid paramater(s) sent: ${ getInvalidParams( url.searchParams, allowed ).join( ', ' ) }` )

    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        //return new Response( JSON.stringify( response, null, 4 ), { status: status } )
        return new Response( JSON.stringify( response ), { status: status } )

    }

}