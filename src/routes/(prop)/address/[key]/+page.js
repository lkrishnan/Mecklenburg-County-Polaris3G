import { last_hit } from '$lib/store.js'

export function load( { params } ){
    last_hit.subscribe( value => {
		const srch_str = params.key.replace( /\+/g, " " ).toUpperCase( )

		if( "type" in value && "address" in value && 
			value.type === "ADDRESS" && value.address === srch_str  ){
			console.log( "finder" )
		}else{
			console.log( "search then finder" )
		}

		
	} )

	

}