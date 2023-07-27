import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const address = url.searchParams.get( "address" ) ?? null,
            addrno = url.searchParams.get( "addrno" ) ?? null,
            prefix = url.searchParams.get( "prefix" ) ?? null,
            stname = url.searchParams.get( "stname" ) ?? null,
            sttype = url.searchParams.get( "sttype" ) ?? null,
            suffix = url.searchParams.get( "suffix" ) ?? null,
            muni = url.searchParams.get( "muni" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            lastname = url.searchParams.get( "lastname" ) ?? null

        if( address || addrno || prefix || stname || sttype || suffix || muni || pid || gisid || lastname || firstname ){
            let filter = [ ] 

            if( address )
                filter.push( `parcels.location_address like '${address}%'`)

            if( addrno )
                filter.push( `parcels.location_address like '${addrno}%'` )

            if( prefix )
                filter.push( `parcels.location_address like '%${prefix}%'` )

            if( stname )
                filter.push( `parcels.location_address like '%${stname}%'` )
             
            if( sttype )
                filter.push( `parcels.location_address like '%${sttype}%'` )

            if( suffix )
                filter.push( `parcels.location_address like '%${suffix}%'` )
                                
            if( muni )
                filter.push( `parcels.location_address like = '%${muni}%'` )
                                
            if( pid )
                filter.push( `parcels.parcelid in ( '${pid.replace( /,/g,"','")}' )` )
                
            if( gisid )
                filter.push( `parcels.AssessorMap in ( '${gisid.replace(/,/g,"','")}' )` )

            if( lastname && firstname ){
                filter.push( `( ( ownr.Owner1LastName like '${lastname}%' AND ownr.Owner1FirstName like '${firstname}%' ) OR ( ownr.Owner2LastName like '${lastname}%' AND ownr.Owner2FirstName like '${firstname}%' ) OR ( ownr.Owner3LastName like '${lastname}%' AND ownr.Owner3FirstName like '${firstname}%' ) )` )

            }else if( lastname ){
                filter.push( `ownr.Owner1LastName like '${lastname}%' OR ownr.Owner2LastName like '${lastname}%' OR ownr.Owner3LastName like '${lastname}%'` )

            }else if( firstname ){
                filter.push( `ownr.Owner1FirstName like '${firstname}%' OR ownr.Owner2FirstName like '${firstname}%' OR ownr.Owner3FirstName like '${firstname}%'` )
            
            }
            
            const { assess_pool } = locals,
                sql = `SELECT top 500 parcels.parcelid as pid, parcels.AssessorMap as gisid, parcels.location_address as situs_address,
                    STUFF( parcels.Owner1, CHARINDEX(' ', parcels.Owner1), 1, ',') as owner_1, STUFF( parcels.Owner2, CHARINDEX(' ', parcels.Owner2), 1, ',') as owner_2, 
                    STUFF( parcels.Owner3, CHARINDEX(' ', parcels.Owner3), 1, ',') as owner_3 
                    FROM Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                    ${ ( lastname || firstname ? ` INNER JOIN Assess50Mecklenburg.dbo.Polaris_Owners as ownr ON parcels.ParcelID = ownr.parcelid` : `` )}
                    WHERE ${filter.join( " and " )}`,
                result  = await assess_pool.query( sql )

            response = result.recordset

        }else{
            const allowed_params = [ "address" ,"addrno", "prefix", "stname", "sttype", "suffix", "muni", "pid", "gisid", "lastname", "firstname" ],
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