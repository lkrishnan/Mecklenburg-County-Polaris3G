import { last_hit } from "$lib/store"
import finder from "$lib/finder"
import { qrystr2srchstr } from "$lib/utils"

let _last_hit, srch_str

last_hit.subscribe( value => _last_hit = value )

export function load( { fetch, params } ){
	const srch_str = qrystr2srchstr( params.key )

	if( [ "type", "address" ].every( key => _last_hit.hasOwnProperty( key ) ) &&
		_last_hit.type === "ADDRESS" && _last_hit.address === srch_str  ){
		finder( _last_hit, fetch )

	}else{
		console.log( "search then finder" )

	}

}