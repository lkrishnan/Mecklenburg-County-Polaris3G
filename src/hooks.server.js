//import postgres from "postgres"
import pgpkg from "pg"
import mssqlpkg from "mssql"
//import { Pool as postgres } from "pg"
//import { connect as mssql } from "mssql"
import { GIS_CONN_STR, CAMA_CONN_STR } from '$env/static/private'

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ( { event, resolve } ) => {
    const { Pool: postgres } = pgpkg,
        { connect: mssql } = mssqlpkg

    event.locals = {
        gis_pool: new postgres( JSON.parse( GIS_CONN_STR ) ),
        cama_pool: await mssql( CAMA_CONN_STR ),

    }
  
    const response = await resolve( event )
    return response

}

