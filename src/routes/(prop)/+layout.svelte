<svelte:window bind:innerWidth={screen_size} />

{#if _idx !== undefined }
	{#if _datadrawer}
		<!-- Button Bar -->
		<div 
			class="relative flex w-full px-2 pb-2 gap-2 justify-between shadow-b-lg md:sticky md:top-[{_button_bar_offset}px] bg-luz" transition:slide="{{duration: 1200, axis: 'y'}}"
		>
			<div class="flex w-[90px]">
				{#if _results.length > 1 && _idx > -1 }
					<button 
						class="p-2 border-2 border-pop bg-lienzo text-pop rounded group relative hover:bg-pop hover:text-lienzo hover:fill-lienzo"
						on:click="{handleBack}"
					>
						{@html icon( "arrowback", 24, 24 )}
						<span class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[44px] left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
							Back
						</span>
							
					</button>

				{/if}

			</div>

			<!-- View Tabs -->
			<div class="flex grow gap-0 justify-center">
				{#if _results.length > 1 && _idx < 0 && _datadrawer }
					{#each view_tabs as tab, i}
						<button 
							class="p-2 border-l-2 border-r-0 last:border-r-2 border-y-2 first:rounded-l last:rounded-r border-primero { _view === tab.view ? 'bg-segundo text-lienzo fill-lienzo' : 'bg-lienzo' } group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
							on:click="{(event)=>{ _view=tab.view; }}"
						>
							{@html icon( tab.icon, 24, 24 )}
							
							<span class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[48px]' : 'bottom-[44px]'} -left-[75%] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
								{tab.tooltip}
							</span>
							
						</button>
					{/each}
							
				{/if}

			</div>

			<div class="flex w-[90px] gap-1 justify-end">
				{#if _results.length > 1 && _idx < 0 && _datadrawer }
					<a
						href="{`/report/summary/${_view}?${json2URL(filterObj( _hit, [ "type", "page" ], false ) )}`}"
						class="flex items-center flex-col rounded shadow-md border-2 border-primero bg-lienzo p-1 hover:bg-segundo hover:text-lienzo tooltiplink"
						target="_blank"
						rel="noreferrer"
						data-title="Summary PDF Report"
					>
						<div class="rounded-full p-1">
							{@html icon( "pdf", 28, 28 )}
							
						</div>

				</a>

				{/if}
				<!-- Redo Analysis -->
				{#if _hit.type === "analysis" }
					<button 
						class="p-2 border-2 border-primero bg-lienzo rounded group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
						on:click="{handleRedo}"
					>
						{@html icon( "tune", 24, 24 )}
						<span class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[48px]' : 'bottom-[44px]'} right-0 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
							Redo Market Analysis
						</span>
							
					</button>

				{/if}
			</div>

		</div>
	{/if}

	{#if _datadrawer}
		<!-- Data -->
		<div transition:slide="{{duration: 1200, axis: 'y'}}">
			<!-- Candidates -->
			{#if _results.length > 1 && _idx < 0}
				<div class="text-sm w-full">

					

					{#each _results as cnd, i}
						<Result idx={i} info={cnd} view={_view} on:pick={handlePick} />

					{/each}
				
					<div class="flex justify-center p-2 {( _results.length % limit ) > 0 ? 'hidden' : '' }">
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
			
			<!-- Prop Information -->
			{:else if _results.length > 0 && _idx > -1}
				<div class="text-sm px-2">
					<PropertyKey 
						pid={_results[ _idx ].pid} 
						gisid={_results[ _idx ].gisid ?? null}
						matid={_results[ _idx ].matid ?? null}
						address={_results[ _idx ].address ?? null} 
						mats={_results[ _idx ].mat ?? [ ]} 
						lat={_results[ _idx ].lat ?? (_results[ _idx ].centroid_lat ?? null)} 
						lng={$page.data.results[ _idx ].lng ?? (_results[ _idx ].centroid_lng ?? null)} 
						x={_results[ _idx ].x ?? (_results[ _idx ].centroid_x ?? null)} 
						y={_results[ _idx ].y ?? (_results[ _idx ].centroid_y ?? null)} 
						mailing_addr={_results[ _idx ].mailing_address} 
						owners={( _results[ _idx ]?.owner ? _results[ _idx ].owner.map( o => formatFullName2( o, false ) ) : [ ] )} 

					/>

					<AssociateInfo 
						sqft={_results[ _idx ].sqft} 
						legal_description={_results[ _idx ].legal_description}
						land_size={_results[ _idx ].land_size}
						land_unit={_results[ _idx ].land_unit}
						fire_district={_results[ _idx ].fire_district}
						special_district={_results[ _idx ].special_district}
						account_type={_results[ _idx ].account_type}
						municipality={_results[ _idx ].municipality}
						land_use_desc={_results[ _idx ].land_use_desc}

					/>

					<TaxInfo pid={_results[ _idx ].pid} assessproid={_results[ _idx ].assessproid} />
						
					<Deed sale={_results[ _idx ].sale ?? [ ]} />
				
					<Location 
						pid={_results[ _idx ].pid} 
						gisid={_results[ _idx ].gisid ?? null}
						lat={_results[ _idx ].lat ?? (_results[ _idx ].centroid_lat ?? null)} 
						lng={_results[ _idx ].lng ?? (_results[ _idx ].centroid_lng ?? null)} 
						x={_results[ _idx ].x ?? (_results[ _idx ].centroid_x ?? null)} 
						y={_results[ _idx ].y ?? (_results[ _idx ].centroid_y ?? null)}
						address={_results[ _idx ].address ?? null} 
						situs={( _results[ _idx ]?.situs ? _results[ _idx ].situs : [ ] )} 

					/>

					{#if _results[ _idx ].gisid}
						<LndAnlyz 
							gisid={_results[ _idx ].gisid}
							sqft={_results[ _idx ].sqft} 
						/>
					{/if}

					<Environmental 
						pid={_results[ _idx ].pid} 
						gisid={_results[ _idx ].gisid ?? null}
						lat={_results[ _idx ].lat ?? (_results[ _idx ].centroid_lat ?? null)} 
						lng={_results[ _idx ].lng ?? (_results[ _idx ].centroid_lng ?? null)} 
						x={_results[ _idx ].x ?? (_results[ _idx ].centroid_x ?? null)} 
						y={_results[ _idx ].y ?? (_results[ _idx ].centroid_y ?? null)}
						
					/>

				</div>

			{/if}

		</div>
	{/if}
	

{/if}

<main>
	<slot/>
	
</main>

<script>
	import {slide} from "svelte/transition"
	import {page} from "$app/stores"
	import {messenger, search, datadrawer} from "$lib/store.js"    
	import {formatFullName2} from "$lib/format"
	import {icon, json2URL, filterObj} from "$lib/utils" 
	import finder from "$lib/finder"
	import AssociateInfo from "$lib/components/prop/AssociateInfo.svelte"
	import Deed from "$lib/components/prop/Deed.svelte"
    import Environmental from "$lib/components/prop/Environmental.svelte"
	import LndAnlyz from "$lib/components/prop/LandAnalysis.svelte"
	import Location from "$lib/components/prop/Location.svelte"
	import PropertyKey from "$lib/components/prop/PropertyKey.svelte"
	import Result from "$lib/components/prop/Result.svelte"
    import TaxInfo from "$lib/components/prop/TaxInfo.svelte"
    
	let screen_size,
		_view,
		_idx,
		_results,
		_hit,
		_poi,
		_button_bar_offset = 68,
		_datadrawer = true

	const limit = 20,
		view_tabs = [
			{ view: "ownership", icon: "person", tooltip: "Ownership View" },
			{ view: "property", icon: "homenwork", tooltip: "Property View" },
			{ view: "deed", icon: "realestateagent", tooltip: "Deed View" },

		],

		handleShowMore = async ( ) => {
			const hit = { ..._hit, page: ( ( _results.length/limit ) + 1 ) },
				rows = await finder( hit, fetch )
				
			if( rows.length > 0 )
				_results = [ ..._results, ...rows ]

		},

		handleBack = event => {
			_idx = -1

		},

		handlePick = event => {
			_idx = event.detail.idx

		},

		handleRedo = event => {
			messenger.set( [ { type: "redo_analysis" } ] )

		},

		handleIndexChange = idx => {
			if( idx !== undefined ){
				if( _results.length > 1 ){
					if( idx > -1 ){
						messenger.set( [ 
							...( _results[ _idx ]?.geom ? [ { type: "add_parcel_graphic", geom: _results[ _idx ].geom, clear_grphs: false } ] : [ ] ),
							{ type: "set_neigh_code", neigh_code: _results[ _idx ].neighborhood_code },
							{ type: "set_gisid_anlyz_buffer", gisid: ( _results[ _idx ].gisid ?? _results[ _idx ].gisid ?? null ) },

						] )


					}else
						messenger.set( [ { type: "zoom_to_centroids" } ] )

				}
				
			}

		},

		getSuppGraphicMsgs = hit => {
			let msgs = [ ]

			switch( hit.type ){
				case "analysis":
					if( hit?.buffer ){
						const arr = hit.buffer.split( "|" )
						msgs.push( { type: "add_buffer_graphic", gisid: arr[ 0 ], buffer: arr[ 1 ] } )

					}else if( hit?.stcode )
						msgs.push( { type: "add_road_graphic", stcode: hit.stcode } )

					break

				case "buffer":
					msgs.push( { type: "add_buffer_graphic", gisid: hit.gisid, buffer: hit.buffer } )	
					break

				case "road":
					msgs.push( { type: "add_road_graphic", stcode: hit.stcode } )
					break

			}

			return msgs

		},

		handleResultsChange = ( results ) => {
			if( results !== undefined ){
				let msgs = [ ]

				if( _results.length > 1 ){ //set of candidates
					let gisids = [ ],
						centroids = [ ]

					_results.forEach( item => { 
						if( item?.gisid && !gisids.includes( item.gisid ) && item?.centroid_x && item?.centroid_y ){
							gisids.push( item.gisid )
							centroids.push( { x: item.centroid_x, y: item.centroid_y } )

						}

					} )
				
					msgs = [ 
						...( centroids.length > 0 ? [ { type: "add_centroid_graphic", centroids: centroids } ] : [ ] ),
						...( centroids.length === 0 ? [ { type: "zoom_to_full_extent" } ] : [ ] ),
						...getSuppGraphicMsgs( _hit ),
						{ type: "set_gisid_anlyz_buffer", gisid: null }, 

					]

				}else if( _results.length > 0 ) //selection
					msgs = [
						{ type: "set_neigh_code", neigh_code: _results[ _idx ].neighborhood_code },
						...( _results[ _idx ]?.geom ? [ { type: "add_parcel_graphic", geom: _results[ _idx ].geom, clear_grphs: true } ] : [ ] ),
						...( !_results[ _idx ]?.geom ? [ { type: "zoom_to_full_extent" } ] : [ ] ),
						...getSuppGraphicMsgs( _hit ),
						{ type: "set_gisid_anlyz_buffer", gisid: ( _results[ _idx ].gisid ?? _results[ _idx ].gisid ?? null ) },
					]

				else //no results returned most probably point of interest
					msgs = [ 
						( ( _poi?.x && _poi?.y ) ? { type: "add_poi_graphic", x: _poi.x, y: _poi.y } : { } ),	
						{ type: "set_gisid_anlyz_buffer", gisid: null },
						
					]
				
				if( msgs.length > 0 )
					messenger.set( msgs )

			}

		}

	//Subscriptions
	search.subscribe( value => { 
		switch( value ){
			case "main": _button_bar_offset = 68; break
			case "owner": _button_bar_offset = 174; break
			case "situs": _button_bar_offset = 118; break
			case "prelimplan": _button_bar_offset = 112; break
			case "enggrid": _button_bar_offset = 112; break

		}

	} )

	datadrawer.subscribe( value => { _datadrawer = value } )

	//Reactives
	$: if( $page ){
		_hit = $page.data.hit
		_results = $page.data.results
		_idx = $page.data.idx
		_view = $page.data.view
		_poi = $page.data.poi
			
	}

	$: { handleIndexChange( _idx ) }
	$: { handleResultsChange( _results ) }
		
</script>

<style>
	a.tooltiplink {
    	position: relative;
	}
 
	a.tooltiplink:hover::after {
		content: attr(data-title);
		background-color: theme("colors.primero");
		color: #fff;
		padding: 0.5em;
		border-radius: 0.9em;
		font-size: 0.85em;
		line-height: 1em;
		display: block;
		position: absolute;
		top: 109%;
		left: -28px;
		transform: translateX(-50%);
		white-space: nowrap;
		z-index: 1;
	}

</style>