import { genError, getInvalidParams } from "$lib/api.js"
import { filterObj } from "$lib/utils.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const prop_use = url.searchParams.get( "prop_use" ) ?? null,
            juris = url.searchParams.get( "juris" ) ?? null,
            neigh_code = url.searchParams.get( "neigh_code" ) ?? null,
            street_name = url.searchParams.get( "street_name" ) ?? null,
        
            parcel_acreage = url.searchParams.get( "parcel_acreage" ) ?? null, 
            land_size_acreage = url.searchParams.get( "land_size_acreage" ) ? url.searchParams.get( "land_size_acreage" ).split( "|" ).map( val => parseInt( val ) ): null,
            land_size_no_acreage = url.searchParams.get( "land_size_no_acreage" ) ? url.searchParams.get( "land_size_no_acreage" ).split( "|" ).map( val => parseInt( val ) ): null,

            market_value = url.searchParams.get( "market_value" ) ? url.searchParams.get( "market_value" ).split( "|" ).map( val => parseInt( val ) ): null,
            sale_price = url.searchParams.get( "sale_price" ) ? url.searchParams.get( "sale_price" ).split( "|" ).map( val => parseInt( val ) ): null,
            sale_date = url.searchParams.get( "sale_date" ) ? url.searchParams.get( "sale_date" ).split( "|" ): null, 

            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            

            bedroom = url.searchParams.get( "bedroom" ) ?? null,
            fullbath = url.searchParams.get( "fullbath" ) ?? null,
            exterior_frame = url.searchParams.get( "exterior_frame" ) ?? null,
            story_type = url.searchParams.get( "story_type" ) ?? null,

            groupRows = rows => {
                let obj = { }

                rows.forEach( row => {
                    let bldg = { 
                            bldg_seq: row.bldg_seq,
                            total_square_feet: row.total_square_feet, 
                            year_built: row.year_built, 
                            bedrooms: row.bedrooms, 
                            full_baths: row.full_baths,

                        }
                    
                    if( obj.hasOwnProperty( row.pid ) ){
                        obj[ row.pid ].situs_address.push( row.situs_address )
                        obj[ row.pid ].bldgs.push( bldg )    

                    }else
                        obj[ row.pid ] = { 
                                ...filterObj( row, [ "bldg_seq", "total_square_feet", "year_built", "bedrooms", "full_baths", "situs_address" ], false ) , 
                                situs_address: [ row.situs_address ], 
                                bldgs: [ bldg ] 

                            }
                    
                } )
                
                return Object.values( obj )

            }

        if( prop_use || juris ||street_name || neigh_code ||
            parcel_acreage || land_size_acreage || land_size_no_acreage ||
            market_value || sale_price || sale_date ||
            bedroom || fullbath || exterior_frame || story_type ||
            pid || gisid ){
            let filter = [ ],
                situs_filter = [ ],
                bldgs_filter = [ ]

            if( prop_use )
                bldgs_filter.push( `b.BuildingCategoryDescription = '${prop_use}'` )

            if( juris )
                filter.push( `parcels.Tax_MunDist = '${juris}'` )

            if( neigh_code )
                filter.push( `parcels.Neighborhood like '${neigh_code}'` )

            if( street_name )
                situs_filter.push( `s.situs_address like '%${street_name.replace( ",", "" )}%'`)

            if( market_value )
                filter.push( `(parcels.TotalMarketValue BETWEEN ${market_value[ 0 ]} AND ${market_value[ 1 ]})` )
           
            if( sale_price )
                filter.push( `(parcels.SalePrice BETWEEN ${sale_price[ 0 ]} AND ${sale_price[ 1 ]})` )

            if( sale_date )
                filter.push( `(parcels.SaleDate BETWEEN '${sale_date[ 0 ]}' AND '${sale_date[ 1 ]}')` )

            if( parcel_acreage && land_size_acreage ){
                filter.push( `( ( parcels.LandUnitDescription in ( 'ACRE', 'CALC AREA', 'SMALL ACRE' ) and parcels.LandSize BETWEEN ${land_size_acreage[ 0 ]} AND ${land_size_acreage[ 1 ]} ) OR ( parcels.LandUnitDescription in ( 'SQUARE FEET' ) and parcels.LandSize BETWEEN ${land_size_acreage[ 0 ]*43560} AND ${land_size_acreage[ 1 ]*43560} ) )` )

            }else if( parcel_acreage && land_size_no_acreage ){
                filter.push( `( parcels.LandUnitDescription in ( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' ) and parcels.LandSize BETWEEN '${land_size_no_acreage[ 0 ]}' AND '${land_size_no_acreage[ 1 ]}' )` )
                
            }else if( parcel_acreage ){
                filter.push( `parcels.LandUnitDescription in ${( Boolean( parcels_acreage ) ? "( 'ACRE', 'CALC AREA', 'SMALL ACRE', 'SQUARE FEET' )" : "( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' )" )}` )

            }
                                
            if( pid )
                filter.push( `parcels.parcelid in ( '${pid.replace( /,/g,"','")}' )` )
                
            if( gisid )
                filter.push( `parcels.AssessorMap in ( '${gisid.replace(/,/g,"','")}' )` )
            
            if( bedroom )
                bldgs_filter.push( ( bedroom == 5 ? `bldgs.bedrooms > 4` : `bldgs.bedrooms = ${bedroom}` ) )

            if( fullbath )
                bldgs_filter.push( ( fullbath == 5 ? `bldgs.FullBath > 4` : `bldgs.FullBath = ${fullbath}` ) )

            if( exterior_frame )
                bldgs_filter.push( `bldgs.extwall = '${exterior_frame}'` )

            if( story_type )
                bldgs_filter.push( `bldgs.storyheight = '${story_type}'` )    

            if( bldgs_filter.length > 0 )
                filter.push( `parcels.PropertyID in ( select b.PropertyID from dbo.Polaris_Buildings as b where ${bldgs_filter.join( " and " )} )` )

            if( situs_filter.length > 0 )
                filter.push( `situs.PropertyID in ( select s.PropertyID from dbo.Polaris_SitusAddresses as s where ${situs_filter.join( " and " )} )` )
            
            const { assess_pool } = locals,
                sql = `SELECT parcels.parcelid as pid, parcels.AssessorMap as gisid, 
                        situs.situs_address, parcels.Tax_MunDist as municipality, 
                        parcels.LandSize as land_size, parcels.LandUnitDescription as land_unit, parcels.SalePrice as sale_price, convert(varchar, parcels.SaleDate, 101) as sale_date,
                        parcels.TotalMarketValue as market_value, bldgs.BuildingSequence as bldg_seq, bldgs.totalarea as total_square_feet, bldgs.yearbuilt as year_built, 
                        bldgs.bedrooms as bedrooms, bldgs.FullBath as full_baths
                        FROM dbo.Polaris_AllParceldata as parcels
                        LEFT JOIN dbo.Polaris_SitusAddresses as situs ON situs.PropertyID = parcels.PropertyID
                        LEFT JOIN dbo.Polaris_Buildings as bldgs ON bldgs.PropertyID = parcels.PropertyID
                        WHERE ${filter.join( " and " )} 
                        GROUP BY parcels.parcelid, parcels.AssessorMap, parcels.Tax_MunDist, parcels.LandSize, parcels.LandUnitDescription, parcels.SalePrice, parcels.SaleDate, parcels.TotalMarketValue, 
                        situs.situs_address,  
                        bldgs.BuildingSequence, bldgs.totalarea, bldgs.yearbuilt, bldgs.bedrooms, bldgs.FullBath`,
                result  = await assess_pool.query( sql )

            response = groupRows( result.recordset )

        }else{
            const allowed_params = [ "address" ,"addrno", "prefix", "stname", "sttype", "suffix", "muni", "parcels_acreage", "pid", "gisid", "prop_use", "juris", "bedroom", "fullbath", "exterior_frame",  "story_type" ],
                invalid_params = getInvalidParams( url.searchParams, allowed_params ).join( ', ' )
                
            response = genError( { "message": `invalid paramater(s) sent: ${invalid_params}` } )
            status = 500

        }
       
    }catch( err ){
        console.log( err )
        response = genError( { "message": err.message, "code": err.code } )
        status = 500

    }finally{
        return new Response( JSON.stringify( response ), { status: status } )

    }

}