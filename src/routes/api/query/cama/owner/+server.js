import { genError, getInvalidParams } from "$lib/api.js"

/** @type {import('./$types').RequestHandler} */
export const GET = async ( { url, locals } ) => {
    let response, status = 200

    try{
        const lastname = url.searchParams.get( "lastname" ) ?? null,
            firstname = url.searchParams.get( "firstname" ) ?? null,
            pid = url.searchParams.get( "pid" ) ?? null,
            gisid = url.searchParams.get( "gisid" ) ?? null

        if( lastname || firstname || pid || gisid ){
            let filter = [ ] 

            if( pid )
                filter.push( `parcels.parcelid = '${pid}'` )
            
            if( gisid )
                filter.push( `parcels.AssessorMap = '${gisid}'` )
                
            if( lastname && firstname ){
                filter.push( `( ( ownr.Owner1LastName like '${lastname}%' AND ownr.Owner1FirstName like '${firstname}%' ) OR ( ownr.Owner2LastName like '${lastname}%' AND ownr.Owner2FirstName like '${firstname}%' ) OR ( ownr.Owner3LastName like '${lastname}%' AND ownr.Owner3FirstName like '${firstname}%' ) )` )

            }else if( lastname ){
                filter.push( `ownr.Owner1LastName like '${lastname}%' OR ownr.Owner2LastName like '${lastname}%' OR ownr.Owner3LastName like '${lastname}%'` )

            }else if( firstname ){
                filter.push( `ownr.Owner1FirstName like '${firstname}%' OR ownr.Owner2FirstName like '${firstname}%' OR ownr.Owner3FirstName like '${firstname}%'` )

            }

            const { assess_pool } = locals,
                sql = `select parcels.parcelid as pid, parcels.AssessorMap as gisid,
                            Owner1LastName as nme_owner1lastname, ISNULL(Owner1FirstName,'' ) as nme_owner1firstname, 
                            ISNULL( Owner2LastName,'' ) as nme_owner2lastname, ISNULL(Owner2FirstName,'' ) as nme_owner2firstname, 
                            ISNULL(Owner3LastName,'' ) as nme_owner3lastname, ISNULL(Owner3FirstName,'' ) as nme_owner3firstname,
                            ownr.BillingAddress as address_1, ISNULL( ownr.BillingAddress2,'' ) as address_2, ownr.City as city, ownr.State as state, ownr.ZipCode as zipcode
                            FROM Assess50Mecklenburg.dbo.Polaris_Owners as ownr
                            LEFT JOIN Assess50Mecklenburg.dbo.Polaris_AllParceldata as parcels
                            ON ownr.parcelid = parcels.ParcelID
                            WHERE parcels.parcelid is NOT NULL
                            AND ${filter.join( " and " )}`,
                result  = await assess_pool.query( sql )

            response = result.recordset

        }else{
            const allowed_params = [ "lastname", "firstname", "pid", "gisid" ],
                invalid_params = getInvalidParams( url.searchParams, allowed_params ).join( ', ' )
                
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