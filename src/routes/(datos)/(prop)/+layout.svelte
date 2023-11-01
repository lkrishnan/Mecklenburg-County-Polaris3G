<svelte:window bind:innerWidth={screen_size} />
<main>
	<slot/>
</main>

<div class="{screen_size > 768 ? 'sticky bottom-0 top-[68px]' : 'hidden' } flex justify-center gap-2 bg-lienzo border-primero border-t-2 border-x-0 border border-b-0 md:border-b-2 md:border-t-0 pb-2">
	<DataToolbar rsltadoview={rsltadoview} on:viewChange={handleViewChange} />

</div>

{#if _rsltados.length > 1 }
	<div class="text-sm">
		{#each _rsltados as _rsltado, i}
			{#if rsltadoview === "ownership" }
				<Result idx={i} info={_rsltado}  />
				
			{:else if rsltadoview === "property" }
				<ResultProp idx={i} info={_rsltado} />

			{:else if rsltadoview === "deed" }
				<ResultDeed idx={i} info={_rsltado} />

			{/if}

		{/each}
		
		<div class="flex justify-center p-2 {( _rsltados.length % 20 ) > 0 ? 'hidden' : '' }">
			<button 
				class="text-primero bg-lienzo border border-suave hover:bg-luz rounded-xl text-sm p-2 text-center inline-flex items-center shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
				type="submit"
				on:click="{handleShowMore}"
			>
				<span class="flex items-center">
					Show More
					<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
					
				</span>
					
			</button>
		</div>
		
		
	</div>
	
{:else if _rsltados.length > 0 }
	<div class="p-2 text-sm">
		<PropertyKey pid={pid} gisid={gisid} matid={matid} address={address} lat={lat} lng={lng} x={x} y={y} mailing_addr={mailing_addr} owners={owners} />
		<AssociateInfo main={main_rows} sqft={sqft} />
		<TaxInfo pid={pid} main={main_rows} />
		<Deed pid={pid} sale={sale_rows} />
		<Location pid={pid} gisid={gisid} x={x} y={y} lat={lat} lng={lng} address={address} situs={situs_rows} />
		<Environmental pid={pid} gisid={gisid} x={x} y={y} lat={lat} lng={lng} />
		
	</div>
	
{/if}


<script>
	import { messenger, rsltados, last_hit, historia } from "$lib/store.js"    
	import Result from "$lib/components/Result.svelte"
	import ResultProp from "$lib/components/ResultProp.svelte"
	import ResultDeed from "$lib/components/ResultDeed.svelte"
	import { page } from "$app/stores"
	import PropertyKey from "$lib/components/PropertyKey.svelte"
    import AssociateInfo from "$lib/components/AssociateInfo.svelte"
	import TaxInfo from "$lib/components/TaxInfo.svelte"
    import Deed from "$lib/components/Deed.svelte"
    import Location from "$lib/components/Location.svelte"
    import Environmental from "$lib/components/Environmental.svelte"
	import DataToolbar from "$lib/components/DataToolbar.svelte"
	import { onMount } from "svelte"
	import { concatArr, formatFullName } from "$lib/format"
	import { json2URL, srchstr2qrystr, qrystr2srchstr, filterObj} from "$lib/utils"
	import { validateSpChar } from "$lib/validate" 
	import finder from "$lib/finder";

	let pid, gisid,
        matid, address,
        sqft,
        lat, lng, x, y,
		owners,
        main_rows,
        sale_rows,
        situs_rows,
		mailing_addr,
		_rsltados = [ ],
		_last_hit,
		_historia,
		screen_size,
		rsltadoview
				
	const rsltados_limit = 20,
		
		getMailingAddr = rows => {
			return ( rows.length > 0 ? concatArr( [ concatArr( [ rows[ 0 ].owner_address_1, rows[ 0 ].owner_address_2 ] ), concatArr( [ rows[ 0 ].owner_city, rows[ 0 ].owner_state, rows[ 0 ].owner_zipcode ] ) ] ) : null )
			
		},

		getOwners = rows => {
			let owners = [ ]
			
			if( rows.length > 0 ){
				[ 1, 2, 3 ].forEach( idx => {
					if( rows[ 0 ][ "owner" + idx + "_lastname" ].trim( ).length > 0 ){
						owners.push( formatFullName( rows[ 0 ][ "owner" + idx + "_lastname" ], rows[ 0 ][ "owner" + idx + "_firstname" ], false ) )

					}

				} )
			}

			return owners

		},

		handleShowMore = ( ) => {
			const hit = { ..._last_hit, page: ( ( _rsltados.length/rsltados_limit ) + 1 ), view: rsltadoview }

			last_hit.set( hit )
			finder( hit, fetch )

		},

		handleViewChange = async event => {
			switch( event.detail.view ){
				case "ownership": case "deed":
					last_hit.set( { ..._last_hit, view: event.detail.view } )		
					break

				case "property":
					if( !_rsltados[ 0 ]?.bldg ){
						const response = await fetch( `/api/query/cama/building?${json2URL( { assessproid: _rsltados.map( row => row.assessproid ).join( "," ) } )}` ),
							rows = await response.json( ),
							rows_as_obj = rows.reduce( ( obj, item ) => ( obj[ item.assessproid ] = item, obj ), { } )

						_rsltados = _rsltados.map( _rsltado => {
							if( rows_as_obj.hasOwnProperty( _rsltado.assessproid ) ){
								let bldg = filterObj( rows_as_obj[ _rsltado.assessproid ], [ "bldg_seq", "total_square_feet","year_built", "year_built", "bedrooms", "full_baths" ] )

								bldg.open = ( bldg.bldg_seq > 1 ? false : true )

								if( _rsltado?.bldgs )
									_rsltado.bldg.push( bldg )
								else
									_rsltado.bldg = [ bldg ]

							}else
								_rsltado.bldg = [ ]
							
							return _rsltado

						} )

					}

					last_hit.set( { ..._last_hit, view: event.detail.view } )
					break

			}
			
		}

	onMount( async ( ) => {
		// store subscriptions
		rsltados.subscribe( async value => { 
			if( value.length > 1 ){
				
				_rsltados = value.map( elem => (elem?.bldg ? { ...elem, bldg: elem.bldg.map( bldg => { return { ...bldg, open: ( bldg.bldg_seq > 1 ? false : true ) } } ) } : elem) )
								
				const params = $page.url.pathname.split( "/" )
								.filter( item => item.length > 0 )
								.map( item => ( validateSpChar( item ) ? qrystr2srchstr( item ) : item.toUpperCase( ) ) )

				//store the results to prevent making a duplicate request to the server
				historia.set( { 
					hit: ( _last_hit?.type ? _last_hit : { type: params[ 0 ], value: params[ 1 ] } ),  
					rsltados: _rsltados

				}  )
				
			}else if( value.length > 0 ){
				_rsltados = value

				const rsltado = _rsltados[ 0 ],  
					urls = [
					//main
					{ url: ( rsltado.pid ? `/api/query/cama/main?pid=${rsltado.pid}` : null ), tag: "main" },

					//sales
					{ url: ( rsltado.pid ? `/api/query/cama/sale?pid=${rsltado.pid}` : null ), tag: "sale" },

					//situs
					{ url: ( rsltado.pid ? `/api/query/cama/situs?pid=${rsltado.pid}` : null ), tag: "situs" },

				
				],
				jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
				tags = urls.filter( item => item.url ).map( item => item.tag )

				//set variables
				pid = rsltado.pid ?? null
				gisid = rsltado.gisid ?? null
				matid = rsltado.matid ?? null
				address = rsltado.address ?? null
				sqft = rsltado.sqft ?? null
				lat = rsltado.lat ?? rsltado.centroid_lat
				lng = rsltado.lng ?? rsltado.centroid_lng
				x = rsltado.x ?? rsltado.centroid_x
				y = rsltado.y ?? rsltado.centroid_y
				main_rows = ( tags.includes( "main" ) ? jsons[ tags.indexOf( "main" ) ] : [ ] )
				sale_rows = ( tags.includes( "sale" ) ? jsons[ tags.indexOf( "sale" ) ] : [ ] )
				situs_rows = ( tags.includes( "situs" ) ? jsons[ tags.indexOf( "situs" ) ] : [ ] )
				mailing_addr = getMailingAddr( main_rows )
				owners = getOwners( main_rows )

				if( main_rows.length > 0 )
					messenger.set( [ { type: "set_neigh_code", neigh_code: main_rows[ 0 ].neighborhood_code } ] )

				if( rsltado.type !== "PICK")
					historia.set( { hit: null, rsltados: [ ] }  )

			}

		} )

		historia.subscribe( value => { 
			_historia = value 
		} )

		last_hit.subscribe( value => { 
			_last_hit = value 
			
			if( rsltadoview !== _last_hit.view )
				rsltadoview = _last_hit.view
		} )

	} )

</script>