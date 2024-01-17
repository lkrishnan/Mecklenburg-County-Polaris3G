import {genError, getInvalidParams} from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    const allowed = [ "pid", "gisid", "assessproid", "address" ]

    try{
        let qry_str = { }
            
        allowed.forEach( key => {
            if( url.searchParams.get( key ) )
                qry_str[ key ] = url.searchParams.get( key )        
            
        } )

        if( Object.keys( qry_str ).length > 0 ){
            let filter = [ ]

            Object.keys( qry_str ).forEach( key => {
                switch( key ){
                    case "pid":
                        filter.push( `situs.parcelid in ( '${qry_str[ key ].replace( /,/g, "','" )}' )` )
                        break

                    case "gisid":
                        filter.push( `situs.AssessorMap in ( '${qry_str[ key ].replace( /,/g, "','" )}' )` )
                        break
    
                    case "assessproid":
                        filter.push( `situs.PropertyID in ( '${qry_str[ key ].replace( /,/g, "','" )}' )` )
                        break
    
                    case "address":
                        filter.push( `situs.situs_address like '${qry_str[ key ]}%'`)
                        break

                }
                
            } )

            const { assess_pool } = locals,
                sql = `SELECT situs.parcelid as pid, situs.PropertyID as assessproid, situs.situs_address, situs.AssessorMap as gisid
                        FROM dbo.Polaris_SitusAddresses as situs
                        WHERE ${filter.join( " and " )}
                        GROUP BY situs.parcelid, situs.AssessorMap, situs.PropertyID, situs.situs_address`,
                result  = await assess_pool.query( sql )
            
            response = result.recordset
        
        }else{
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

/*SELECT top 100 parcels.ParcelID, parcels.PropertyID, LTRIM(RTRIM(CONCAT(locs.FormattedAddressWOUnitLabel, ' ', REPLACE(locs.FormattedAddressCSZ,',','')))) as situs_address
FROM xrYearColor as yr
CROSS APPLY [Assess50Mecklenburg].[dbo].Polaris_AllParceldata as parcels
OUTER APPLY GetPropertyLocationsTableByPropertyID( parcels.PropertyID, yr.YearID + 1, 1) as propslocs
OUTER APPLY GetFormattedLocationTableByLocationID(1, propslocs.LocationID, yr.YearID + 1, 1) locs
WHERE yr.iscurrentflag = 1*/