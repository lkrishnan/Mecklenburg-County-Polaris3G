<main>
	<slot/>
</main>

{#if show.results}
	<div class="text-sm">
		{#each _results as _result, i}
			<Result idx={i} info={_result} />

		{/each}
	</div>
	
{:else if show.details }
	<div class="p-2 text-sm">
		<PropertyKey pid={pid} gisid={gisid} matid={matid} address={address} lat={lat} lng={lng} x={x} y={y} />
		<AssociateInfo legal={legal_rows} landuse={landuse_rows} sqft={sqft} />
		<TaxInfo pid={pid} legal={legal_rows} />
		<Deed pid={pid} sale={sale_rows} />
		<Location pid={pid} gisid={gisid} x={x} y={y} lat={lat} lng={lng} address={address} situs={situs_rows} />
		<Environmental pid={pid} gisid={gisid} x={x} y={y} lat={lat} lng={lng} />
	</div>
	
{/if}

<script>
	import { selection, results, last_results_pg } from "$lib/store.js"    
	import Result from "$lib/components/Result.svelte"
	import { page } from "$app/stores"
	import PropertyKey from "$lib/components/PropertyKey.svelte"
    import AssociateInfo from "$lib/components/AssociateInfo.svelte"
    import TaxInfo from "$lib/components/TaxInfo.svelte"
    import Deed from "$lib/components/Deed.svelte"
    import Location from "$lib/components/Location.svelte"
    import Environmental from "$lib/components/Environmental.svelte"
	import { onMount } from "svelte"

	let _selection, 
        _results,
        show = { results: false, details: false },
		pid, gisid,
        matid, address,
        sqft,
        lat, lng, x, y,
        legal_rows,
        landuse_rows,
        sale_rows,
        situs_rows

	onMount( async () => {
		selection.subscribe( async value => { 
        	_selection = value

			const urls = [
					//legal
					{ url: ( _selection.pid ? `/api/query/cama/legal?pid=${_selection.pid}` : null ), tag: "legal" },

					//landuse
					{ url: ( _selection.pid ? `/api/query/cama/landuse?pid=${_selection.pid}` : null ), tag: "landuse" },

					//sales
					{ url: ( _selection.pid ? `/api/query/cama/sale?pid=${_selection.pid}` : null ), tag: "sale" },

					//situs
					{ url: ( _selection.pid ? `/api/query/cama/situs?pid=${_selection.pid}` : null ), tag: "situs" },
				
				],
				jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
				tags = urls.filter( item => item.url ).map( item => item.tag )

			//set variables
			pid = _selection.pid ?? null
			gisid = _selection.gisid ?? null
			matid = _selection.matid ?? null
			address = _selection.address ?? null
			sqft = _selection.sqft ?? null
			lat = _selection.lat ?? _selection.centroid_lat
			lng = _selection.lng ?? _selection.centroid_lng
			x = _selection.x ?? _selection.centroid_x
			y = _selection.y ?? _selection.centroid_y
			legal_rows = ( tags.includes( "legal" ) ? jsons[ tags.indexOf( "legal" ) ] : [ ] )
			landuse_rows = ( tags.includes( "landuse" ) ? jsons[ tags.indexOf( "landuse" ) ] : [ ] )
			sale_rows = ( tags.includes( "sale" ) ? jsons[ tags.indexOf( "sale" ) ] : [ ] )
			situs_rows = ( tags.includes( "situs" ) ? jsons[ tags.indexOf( "situs" ) ] : [ ] )
			show = { results: false, details: ( Object.keys( _selection ).length > 0 ? true : false ) }

    	} )

		results.subscribe( value => { 
			_results = value

			if( _results.length > 0 )
				last_results_pg.set( $page.url.pathname )

			show = { results: ( _results.length > 0 ? true : false ), details: false }

		} )

	} )

</script>