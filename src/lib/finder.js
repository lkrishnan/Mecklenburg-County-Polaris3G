import { filterObj, json2URL, removeArrayDups, srchstr2qrystr } from "$lib/utils"
import { getGeom, getGeomAsTxt  } from "$lib/mapping"

export default async function finder( filter, fetch=null ){
    try{
        let params = { }

        Object.keys( filterObj( filter, [ "type" ], false ) ).forEach( key => { 
            params[ key ] = ( key === "rings" ? getGeomAsTxt( filter[ key ] ) : filter[ key ] )

        } )

        const resp = await fetch( `/api/bolt/cama?${json2URL( params )}` )

        if( resp.ok ){
            const raw_rows = await resp.json( ),
                rows = raw_rows.map( r => ( { 
                    ...r, 
                    ...( r?.mat ? r.mat[ ( filter?.matid ? r.mat.findIndex( m => m.matid === filter.matid ) : 0 ) ] : { } )
                } ) )

            if( rows.length > 0 ){
                // Add Graphic
                /*if( filter?.buffer )
                    messenger.set( [ { type: "add_buffer_graphic", gisid: filter.gisid, buffer: filter.buffer } ] )

                else if( filter?.stcode ) 
                    messenger.set( [ { type: "add_road_graphic", stcode: filter.stcode } ] )*/

                return rows

            }else
                return [ ]

        }else
            return [ ]
       
    }catch( exception ){
        return [ ]
                
    }

}