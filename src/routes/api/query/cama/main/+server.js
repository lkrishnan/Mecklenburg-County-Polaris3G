import {genError, getInvalidParams} from "$lib/api.js"
import {removeArrayDups, json2URL, arrHasAllElems} from "$lib/utils.js"
import {concatArr} from "$lib/format"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals, fetch } ) => {
    let response, status = 200
    
    const allowed = [ "pid", "gisid", "assessproid", "firstname", "lastname", "situs_address", "prop_use", "juris", "neigh_code",  
        "parcel_acreage", "land_size_acreage", "land_size_no_acreage","market_value", "sale_price", "sale_date",
        "bedroom", "fullbath", "exterior_frame", "story_type", "year_built", "sq_ft", "buffer", "rings", "xy", "latlng", "nearby", "page", "limit" ]
        
    try{
        let params = { page: 1, limit: 20, ...Object.fromEntries( url.searchParams ) }

        if( arrHasAllElems( allowed, Object.keys( params ) ) ){
            let filter = [ ],
                bldgs_filter = [ ],
                ground_info = { },
                spatial_filter = [ ]

            //adding to main filter   
            if( params?.pid )
                filter.push( `parcels.parcelid in ( '${params.pid.replace( /,/g,"','")}' )` )
            
            if( params?.gisid )
                filter.push( `parcels.AssessorMap in ( '${params.gisid.replace(/,/g,"','")}' )` )

            if( params?.assessproid )
                filter.push( `parcels.PropertyID in ( '${params.assessproid.replace(/,/g,"','")}' )` )

            if( params?.lastname )
                filter.push( `(parcels.Owner1LastName like '${params.lastname}%' OR parcels.Owner2LastName like '${params.lastname}%' OR parcels.Owner3LastName like '${params.lastname}%')` )
                        
            if( params?.firstname )
                filter.push( `(parcels.Owner1FirstName like '${params.firstname}%' OR parcels.Owner2FirstName like '${params.firstname}%' OR parcels.Owner3FirstName like '${params.firstname}%')` )
      
            if( params?.juris )
                filter.push( `parcels.Tax_MunDist = '${params.juris}'` )
            
            if( params?.neigh_code )
                filter.push( `parcels.Neighborhood = '${params.neigh_code}'` )
            
            if( params?.market_value )
                filter.push( `(parcels.TotalMarketValue BETWEEN ${concatArr( params.market_value.split( "|" ), " AND " )} )` )
                           
            if( params?.sale_price )
                filter.push( `(parcels.SalePrice BETWEEN ${concatArr( params.sale_price.split( "|" ), " AND " )} )` )
                                    
            if( params?.sale_date ){
                const arr = params.sale_date.split( "|" )
                filter.push( `(parcels.SaleDate BETWEEN '${arr[ 0 ]}' AND '${arr[ 1 ]}')` )

            }

            if( params?.parcel_acreage && params?.land_size_acreage ){
                const land_size_acreage = params.land_size_acreage.split( "|" ).map( val => parseInt( val ) )
                
                filter.push( `( ( parcels.LandUnitDescription in ( 'ACRE', 'CALC AREA', 'SMALL ACRE' ) and parcels.LandSize BETWEEN ${land_size_acreage[ 0 ]} AND ${land_size_acreage[ 1 ]} ) OR ( parcels.LandUnitDescription in ( 'SQUARE FEET' ) and parcels.LandSize BETWEEN ${land_size_acreage[ 0 ]*43560} AND ${land_size_acreage[ 1 ]*43560} ) )` )
    
            }else if( params?.parcel_acreage && params?.land_size_no_acreage ){
                const land_size_no_acreage = params.land_size_no_acreage.split( "|" ).map( val => parseInt( val ) )

                filter.push( `( parcels.LandUnitDescription in ( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' ) and parcels.LandSize BETWEEN '${land_size_no_acreage[ 0 ]}' AND '${land_size_no_acreage[ 1 ]}' )` )
                
            }else if( params?.parcel_acreage )
               filter.push( `parcels.LandUnitDescription in ${( Boolean( params.parcels_acreage ) ? "( 'ACRE', 'CALC AREA', 'SMALL ACRE', 'SQUARE FEET' )" : "( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' )" )}` )
                            
            if( params?.situs_address ) //add situs filter to main filter
                filter.push( `parcels.PropertyID in ( select s.PropertyID from dbo.Polaris_SitusAddresses as s where s.situs_address like '%${params.situs_address.replace( ",", "" )}%' )` )
                                    
            // getting gisids before adding to filter
            if( params?.buffer )
                spatial_filter.push( "buffer", params.buffer )

            else if( params?.rings )
                spatial_filter.push( "rings", params.rings )

            else if( params?.nearby )
                spatial_filter.push( "nearby", params.nearby )

            else if( params?.xy )
                spatial_filter.push( "xy", params.xy )

            else if( params?.latlng )
                spatial_filter.push( "latlng", params.latlng )

            if( spatial_filter.length > 0 ){
                const response = await fetch( `/api/query/gis/parcel_geom?${spatial_filter[ 0 ]}=${spatial_filter[ 1 ]}&geom=0` ),
                rows = await response.json( )

                if( rows.length > 0 ){
                    filter.push( `parcels.AssessorMap in ('${rows.reduce( ( acc, row ) => acc + ( acc.length > 0 ? "','" : "" ) + row.gisid, "" )}')` ) 
                    ground_info = { ...ground_info, ...rows.reduce( ( obj, item ) => ( obj[ item.gisid ] = item, obj ), { } ) }

                }
                
            }
            
                //add building filter to main filter
            if( Object.keys( params ).filter( key => [ "bedroom", "fullbath", "exterior_frame", "story_type", "prop_use"  ].includes( key ) ).length === 5 ){
                bldgs_filter.push( 
                    `b.BuildingCategoryDescription = '${params.prop_use}'`,
                    ( params.bedroom == 5 ? `b.bedrooms > 4` : `b.bedrooms = ${params.bedroom}` ),
                    ( params.fullbath == 5 ? `b.FullBath > 4` : `b.FullBath = ${params.fullbath}` ),
                    `b.extwall = '${params.exterior_frame}'`,
                    `b.storyheight = '${params.story_type}'`
                
                )

            }

            if( params?.sq_ft )
                bldgs_filter.push( `b.totalarea BETWEEN ${concatArr( params.sq_ft.split( "|" ), " AND " )}` )

            if( params?.year_built )
                bldgs_filter.push( `b.yearbuilt BETWEEN ${concatArr( params.year_built.split( "|" ), " AND " )}` )

            if( bldgs_filter.length > 0 )
                filter.push( `parcels.PropertyID in ( select b.PropertyID from dbo.Polaris_Buildings as b where ${bldgs_filter.join( " and " )} )` )
            
            const { assess_pool } = locals,
                sql = `SELECT parcels.ParcelID as pid, parcels.AssessorMap as gisid, parcels.PropertyID as assessproid, 
                        parcels.AccountTypeDescription as account_type, parcels.LegalDescription as legal_description,
                        parcels.Tax_MunDist as municipality, parcels.Tax_FireDist as fire_district, parcels.Tax_SpecialDist as special_district, 
                        parcels.LandUseCode as land_use_code, parcels.landuse_description as land_use_desc,
                        parcels.LandSize as land_size, parcels.LandUnitDescription as land_unit,
                        parcels.deed_book,parcels.deed_page,
                        parcels.SalePrice as sale_price, convert(varchar, parcels.SaleDate, 101) as sale_date, parcels.TotalMarketValue as market_value,
                        parcels.Owner1LastName as owner1_lastname, ISNULL(parcels.Owner1FirstName, '') as owner1_firstname,
                        ISNULL(parcels.Owner2LastName, '') as owner2_lastname, ISNULL(parcels.Owner2FirstName, '') as owner2_firstname,
                        ISNULL(parcels.Owner3LastName, '') as owner3_lastname, ISNULL(parcels.Owner3FirstName, '') as owner3_firstname,
                        parcels.BillingAddress as owner_address_1, ISNULL(parcels.BillingAddress2, '') as owner_address_2, 
                        parcels.City as owner_city, parcels.State as owner_state, parcels.ZipCode as owner_zipcode,
                        parcels.Neighborhood as neighborhood_code
                        FROM dbo.Polaris_AllParceldata as parcels
                        WHERE ${filter.join( " and " )}
                        ORDER BY parcels.PropertyID
                        OFFSET ${(params.page - 1) * 20} ROWS
                        FETCH NEXT ${params.limit} ROWS ONLY`,
                main_result  = await assess_pool.query( sql ),
                main_data = main_result.recordset
            
            if( main_data.length > 0 ){
                if( Object.keys( ground_info ).length === 0 ){ //do only when grounf info wasn't queried for earlier
                    const resp = await fetch( `/api/query/gis/parcel_geom?gisid=${removeArrayDups( main_data.map( row => row.gisid ) ).join( "','" )}&geom=0` ),
                        rws = await resp.json( )

                    if( rws.length > 0 )
                        ground_info = rws.reduce( ( obj, item ) => ( obj[ item.gisid ] = item, obj ), { } )

                }

            }

            //mixin ground( especially sqft and centroid ) information
            response = main_data.map( ( row, i ) => ( ground_info.hasOwnProperty( row.gisid ) ? { ...row, ...ground_info[ row.gisid ] } : row ) )

        }
        else{
            const invalid_params = getInvalidParams( url.searchParams, allowed ).join( ', ' )
                
            response = genError( { "message": `invalid paramater(s) sent: ${invalid_params}` } )
            status = 500 

        }

    }catch( err ){
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}