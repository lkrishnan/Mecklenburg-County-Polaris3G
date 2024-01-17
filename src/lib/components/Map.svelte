<div class="h-screen cursor-pointer" id="viewDiv">
	{#if mounted }
		<!-- Select/Identify Tools-->
		{#if [ "click_srch", "select_srch", "identify" ].includes( local_state.map_tool )}
			<div 
				in:fly="{{ y: -180, duration: 1200 }}" out:fly="{{ y: -180, duration: 1200 }}"
				class="absolute z-10 left-0 top-16 md:top-0 ml-2 md:ml-[466px] mt-[6px] flex flex-col"
			>
				{#each tools.filter( tool => tool.type === "select_tools" ) as tool, i}
					{#if ( tool.only_mobile ? _mobile : true ) }
						<button 
							class="border-x-2 first:border-t-2 border-b-2 border-primero p-1.5 {local_state.map_tool === tool.id ? 'bg-segundo text-lienzo' : 'bg-lienzo'} first:rounded-t last:rounded-b group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo disabled:bg-todo"
							on:click="{event=>{handle.tool_action( tool.id );}}"
							disabled="{tool.disabled}"
						>
							{@html icon( tool.icon, 24, 24 )}
							{#if !local_state.open}
								<span
									class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] left-[40px] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
								>
									{tool.tooltip}
								</span>
							{/if}

						</button>

					{/if}
					
				{/each}

			</div>

		{/if}

		{#if local_state.main_tool === "basemap_mobile"}
			<div
				in:fly="{{ y: 180, duration: 1200 }}" out:fly="{{ y: 180, duration: 1200 }}"
				class="absolute bottom-0 right-0 z-40 w-full md:w-[350px] h-2/4 md:h-full shadow-md bg-luz"
			>
				<div class="flex flex-row items-center gap-2 p-2 bg-primero text-lienzo">
					<div class="grow text-sm font-bold">Basemap</div>

					<button 
						class="p-1 transition-colors duration-150 focus:shadow-outline rounded-full hover:text-primero hover:bg-lienzo"
						on:click="{(event)=>{local_state.main_tool=null}}"
					>
						{@html icon( "close", 24, 24 )}

					</button>

				</div>

				<div class="p-2">
					<BasemapToggleMobile on:basemap_change={handle.basemap_change} on:aerial_yr_change={handle.aerial_change} />

				</div>

			</div>

		{:else if local_state.main_tool === "overlays"}
			<div
				in:fly="{( _mobile ? { y: 180, duration: 1200 } : { x: 180, duration: 1200 })}" out:fly="{( _mobile ? { y: 180, duration: 1200 } : { x: 180, duration: 1200 })}"
				class="absolute bottom-0 right-0 z-40 w-full md:w-[350px] h-2/4 md:h-full shadow-md bg-luz"
			>
				<div class="flex flex-row items-center gap-2 p-2 bg-primero text-lienzo">
					<div class="grow text-sm font-bold">Overlays</div>

					<button 
						class="p-1 transition-colors duration-150 focus:shadow-outline rounded-full hover:text-primero hover:bg-lienzo"
						on:click="{(event)=>{local_state.main_tool=null}}"
					>
						{@html icon( "close", ( _mobile ? 24 : 20 ), ( _mobile ? 24 : 20 ) )}

					</button>

				</div>

				<div class="text-sm dark:bg-gray-700 p-2 w-full h-full overflow-auto scrollbar">
					{#each overlays_data as item, i}
						<AccordionItem entry={item} on:active_tab_change={handle.accordion_tab_change} on:overlay_toggle="{(event)=>{ handle.overlay_toggle( i, event.detail.lyr_idx, event.detail.checked ) }}" />
					{/each}

				</div>


			</div>

		{:else if local_state.main_tool === "print"}
			<div
				in:fly="{{ y: -180, duration: 1200 }}" out:fade
				class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-[250px] md:w-[350px] min-h-[256px] max-h-[600px] border-2 border-primero bg-luz rounded overflow-auto"
			>
				<div class="flex flex-row items-center gap-2 p-2 bg-primero text-lienzo">
					<div class="grow text-sm font-bold">Print</div>

					<button 
						class="p-1 transition-colors duration-150 focus:shadow-outline rounded-full hover:text-primero hover:bg-lienzo"
						on:click="{(event)=>{local_state.main_tool=null; local_state.blackout=false}}"
					>
						{@html icon( "close", ( _mobile ? 24 : 20 ), ( _mobile ? 24 : 20 ) )}

					</button>

				</div>

				<div class="text-sm dark:bg-gray-700 p-2">
					<div class="mb-2">
						<label class="block text-sm font-bold mb-2" for="map_layout">
							Map Layout
						</label>

						<Selecto 
							items={local_state.print_layouts} 
							bind:selected={local_state.sel_print_layout}

						/>

					</div>

					
						<div class="mb-2">
							<label class="block text-sm font-bold mb-2" for="map_title">
								Map Title
							</label>

							<input 
								type="text" 
								class="w-full px-3 py-3.5 border border-primero focus:outline-segundo text-sm rounded block" 
								placeholder="Enter Tile" 
								bind:value="{local_state.print_title}"
								disabled={local_state.sel_print_layout === 2}
							/>

						</div>

					
						<div class="flex gap-2 w-full mb-2">
							<div class="flex items-center">
								<input 
									type="checkbox" 
									value=""
									bind:checked={local_state.print_add_legend}
									class="w-4 h-4 rounded checked:bg-primero text-primero bg-primero cursor-pointer"
									disabled={local_state.sel_print_layout === 2}
								/>
							</div>
							<div class="flex items-center">
								<label for="add_legend" class="text-sm font-medium text-todo">
									Add Legend
								</label>
							</div>
													
						</div>

					

					<div class="flex flex-row gap-4 items-center cursor-default">
						{#if local_state.print_url === "progress"}
							<div class="p-2">
								{@html icon( "spinner", 24, 24 )}	
							</div>
							
							
						{:else}
							<button
								class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
								on:click="{event=>{handle.print( )}}"
							>
								Go
							</button>

							{#if local_state.print_url}
								{#if local_state.print_url === "error"}
									<div class="flex flex-row text-pop items-center gap-1">
										{@html icon( "alert", 24, 24 )}
										Error
									</div>
									

								{:else}
									<a 
										class="text-segundo underline underline-offset-4 hover:text-primero" 
										href="{local_state.print_url}" 
										target="_blank"
										rel="noreferrer"
									>
										Print Map
								
									</a>

								{/if}

							{/if}
							
						{/if}

						

					</div>
							
				</div>

			</div>

		{:else if local_state.main_tool === "measure_toolbar"}
			<!-- Measure Toolbar -->
			<div 
				in:fly="{{ y: -180, duration: 1200 }}" out:fly="{{ y: -180, duration: 1200 }}"
				class="absolute z-10 right-0 top-16 md:top-0 m-2 p-0 flex flex-col gap-2"
			>
				{#each tools.filter( tool => tool.type === "measure_tools" ) as tool, i}
					{#if ( tool.only_mobile ? _mobile : true ) }
						<button 
							class="p-2 {tool.pop ? 'bg-pop' : 'bg-primero'}  text-lienzo fill-lienzo rounded-full shadow-md group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
							on:click="{event=>{handle.tool_action(tool.id)}}"
							disabled="{tool.disabled}"
						>
							{@html icon( tool.icon, 24, 24 )}
							{#if !local_state.open}
								<span
									class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
								>
									{tool.tooltip}
								</span>
							{/if}

						</button>
				
					{/if}

				{/each}

			</div>

		{:else if local_state.main_tool === "markup_toolbar"}
			<!-- Markup Toolbar -->
			<div 
				in:fly="{{ y: -180, duration: 1200 }}" out:fly="{{ y: -180, duration: 1200 }}"
				class="absolute z-10 right-0 top-16 md:top-0 m-2 p-0 flex flex-col gap-2"
			>
				{#each tools.filter( tool => tool.type === "markup_tools" ) as tool, i}
					{#if ( tool.only_mobile ? _mobile : true ) }
						<button 
							class="p-2 {tool.pop ? 'bg-pop' : 'bg-primero'}  text-lienzo fill-lienzo rounded-full shadow-md group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
							on:click="{event=>{handle.tool_action(tool.id)}}"
							disabled="{tool.disabled}"
						>
							{@html icon( tool.icon, 24, 24 )}
							{#if !local_state.open}
								<span
									class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
								>
									{tool.tooltip}
								</span>
							{/if}

						</button>

					{/if}

				{/each}

			</div>

		{:else}
			<div 
				in:fly="{{ y: -180, duration: 1200 }}" out:fly="{{ y: -180, duration: 1200 }}"
				class="absolute z-10 right-0 top-16 md:top-0 m-2 p-0 flex flex-col gap-2"
			>
				{#each tools.filter( tool => tool.type === "main_tools" ) as tool, i}
					{#if ( tool.only_mobile ? _mobile : true ) }
						<button 
							class="p-2 bg-primero text-lienzo fill-lienzo rounded-full shadow-md group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
							on:click="{event=>{local_state.main_tool=tool.id; handle.tool_action(tool.id, "open");}}"
							disabled="{tool.disabled}"
						>
							{@html icon( tool.icon, 24, 24 )}
							<span
								class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
							>
								{tool.tooltip}
							</span>
							

						</button>
					{/if}

				{/each}

			</div>

		{/if}

		<!-- Right-Bottom Tools -->
		<div class="flex absolute right-0 bottom-0 m-2">
			{#if _mobile}
				{#if ( $page.route.id.match( /(prop)|identify/ig ) && !_datadrawer ) }
					<button 
						class="p-2 bg-primero text-lienzo fill-lienzo rounded-full shadow-md group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
						on:click="{datadrawer.set( !_datadrawer )}"
					>
						{@html icon( "expandless", 24, 24 )}
						<span
							class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
						>
							Show Data
						</span>
					
					</button>
				{/if}

			{:else}
				<BasemapToggle on:basemap_change={handle.basemap_change} on:aerial_yr_change={handle.aerial_change} />
			{/if}
		</div>
		

		<!-- Blackout -->
		{#if local_state.blackout}
			{#if [ "measure_toolbar", "markup_toolbar" ].includes( local_state.main_tool )}
				<div
					in:fly="{{ y: -180, duration: 1200 }}" out:fade
					class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-[250px] md:w-[350px] max-h-[600px] border-2 border-primero bg-luz rounded overflow-auto"
				>
					<div class="flex flex-row items-center gap-2 p-2 bg-primero text-lienzo">
						<div class="grow text-sm font-bold">Erase Graphics</div>

					</div>

					<div class="text-sm p-2">
						{@html `Select graphics to delete individually.<br/> Do you want to erase all ${local_state.main_tool === "measure_toolbar" ? "measure" : "markup" } graphics?` } 
					</div>

					<div class="flex flex-row justify-center pb-2 gap-10">
						<button
							class="bg-pop border border-pop text-lienzo hover:text-pop hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
							on:click="{(event)=>{clearSketch( local_state.main_tool )}}"
						>
							Yes
						</button>

						<button
							class="bg-pop border border-pop text-lienzo hover:text-pop hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
							on:click="{(event)=>{local_state.blackout = false}}"
						>
							No
						</button>

					</div>

				</div>
			{/if}

			<div class="absolute left-0 top-0 z-30 h-full w-full bg-suave opacity-80">
			
			</div>
		
		{/if}

	{/if}
	
</div>

<script>
	//Svelte Libraries
    import {onMount} from "svelte"
	import {goto} from "$app/navigation"
	import {fade, fly} from "svelte/transition"
	import {page} from "$app/stores"

	//Store
	import {messenger, offset, mobile, datadrawer, results_index} from "$lib/store"

	//Custom Libraries
	import {getGeom} from "$lib/mapping"
	import {srchstr2qrystr, json2URL, icon} from "$lib/utils"

	import AccordionItem from "$lib/components/AccordionItem.svelte"
	import BasemapToggle from "$lib/components/BasemapToggle.svelte"
	import BasemapToggleMobile from "$lib/components/BasemapToggleMobile.svelte"
	import Selecto from "$lib/components/Selecto.svelte"

	import overlays_data from "$lib/data/overlays"

	// ArcGIS API Library Variables
	let Extent, GeometryEngine, Graphic, GraphicsLayer, LegendLayer, Map, MapImageLayer, MapView, PrintTask, PrintParameters, ReactiveUtils, SketchViewModel, TileLayer

	//Store Variables
	let _offset, _mobile, _datadrawer
			
	// Other Variables
	let mounted = false,
		view, map, tile_lyrs, overlay_lyrs, cnd_lyr, sel_lyr, misc_lyr, id_lyr, sketch_lyr,
		sketch_widget, area_widget, dist_widget

	// Constants
	const local_state = {
			//basemap toggle
			basemap_idx: 3,
			aerial_yr: "2023",

			//map
			zoom_to: true,

			//identify
			id_lyr: "juris",

			//toolbox
			map_tool: "click_srch",
			main_tool: null,
			measure_tool: null,
			markup_tool: null,
			measurement: null,
			measure_list: { },
			markup_list: [ ],
			select_srch_uid: null,

			//print
			print_layouts: [ 
				//{ label: "Landscape 11 x 8.5", value: "letter-ansi-a-landscape" },
				//{ label: "Portrait 11 x 8.5", value: "letter-ansi-a-portrait" },
				{ label: "Landscape 11 x 8.5", value: "Landscape8x11" },
				{ label: "Portrait 11 x 8.5", value: "Portrait8x11" },
				{ label: "Screenshot", value: "MAP_ONLY" },


			],
			sel_print_layout: 0,
			print_title: null, 
			print_add_legend: false,
			print_url: null,

			blackout: false,

		},
		
		basemaps = {
			0: [ "topo", "hollow" ],
			1: [ `aerial_${local_state.aerial_yr}`, "hollow" ],
			2: [ `aerial_${local_state.aerial_yr}` ],
			3: [ "streets" ],
		
		},

		full_extent = { xmin: 1384251.24585599, ymin: 460978.995855999, xmax: 1537013.50075424, ymax: 660946.333333335, },

		symbols = {
			sel_parcel: { type: "simple-line", color: [ 0, 255, 102 ], width: 3 },
			cnd_parcel: { type: "simple-fill", color: [ 234, 88, 12, 0.3 ], outline: { color: [ 234, 88, 12, 1], width: "3px" } },
			cnd_label: { 
				type: "text", color: "white", haloColor: [ 234, 88, 12, 1 ], haloSize: "2",  
				font: { size: "12", family: "Arial",  weight: "bold" }
			},
			//cnd_centroid: { type: "simple-marker", style: "circle", size: "12px", color: [ 0, 255, 102, 1 ], outline: { color: [ 0, 255, 102, 1 ], width: "2px" } },
			/*cnd_centroid: { 
				type: "text", color: "black", haloColor: [ 0, 255, 102, 1 ], haloSize: "14",  
				font: { size: "14", family: "Arial",  weight: "bold" }
			},*/


			identify: { type: "simple-marker", color: "#7dd3fc", size: "30px", outline: { color: "#075985", width: "2px", }, path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", },
			poi: { type: "simple-marker", color: "#7dd3fc", size: "30px", outline: { color: "#075985", width: "2px", }, path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", },
			sel_road: { type: "simple-line", color: [ 47, 204, 110 ], width: 4 },
			sel_addr: { type: "simple-marker", color: [ 47, 204, 110 ], size: 5, outline: { width: 1, color: [ 47, 204, 110 ] } },
			buffer: { type: "simple-fill", color: [  255, 0, 0, 0.35 ], style: "solid", outline: { color: [  255, 0, 0, 0.35  ], width: 2 } },
			select_search: { type: "simple-fill", color: [ 0, 255, 102, 0.7 ], style: "forward-diagonal", outline: { color: [ 0, 255, 102, 1 ], width: "3px" } },
			pt_markup: { type: "simple-marker", style: "circle", size: "14px", color: [ 192, 38, 211, 0.5 ], outline: { color: [ 192, 38, 211, 1 ], width: "3px" } },
			line_markup: { type: "simple-line", color: [ 192, 38, 211, 1 ], width: "3px", style: "solid" },
			poly_markup: { type: "simple-fill", color: [ 192, 38, 211, 0.3 ], style: "solid", outline: { color: [ 192, 38, 211, 1 ], width: "3px" } },
			sketch_label: { type: "text", color: "white", haloColor: [ 191, 54, 38 ], haloSize: "2px",  font: { size: "14px", family: "Arial", weight: "bold" } }, 
			dist_measure: { type: "simple-line", style: "short-dash", color: [ 191, 54, 38 ], width: "3px" },
			area_measure: { type: "simple-fill", color: [  191, 54, 38, 0.3 ], style: "solid", outline: { color: [  191, 54, 38, 1 ], width: "3px", style: "short-dash" } },

		},

		handle =  {
			print: async ( ) => {
				try{
					local_state.print_url = "progress"

					const getLegendLayers = ( ) => {
							return Object.keys( overlay_lyrs )
									.filter( lyr_id => overlay_lyrs[ lyr_id ].sublayers.items.filter( item => item.visible ).length > 0 )
									.map( lyr_id => ( new LegendLayer( { 
															layerId: lyr_id, 
															subLayerIds: overlay_lyrs[ lyr_id ].sublayers.items.filter( item => item.visible ).map( item => item.id ),
															title: overlay_lyrs[ lyr_id ].title
													} ) )
									) 

						},
						
						getLayoutOption = ( ) => {
							return { 
									titleText: local_state.print_title, 
									authorText: "Mecklenburg County GIS",
									...( local_state.print_add_legend ? { legendLayers: getLegendLayers( ) } : { } )
								}
						},
					
						print_resp = await PrintTask.execute( 
							"https://polaris3g.mecklenburgcountync.gov/server/rest/services/ExportPrintMap/GPServer/Export%20Web%20Map",
							new PrintParameters( {
								view: view,
								template: {
									format: ( local_state.sel_print_layout < 2 ? "pdf" : "png8" ),
									layout: local_state.print_layouts[ local_state.sel_print_layout ].value + ( local_state.print_add_legend && local_state.sel_print_layout < 2 ? "Legend" : "" ),
									scalePreserved: true,
									exportOptions: {
										dpi: 96,
										...( local_state.sel_print_layout === 2 ? { width: view.width, height: view.height } : { } )

									},
									...( local_state.sel_print_layout < 2 ? { layoutOptions: getLayoutOption( ) } : { } )
									
								}

							} ) )

					local_state.print_url = print_resp.url

				}catch( err ){
					local_state.print_url = "error"

				}

			},

			accordion_tab_change: event => {
				overlays_data.forEach( ( item, i ) => {
					overlays_data[ i ].open = ( item.id === event.detail.tab ? true : false )

				} )

			},

			aerial_change: event => {
				const aerial_yr = event.detail.new_aerial_yr

				map.remove( map.findLayerById( `aerial_${local_state.aerial_yr}` ) )
				map.add( tile_lyrs[ `aerial_${aerial_yr}` ], 0 )

				Object.keys( basemaps ).forEach( key => {
					if( basemaps[ key ].includes( `aerial_"${local_state.aerial_yr}` ) )
						basemaps[ key ][ 0 ] = `aerial_${aerial_yr}`
					
				} )

				local_state.aerial_yr = aerial_yr

			},

			basemap_change: event => {
				const new_basemap_idx = event.detail.new_basemap_idx

				map.removeMany( basemaps[ local_state.basemap_idx ].map( lyr_id => map.findLayerById( lyr_id ) ) )
				map.addMany( basemaps[ new_basemap_idx ].map( lyr_id => tile_lyrs[ lyr_id ] ), 0 )
				local_state.basemap_idx = new_basemap_idx

			},

			overlay_toggle: ( group_idx, lyr_idx, visible ) => {
				let layer,
					sub_lyrs = ( lyr_idx === -1 ? overlays_data[ group_idx ].sublyrs : overlays_data[ group_idx ][ "children" ][ lyr_idx ].sublyrs )

				Object.keys( sub_lyrs ).forEach( key => {
					layer = map.findLayerById( key )

					sub_lyrs[ key ].forEach( id => {
						const sublyr = layer.findSublayerById( id )
						sublyr.visible = visible

					} )
					
				} )

			},

			tool_action: ( tool, action=null ) => {
				switch( tool ){
					case "click_srch": case "identify":
						if( sketch_widget ){
							if( sketch_widget.activeTool )
								sketch_widget.complete( )

						}

						local_state.map_tool = tool

						break

					case "select_srch": 
						local_state.map_tool = tool
						if( !sketch_widget )
							inits.sketch_widget( )
							 
						sketch_widget.polygonSymbol = symbols.select_search
						sketch_widget.updateOnGraphicClick = false
						sketch_widget.create( "polygon" )
							
						break

					case "print":
						local_state.blackout = true
						break

					case "measure_toolbar":
						local_state.map_tool = null
						local_state.measure_toolbar_open = ( action === "open")

						if( dist_widget )
							dist_widget.updateOnGraphicClick = true

						if( area_widget )
							area_widget.updateOnGraphicClick = true

						break

					case "dist_measure":
						local_state.map_tool = tool

						if( !dist_widget )
							inits.dist_widget( )

						dist_widget.create( "polyline" )
						break

					case "area_measure":
						local_state.map_tool = tool

						if( !area_widget )
							inits.area_widget( )

						area_widget.create( "polygon" )

						break

					case "erase_measure":
						if( dist_widget ){
							if( dist_widget.updateGraphics.length > 0 )
								dist_widget.delete( )
							else{
								local_state.blackout = true
							}


						}

						if( area_widget ){
							if( area_widget.updateGraphics.length > 0 )
								area_widget.delete( )
							else{
								local_state.blackout = true
							}
							
						}
							
						break

					case "measure_exit":
						if( dist_widget ){
							if( dist_widget.activeTool )
								dist_widget.complete( )					

							dist_widget.updateOnGraphicClick = false

						}

						if( area_widget ){
							if( area_widget.activeTool )
								area_widget.complete( )
							
							area_widget.updateOnGraphicClick = false

						}

						local_state.measure_tool = null
						local_state.main_tool = null
						local_state.map_tool = "click_srch"
						break

					//*****************************/

					case "markup_toolbar":
						local_state.map_tool = null
						local_state.markup_toolbar_open = ( action === "open")
						break

					case "pt_markup": 
						local_state.map_tool = tool

						if( !sketch_widget )
							inits.sketch_widget( )

						sketch_widget.pointSymbol = symbols.pt_markup
						sketch_widget.updateOnGraphicClick = true
						sketch_widget.create( "point" )
						break

					case "line_markup": 
						local_state.map_tool = tool

						if( !sketch_widget )
							inits.sketch_widget( )
													
						sketch_widget.polylineSymbol = symbols.line_markup
						sketch_widget.updateOnGraphicClick = true
						sketch_widget.create( "polyline" )
						break

					case "poly_markup": 
						local_state.map_tool = tool

						if( !sketch_widget )
							inits.sketch_widget( )

						sketch_widget.polygonSymbol = symbols.poly_markup
						sketch_widget.updateOnGraphicClick = true
						sketch_widget.create( "polygon" )
						break

					case "erase_markup":
						if( sketch_widget ){
							if( sketch_widget.updateGraphics.length > 0 )
							sketch_widget.delete( )
							else
								local_state.blackout = true
							
						}
						break

					case "markup_exit":
						local_state.markup_tool = null
						local_state.main_tool = null
						local_state.map_tool = "click_srch"
						break

				}

			}

		},

		tools = [ 
			{ icon: "arrowselect", id: "click_srch", tooltip: "Click Search", type: "select_tools", only_mobile: false, pop:false },
			{ icon: "selectsrch", id: "select_srch", tooltip: "Polygon Search", disabled: true, type: "select_tools", only_mobile: false, pop:false },
			{ icon: "id", id: "identify", tooltip: "Identify Layer", type: "select_tools", only_mobile: false, pop:false },
			
			{ icon: "map", id: "basemap_mobile", tooltip: "Basemap", type: "main_tools", only_mobile: true, pop:false },
            { icon: "overlays", id: "overlays", tooltip: "Overlays", type: "main_tools", only_mobile: false, pop:false },
			{ icon: "print", id: "print", tooltip: "Print", type: "main_tools", only_mobile: false, pop:false },
			{ icon: "tape", id: "measure_toolbar", tooltip: "Measure", type: "main_tools", only_mobile: false, pop:false, }, 
			{ icon: "draw", id: "markup_toolbar", tooltip: "Markup", type: "main_tools", only_mobile: false, pop:false, }, 
									 
			{ icon: "ruler", id: "dist_measure", tooltip: "Distance Measure", type: "measure_tools", only_mobile: false, pop:false },
            { icon: "setsquare", id: "area_measure", tooltip: "Area Measure", type: "measure_tools", only_mobile: false, pop:false },
			{ icon: "trash", id: "erase_measure", tooltip: "Erase Measure Graphics", type: "measure_tools", only_mobile: false, pop:false, disabled: true, },
			{ icon: "close", id: "measure_exit", tooltip: "Exit Measure Toolbar", type: "hidden_tools", type: "measure_tools", only_mobile: false, pop:true }, 

			{ icon: "markuppt", id: "pt_markup", tooltip: "Point Markup", type: "markup_tools", only_mobile: false, pop:false },
			{ icon: "markupline", id: "line_markup", tooltip: "Line Markup", type: "markup_tools", only_mobile: false, pop:false },
			{ icon: "markuppoly", id: "poly_markup", tooltip: "Poly Markup", type: "markup_tools", only_mobile: false, pop:false },
			{ icon: "trash", id: "erase_markup", tooltip: "Erase Markup Graphics", type: "markup_tools", only_mobile: false, pop:false, disabled: true, },
			{ icon: "close", id: "markup_exit", tooltip: "Exit Markup Toolbar", type: "markup_tools", only_mobile: false, pop:true },

		],

		inits = {
			sketch_widget: ( ) => {
				sketch_widget = new SketchViewModel( { 
					view: view, 
					layer: sketch_lyr
					
				} )

				sketch_widget.on( "create", event => { 
					if( event.state === "complete" ){
						if( local_state.map_tool === "select_srch" ){
							if( event.graphic ){
								doSelectSearch( event.graphic.geometry )	
						
								//remove select search polygon
								sketch_lyr.remove( sketch_lyr.graphics.filter( grph => grph.uid == event.graphic.uid ).items[ 0 ] )
								sketch_widget.create( "polygon" )

							}

						}else{
							local_state.markup_list.push( event.graphic.uid )
							//adjust erase tool's disabled property
							tools[ ( tools.findIndex( tool => tool.id === "erase_markup" ) ) ].disabled = false

						}
								
					}
						
				} )

				sketch_widget.on( "delete", event => { 
					const uid = event.graphics[ 0 ].uid

					if( local_state.map_tool !== "select_srch" ){
						const index = local_state.markup_list.indexOf( uid )
						
						if( index !== -1 )
							local_state.markup_list.splice( index, 1 )

						//adjust erase tool's disabled property
						tools[ ( tools.findIndex( tool => tool.id === "erase_markup" ) ) ].disabled = ( local_state.markup_list.length === 0 )

					}
						
				} )	

			},

			area_widget: ( ) => {
				area_widget = new SketchViewModel( { 
					view: view, 
					layer: sketch_lyr, 
					polygonSymbol: symbols.area_measure  

				} )

				area_widget.on( "create", event => { 
					if( event.state === "complete" ){
						const geom = event.graphic.geometry,
							area = GeometryEngine.planarArea( geom, "acres" )

						addLabel( geom.centroid, event.graphic.uid, `${area.toFixed( 2 )} acres` )

						//adjust erase tool's disabled property
						tools[ ( tools.findIndex( tool => tool.id === "erase_measure" ) ) ].disabled = false
						
					}
					
				} )

				area_widget.on( "update", event => { 
					if( event.state === "complete" ){
						const uid = event.graphics[ 0 ].uid
						
						if( local_state.measure_list.hasOwnProperty( uid ) ){
							const geom = event.graphics[ 0 ].geometry,
								area = GeometryEngine.planarArea( geom, "acres" ),
								lbl_grph = sketch_lyr.graphics.filter( grph => grph.uid == local_state.measure_list[ uid ] ).items[ 0 ]

							//remove old label
							sketch_lyr.remove( lbl_grph )
							//add new label							
							addLabel( geom.centroid, uid, `${area.toFixed( 2 )} acres` )

						}

					}

				} )

				area_widget.on( "delete", event => { 
					const uid = event.graphics[ 0 ].uid
						
					if( local_state.measure_list.hasOwnProperty( uid ) ){
						const lbl_grph = sketch_lyr.graphics.filter( grph => grph.uid == local_state.measure_list[ uid ] ).items[ 0 ]

						sketch_lyr.remove( lbl_grph )
						//delete entry in sketch to label mapping
						delete local_state.measure_list[ uid ]

						//adjust erase tool's disabled property
						tools[ ( tools.findIndex( tool => tool.id === "erase_measure" ) ) ].disabled = ( Object.keys( local_state.measure_list ).length === 0 )
						
					}

				} )	

			},

			dist_widget: ( ) => {
				dist_widget = new SketchViewModel( { 
					view: view, 
					layer: sketch_lyr, 
					polylineSymbol: symbols.dist_measure 

				} )

				dist_widget.on( "create", event => { 
					if( event.state === "complete" ){
						if( event.graphic ){
							const geom = event.graphic.geometry,
								dist = GeometryEngine.planarLength( geom, "feet" )

							addLabel( geom.extent.center, event.graphic.uid, `${dist.toFixed( 2 )} ft` )

							//adjust erase tool's disabled property
							tools[ ( tools.findIndex( tool => tool.id === "erase_measure" ) ) ].disabled = false

						}
						
					}
					
				} )
				dist_widget.on( "update", event => { 
					if( event.state === "complete" ){
						const uid = event.graphics[ 0 ].uid
						
						if( local_state.measure_list.hasOwnProperty( uid ) ){
							const geom = event.graphics[ 0 ].geometry,
								dist = GeometryEngine.planarLength( geom, "feet" ),
								lbl_grph = sketch_lyr.graphics.filter( grph => grph.uid == local_state.measure_list[ uid ] ).items[ 0 ]

							//remove old label
							sketch_lyr.remove( lbl_grph )
							//add new label							
							addLabel( geom.extent.center, uid, `${dist.toFixed( 2 )} ft` )

						}

					}

				} )

				dist_widget.on( "delete", event => { 
					const uid = event.graphics[ 0 ].uid
						
					if( local_state.measure_list.hasOwnProperty( uid ) ){
						const lbl_grph = sketch_lyr.graphics.filter( grph => grph.uid == local_state.measure_list[ uid ] ).items[ 0 ]

						sketch_lyr.remove( lbl_grph )
						//delete entry in sketch to label mapping
						delete local_state.measure_list[ uid ]

						//adjust erase tool's disabled property
						tools[ ( tools.findIndex( tool => tool.id === "erase_measure" ) ) ].disabled = ( Object.keys( local_state.measure_list ).length === 0 ) 

					}

				} )	

			}

		},

		addLabel = ( pt, parent_uid, txt ) => {
			const label = new Graphic( pt, { ...symbols.sketch_label, text: txt, } )

			//Add label to map and update the sketch to label mapping	
			sketch_lyr.add( label )
			local_state.measure_list[ parent_uid ] = label.uid

		},

		clearSketch = typ => {
			const key_val = {
					"measure_toolbar": "measure_list",
					"markup_toolbar": "markup_list",

				},
				uids = [ 
						...Object.keys( local_state[ key_val[ typ ] ] ).map( val => parseInt( val ) ), 
						...Object.values( local_state[ key_val[ typ ] ] ), 

					],
				grphs = sketch_lyr.graphics.filter( grph => uids.includes( grph.uid ) ).items

			//Clear all graphics based on type (measure/markup)
			sketch_lyr.removeMany( grphs )

			//Clear measure_list and markup_list that maps sketch to its label
			local_state[ key_val[ typ ] ] = { }	

			//adjust erase tool's disabled property
			tools[ ( tools.findIndex( tool => tool.id === "erase_measure" ) ) ].disabled = ( Object.keys( local_state.measure_list ).length === 0 )
			tools[ ( tools.findIndex( tool => tool.id === "erase_markup" ) ) ].disabled = ( Object.keys( local_state.markup_list ).length === 0 )

			//remove map blackout
			local_state.blackout = false
			
		},

		doSelectSearch = geom => {
			const rings = geom.toJSON( ).rings,
				hit = { value: `${JSON.stringify( rings )}`, type: "poly", rings: rings }
			
			local_state.zoom_to = true
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

		}

	onMount( async ( ) => {
		// Lazy Load ArcGIS API libraries 
		Extent = ( await import( "@arcgis/core/geometry/Extent" ) ).default
		GeometryEngine = await import( "@arcgis/core/geometry/geometryEngine" )
		Graphic = ( await import( "@arcgis/core/Graphic" ) ).default
		GraphicsLayer = ( await import( "@arcgis/core/layers/GraphicsLayer" ) ).default
		LegendLayer = ( await import( "@arcgis/core/rest/support/LegendLayer.js" ) ).default
		Map = ( await import( "@arcgis/core/Map" ) ).default
		MapImageLayer = ( await import( "@arcgis/core/layers/MapImageLayer" ) ).default
		MapView = ( await import( "@arcgis/core/views/MapView" ) ).default
		PrintTask = await import( "@arcgis/core/rest/print" )
		PrintParameters = ( await import( "@arcgis/core/rest/support/PrintParameters" )  ).default
		ReactiveUtils = await import( "@arcgis/core/core/reactiveUtils" )
		SketchViewModel = ( await import( "@arcgis/core/widgets/Sketch/SketchViewModel" ) ).default
		TileLayer = ( await import( "@arcgis/core/layers/TileLayer" ) ).default

		// Lazy Load Data
		//overlays_data = ( await import ( "$lib/data/overlays" ) ).default
		
		//Initialize Layers
		tile_lyrs = {
				streets: new TileLayer( { 
					id: "streets",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/basemap/MapServer"
				} ),
				/*streets: new TileLayer({
					id: "streets",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/basemap/VectorBasemap/MapServer"
				} ),*/

				hollow: new TileLayer( { 
					id: "hollow",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/basemap_aerial/MapServer"
				} ),

				topo: new TileLayer( { 
					id: "topo",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/topohillshade/MapServer"
				} ),

				aerial_2023: new TileLayer( { 
					id: "aerial_2023",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/aerial2023/MapServer"
				} ),

				aerial_2022: new TileLayer( { 
					id: "aerial_2022",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2022/MapServer"
				} ),

				aerial_2021: new TileLayer( { 
					id: "aerial_2021",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2021/MapServer"
				} ),

				aerial_2020: new TileLayer( { 
					id: "aerial_2020",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2020/MapServer"
				} ),

				aerial_2019: new TileLayer( { 
					id: "aerial_2019",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2019/MapServer"
				} ),

				aerial_2018: new TileLayer( { 
					id: "aerial_2018",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2018/MapServer"
				} ),

				aerial_2017: new TileLayer( { 
					id: "aerial_2017",
					url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/aerial2017/MapServer"
				} ),

			}

		overlay_lyrs = {
				lbls: new MapImageLayer( {
					id: "lbls",
					title: "Labels",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/labels/MapServer",
					sublayers: [ 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

				ostreets: new MapImageLayer( {
					id: "ostreets",
					title: "Opaque Layers",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/layers/MapServer",
					sublayers: [ 68, 67, 65, 64, 63, 48, 47, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

				trans: new MapImageLayer( {
					id: "trans",
					title: "Transparent Layers",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/layers/MapServer",
					opacity: 0.5,
					sublayers: [ 69, 66, 64, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 46, 45, 43, 42, 41, 40, 39, 38 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

			}

		cnd_lyr = new GraphicsLayer( { opacity: 0.6 } )
		sel_lyr = new GraphicsLayer( { opacity: 0.6 } )
		id_lyr = new GraphicsLayer( { opacity: 1.0 } )
		misc_lyr = new GraphicsLayer( { opacity: 1.0 } )
		sketch_lyr = new GraphicsLayer( { opacity: 1.0 } )

		//Initialize Map
		map = new Map( {
				layers: [ 
					...basemaps[ local_state.basemap_idx ].map( basemap => tile_lyrs[ basemap ] ), //basemaps
					overlay_lyrs.lbls, overlay_lyrs.ostreets, overlay_lyrs.trans, //overlays
					misc_lyr, cnd_lyr, sel_lyr, id_lyr, sketch_lyr //graphic layers

				]

			} )

		//Initalize Map View
		view = new MapView( {
			container: "viewDiv",
			map: map,
			extent: new Extent( { ...full_extent, spatialReference: { wkid: 2264 } } ),
			padding: _offset

		} )

		view.ui.remove( [ "attribution" ] )
		view.ui.move( "zoom", "bottom-left" )

		view.on( "click", event => {
			const screen_pt = { x: event.x, y: event.y }

			// Search for graphics at the clicked location
			view.hitTest( event ).then( response => {
				const graphicHits = response.results?.filter(
			      		(hitResult) => hitResult.type === "graphic" && hitResult.graphic.layer === cnd_lyr

    				)

				if( graphicHits?.length > 0 ){
      				// do something with the myLayer features returned from hittest
      				graphicHits.forEach( graphicHit => { results_index.set(graphicHit.graphic.attributes.idx ) } )
    			
				}else{
					switch( local_state.map_tool ){
						case "click_srch":
							const hit = { value: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}`, type: "XY", xy: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}` }
							
							local_state.zoom_to = false
							goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )
							break

						case "identify":
							local_state.zoom_to = false
							messenger.set( [ 
									{ type: "clear_all_graphics" }, 
									{ type: "add_identify_graphic", x: event.mapPoint.x, y: event.mapPoint.y } 
								] )
							goto( `/identify/${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}/${local_state.id_lyr}` )
							break

					}

				}

			} )

		} )

		view.when( ( ) => {
			messenger.subscribe( msgs => {
				if( msgs.length > 0 ){
					let params, response, rows, grphs, grph

					msgs.forEach( async msg => { 
						switch( msg.type ){
							case "add_buffer_graphic":
								params = {
									table: "parcels_py",
									columns: `ST_AsText(ST_Buffer( shape, ${msg.buffer}, 'quad_segs=8')) as geom_txt`,
									filter: `pid = '${msg.gisid}'`,

								}

								response = await fetch( `/api/query/gis?${json2URL( params )}` )
								rows = await response.json( )

								misc_lyr.removeAll( )
								
								grphs = rows.map( row => new Graphic( { geometry: getGeom( "polygon", row.geom_txt ), symbol: symbols.buffer } ) )
								misc_lyr.addMany( grphs )

								break

							case "add_centroid_graphic":
								//remove sel layer graphics
								sel_lyr.removeAll( )
								cnd_lyr.removeAll( )

								grphs = msg.centroids.map( ( centroid, i ) => {
									return [ 
											new Graphic( { geometry: getGeom( "polygon", centroid.geom ), symbol: symbols.cnd_parcel,attributes: { idx: i }, } ),
											new Graphic( { geometry: getGeom( "point", { x: centroid.x, y: centroid.y } ), symbol: { ...symbols.cnd_label, text: i },attributes: { idx: i }, } ), 
										]
								} ).flat( ) 
																
								
								cnd_lyr.addMany( grphs )

								if( cnd_lyr.graphics.length > 1 )
									view.goTo( cnd_lyr.graphics )
								
								else if( cnd_lyr.graphics.length > 0 ){
									view.center = getGeom( "point", msg.centroids[ 0 ] )
									view.goTo( { zoom: 8} )

								}
							
								break

							case "add_identify_graphic":
								id_lyr.removeAll( )	
								
								grph = new Graphic( { geometry: getGeom( "point", { x: msg.x, y: msg.y } ), symbol: symbols.identify, } )
								id_lyr.add( grph )

								break

							case "add_parcel_graphic":
								if( msg.clear_grphs ){
									cnd_lyr.removeAll( )
									misc_lyr.removeAll( )
									id_lyr.removeAll( )
									
								}	

								sel_lyr.removeAll( )
								
								grph = new Graphic( { geometry: getGeom( "polygon", msg.geom ), symbol: symbols.sel_parcel } )
								sel_lyr.addMany( [ grph ] )

								if( local_state.zoom_to )
									view.goTo( [ grph ] )
								
								//reset zoom_to flag
								local_state.zoom_to = true
								break

							case "add_road_graphic":
								params = {
									table: "streets_ln",
									columns: "ST_AsText(shape) as geom_txt",
									filter: `lstreetcode = '${msg.stcode}' or rstreetcode = '${msg.stcode}'`,

								}
								response = await fetch( `/api/query/gis?${json2URL( params )}` )
								rows = await response.json( )

								misc_lyr.removeAll( )

								grphs = rows.map( row => new Graphic( { geometry: getGeom( "polyline", row.geom_txt ), symbol: symbols.sel_road } ) )
								misc_lyr.addMany( grphs )
								break
						
							case "add_poi_graphic":
								sel_lyr.removeAll( )
								id_lyr.removeAll( )
								misc_lyr.removeAll( )

								grph = new Graphic( { geometry: getGeom( "point", { x: msg.x, y: msg.y } ), symbol: symbols.poi, } )
								misc_lyr.add( grph )

								view.center = getGeom( "point", getGeom( "point", { x: msg.x, y: msg.y } ) )
								view.goTo( { zoom: 8} )

								break

							case "id_lyr":
								local_state.id_lyr = msg.layer
								break

							case "toggle_layer":
								msg.layers.forEach( lyr => { handle.overlay_toggle( lyr.group_idx, lyr.lyr_idx, lyr.visible ) } ) 
								break

							case "clear_all_graphics":
								if( sel_lyr.graphics.length > 0 )
									sel_lyr.removeAll( )

								if( cnd_lyr.graphics.length > 0 )
									cnd_lyr.removeAll( )

								if( misc_lyr.graphics.length > 0 )
									misc_lyr.removeAll( )

								if( id_lyr.graphics.length > 0 )
									id_lyr.removeAll( )

								break

							case "zoom_to_centroids":
								if( cnd_lyr.graphics.length > 1 ){
									view.goTo( cnd_lyr.graphics )
									
								}else if( cnd_lyr.graphics.length > 0 ){
									view.center = cnd_lyr.graphics[ 0 ]
									view.goTo( { zoom: 8} )

								}

								if( sel_lyr.graphics.length > 0 )
									sel_lyr.removeAll( )
								break

							case "zoom_to_parcel_graphic":
								view.goTo( sel_lyr.graphics )
								break

							case "zoom_to_extent":
								view.goTo( new Extent( { ...msg.extent, spatialReference: { wkid: 2264 } } ) )
								break

							case "zoom_to_full_extent": 
								view.goTo( new Extent( { ...full_extent, spatialReference: { wkid: 2264 } } ) )
								break

						}

					} )

				}
				
			} )

		} )

		ReactiveUtils.watch( ( ) => [ view.stationary, view.scale ], ( [ stationary, zoom ] ) => { 
				if( stationary ){
					tools[ tools.findIndex( tool => tool.id === "select_srch" ) ].disabled = ( zoom > 7200 )

					if( zoom > 7200 && local_state.map_tool === "select_srch" )
						handle.tool_action( "click_srch" )
												
				}
													
			}, { initial: true } )

		mounted = true

	} )

	offset.subscribe( value => { 
		_offset = value

		if( view )
			view.padding = { ...view.padding, ..._offset }

	} )

	mobile.subscribe( value => { _mobile = value } )
	datadrawer.subscribe( value => { _datadrawer = value } )
	
</script>

<style>
    @import "@arcgis/core/assets/esri/themes/light/main.css";

</style>