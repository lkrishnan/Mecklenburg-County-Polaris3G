//import postgres from "postgres"
import pgpkg from "pg"
import mssqlpkg from "mssql"
//import { Pool as postgres } from "pg"
//import { connect as mssql } from "mssql"
import { GIS_CONN_STR, TAX_CONN_STR, CAMA_CONN_STR, APRO_CONN_STR, ASSESS_YEAR } from '$env/static/private'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( { event, resolve } ) => {
    const { Pool: postgres } = pgpkg,
        { connect: mssql } = mssqlpkg

    event.locals = {
        gis_pool: new postgres( JSON.parse( GIS_CONN_STR ) ),
        tax_pool: new postgres( JSON.parse( TAX_CONN_STR ) ),
        //cama_pool: await mssql( CAMA_CONN_STR ),
        assess_pool: await mssql( APRO_CONN_STR ),
        assess_yr: ASSESS_YEAR,

    }
  
    const response = await resolve( event )
    return response

}


