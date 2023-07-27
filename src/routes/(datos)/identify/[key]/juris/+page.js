/** @type {import('./$types').PageData} */


export async function load( {params, fetch} ){
    const xy = params.key.split( "," ).map( coord => parseFloat(coord.trim( ) ) ),
        response = await fetch( `/api/query/gis?table=jurisdiction_py&filter=ST_Within(ST_GeomFromText( 'POINT(${xy[0]} ${xy[1]})', 2264 ) , shape)` ),
        rows =  await response.json( )

    return { rows: rows }

}