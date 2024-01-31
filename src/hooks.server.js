import pgpkg from "pg"
import mssqlpkg from "mssql"
import {MongoClient} from "mongodb"
import {md5} from "js-md5"
import {GIS_CONN_STR, TAX_CONN_STR, APRO_CONN_STR, ASSESS_YEAR, MONGO_CONN_STR, EAGLEVIEW_API_KEY, EAGLEVIEW_SECRET_KEY } from "$env/static/private"

const getEagleViewToken = async ( ) => {
        const epoch = Math.floor( Date.now( ) / 1000 ),
            signature = md5.hmac( EAGLEVIEW_SECRET_KEY, EAGLEVIEW_API_KEY + epoch ),
            response = await fetch( `https://pol.pictometry.com/Gateway/v1/authenticate/${EAGLEVIEW_API_KEY}/${epoch}/${signature}` ),
            result = await response.json( )

        return result.response.token

    },   

    {Pool: postgres} = pgpkg,
    {connect: mssql} = mssqlpkg,

    the_locals = {
        gis_pool: new postgres( JSON.parse( GIS_CONN_STR ) ),
        tax_pool: new postgres( JSON.parse( TAX_CONN_STR ) ),
        assess_pool: await mssql( JSON.parse( APRO_CONN_STR ) ),
        assess_yr: ASSESS_YEAR,
        mongo_pool: new MongoClient( MONGO_CONN_STR ),
        eagleview_token: await getEagleViewToken( )

    },

    //refresh token every 2 hours and 50 minutes
    refreshid = setInterval( async ( ) => { the_locals.eagleview_token = await getEagleViewToken( ) }, 10200000 )

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( {event, resolve, error} ) => {
    event.locals = the_locals
    
    const response = await resolve( event )

    return response

}