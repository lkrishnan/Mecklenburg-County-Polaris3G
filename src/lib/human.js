import jsonToURL from "$lib/jsontourl"
import { selection, results } from "$lib/store.js"

export default async function human( filter, fetch ){
    try{
        console.log( "human", filter )
        if( [ "x", "y" ].every( key => filter.hasOwnProperty( key ) ) ){
            
        }
        
    }catch( err ){
        return { type: "error",  "msg": err }

    }

}