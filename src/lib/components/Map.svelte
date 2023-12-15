<svelte:window bind:innerWidth={screen_size} />
<div class="h-screen cursor-pointer" id="viewDiv">
	{#if mounted }
		<!-- Right-Top Tools -->
		<div class="absolute z-10 right-0 top-0 m-2 bg-lienzo border-2 border-primero p-0 rounded-md flex flex-col gap-0 divide-y-2 divide-primero">
			{#each tools as tool, i}
				<button 
					class="p-2 {local_state.map_tool === tool.id ? 'bg-segundo text-lienzo' : 'bg-lienzo'} first:rounded-t last:rounded-b group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
					on:click="{event=>{local_state.map_tool=tool.id; handle.tool_action(tool.id, 'open');}}"
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

			{/each}

		</div>

		{#if local_state.open}
			<div
				in:fly="{{ y: -180, duration: 1200 }}" out:fade
				class="absolute right-12 top-0 m-2 border-2 border-primero p-1 min-w-[180px] max-h-[600px] rounded bg-lienzo overflow-auto"
			>
				<div class="flex flex-row items-center gap-2">
					<button 
						class="p-1 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz hover:text-segundo"
						on:click="{(event)=>{open=false; handle.tool_action( local_state.map_tool, 'close' )}}"
					>
						{@html icon( "close", 20, 20 )}

					</button>

					<div class="grow text-sm font-bold">{local_state.tool_title}</div>
					
				</div>

				<div class="p-2">
					{#if local_state.map_tool === "measure"}
						<div class="flex flex-row gap-3">
							{#each tools[ tools.findIndex( item => item.id === "measure" )].children as tool, i}
								<button 
									class="p-1 border {local_state.measure_tool === tool.id ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-suave'} rounded group relative hover:bg-segundo hover:text-lienzo hover:border-segundo"
									on:click="{(event)=>{local_state.measure_tool=tool.id; handle.tool_action(tool.id, 'open')}}"
								>
									{@html icon( tool.icon, 24, 24 )}
									
								</button>
							{/each}
							
						</div>

						<div class="{local_state.measurement?'':'hidden'} text-sm pt-2">
							{@html local_state.measurement}

						</div>
							
					{:else if local_state.map_tool === "markup"}
						<div class="flex flex-row gap-3">
							{#each tools[ tools.findIndex( item => item.id === "markup" )].children as tool, i}
								<button 
									class="p-1 border {local_state.markup_tool === tool.id ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-suave'} rounded group relative hover:bg-segundo hover:text-lienzo hover:border-segundo"
									on:click="{(event)=>{local_state.markup_tool=tool.id; handle.tool_action(tool.id, 'open')}}"
								>
									{@html icon( tool.icon, 24, 24 )}
									
								</button>

							{/each}

						</div>

					{:else if local_state.map_tool === "erase"}
						<div class="gap-3 text-sm">
							<div class="mb-2">
								Click on graphics to remove individually.
							</div>
							
							<button
							class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
								on:click="{(event)=>{handle.tool_action( 'erase_all', 'open' )}}"
							>
								Erase All
							</button>
						</div>

					{:else if local_state.map_tool === "overlays"}
						<div 
							class="text-sm w-[290px] dark:bg-gray-700"
						>
							{#each overlays_data as item, i}
								<AccordionItem entry={item} on:active_tab_change={handle.accordion_tab_change} on:overlay_toggle="{(event)=>{ handle.overlay_toggle( i, event.detail.lyr_idx, event.detail.checked ) }}" />
							{/each}

						</div>

					{:else if local_state.map_tool === "identify"}
						<div 
							class="text-sm dark:bg-gray-700"
						>
							Click map to ID layers.

						</div>

					{:else if local_state.map_tool === "print"}
						<div 
							class="text-sm dark:bg-gray-700"
						>
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
								/>

							</div>

							<div class="flex gap-2 w-full mb-2">
								<div class="flex items-center">
									<input 
										type="checkbox" 
										value=""
										bind:checked={local_state.print_add_legend}
										class="w-4 h-4 rounded checked:bg-primero text-primero bg-primero cursor-pointer"
									/>
								</div>
								<div class="flex items-center">
									<label for="add_legend" class="text-sm font-medium text-todo">Add Legend</label>
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

					{/if}

				</div>
			
			</div>

		{/if}

		<!-- Right-Bottom Tools -->
		<div class="hidden md:flex absolute right-0 bottom-0 m-2">
			<BasemapToggle on:basemap_change={handle.basemap_change} on:aerial_yr_change={handle.aerial_change} />

		</div>

	{/if}
	
</div>

<script>
	//Svelte Libraries
    import {onMount} from "svelte"
	import {goto} from "$app/navigation"
	import {fade, fly} from "svelte/transition"

	//Store
	import {messenger, offset} from "$lib/store"

	//Custom Libraries
	import {getGeom} from "$lib/mapping"
	import {srchstr2qrystr, json2URL, icon} from "$lib/utils"

	import AccordionItem from "$lib/components/AccordionItem.svelte"
	import BasemapToggle from "$lib/components/BasemapToggle.svelte"
	import Selecto from "$lib/components/Selecto.svelte"

	// ArcGIS API Library Variables
	let Extent, GeometryEngine, Graphic, GraphicsLayer, Map, MapImageLayer, MapView, PrintTask, PrintParameters, ReactiveUtils, SketchViewModel, TileLayer

	//Data variables
	let overlays_data

	//CSS Inject Variables	
	let screen_size, _offset
			
	// Other Variables
	let mounted = false,
		view, map, tile_lyrs, overlay_lyrs, cnd_lyr, sel_lyr, custom_lyr,
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
			tool_open: false,
			tool_title: "",
			measure_tool: null,
			markup_tool: null,
			measurement: null,

			//print
			print_layouts: [ 
				{ label: "Landscape 11 x 8.5", value: "letter-ansi-a-landscape" },
				{ label: "Portrait 11 x 8.5", value: "letter-ansi-a-portrait" },

			],
			sel_print_layout: 0,
			print_title: null, 
			print_add_legend: false,
			print_url: null

		},
		
		basemaps = {
			0: [ "topo", "hollow" ],
			1: [ `aerial_${local_state.aerial_yr}`, "hollow" ],
			2: [ `aerial_${local_state.aerial_yr}` ],
			3: [ "streets" ],
		
		},

		full_extent = { xmin: 1384251.24585599, ymin: 460978.995855999, xmax: 1537013.50075424, ymax: 660946.333333335, },

		handle =  {
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

				local_state.aerial_yr = new_aerial_yr

			},

			basemap_change: event => {
				const new_basemap_idx = event.detail.new_basemap_idx

				map.removeMany( basemaps[ local_state.basemap_idx ].map( lyr_id => map.findLayerById( lyr_id ) ) )
				map.addMany( basemaps[ new_basemap_idx ].map( lyr_id => tile_lyrs[ lyr_id ] ), 0 )
				local_state.basemap_idx = new_basemap_idx

			},

			graphic_complete: geom => {
				switch( local_state.map_tool ){
					case "select_srch":
						const rings = geom.toJSON( ).rings,
							hit = { value: `${JSON.stringify( rings )}`, type: "poly", rings: rings }
			
						local_state.zoom_to = true
						sketch_widget.layer.removeAll( )
						local_state.map_tool = "click_srch"
						goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

						break

					case "markup":
						local_state.markup_tool = null

						break

					case "measure":
						if( local_state.measure_tool == "area_measure" ){
							const area = GeometryEngine.planarArea( geom, "acres" )

							local_state.measurement = `Area: ${area.toFixed( 2 )} acres`

							custom_lyr.graphics.add( 
								new Graphic( geom.centroid, {
									type: "text",  // autocasts as new TextSymbol()
									color: "white",
									haloColor: "black",
									haloSize: "1px",
									text: area.toFixed( 2 ) + " acres",
									font: {  // autocasts as new Font()
										size: 12,
										family: "Arial",
										weight: "bold"
									}
								} ) 

							)
							local_state.measure_tool = null

						}else if( local_state.measure_tool == "dist_measure" ){
							const dist = GeometryEngine.planarLength( geom, "feet" )

							local_state.measurement = `Distance: ${dist.toFixed( 2 )} ft`

							custom_lyr.graphics.add( 
								new Graphic( geom.extent.center, {
									type: "text",  // autocasts as new TextSymbol()
									color: "white",
									haloColor: "black",
									haloSize: "1px",
									text: dist.toFixed( 2 ) + " ft",
									font: {  // autocasts as new Font()
										size: 12,
										family: "Arial",
										weight: "bold"
									}
								} ) 

							)

							local_state.measure_tool = null

						}

						break

				}

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

			print: async ( ) => {
				try{
					local_state.print_url = "progress"

					const print_resp = await PrintTask.execute( 
						"https://polaris3g.mecklenburgcountync.gov/server/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task", 
						new PrintParameters( {
							view: view,
							template: {
								format: "pdf",
								exportOptions: {
									dpi: 96 

								},
								scalePreserved: true,
								layout: local_state.print_layouts[ local_state.sel_print_layout ].value,
								layoutOptions: {
									titleText: local_state.print_title,
									authorText: "Mecklenburg County GIS"

								}

							}

						} ) )

					local_state.print_url = print_resp.url

				}catch( err ){
					local_state.print_url = "error"

				}

			},

			tool_action: async ( tool, action=null ) => {
				let children

				switch( tool ){
                	case "select_srch": 
						local_state.open = false
						if( !sketch_widget )
							inits.sketch_widget( )
						
						sketch_widget.layer.removeAll( )
						sketch_widget.create( "polygon" )

						break

					case "measure":
						if( action === "open" ){
							local_state.tool_title = tools[ tools.findIndex( item => item.id === tool )].tooltip
                    		local_state.open = true
						}else
							local_state.measurement = null

					
						break

					case "dist_measure":
						if( action === "open" ){
							children = tools[ tools.findIndex( item => item.id === "measure" )].children
							local_state.tool_title= children[ children.findIndex( item => item.id === local_state.measure_tool ) ].tooltip

							if( !dist_widget )
								inits.dist_widget( )
								
							dist_widget.create( "polyline" )

						}

						break

					case "area_measure":
						if( action === "open" ){
							children = tools[ tools.findIndex( item => item.id === "measure" )].children
							local_state.tool_title= children[ children.findIndex( item => item.id === local_state.measure_tool ) ].tooltip
							
							if( !area_widget )
								inits.area_widget( )

							area_widget.create( "polygon" )

						}
						
						break

					case "pt_markup":  case "line_markup": case "poly_markup": 
						if( action === "open" ){
							const lookup = {
								pt_markup: "point",
								line_markup: "polyline",
								poly_markup: "polygon"

							}

							children = tools[ tools.findIndex( item => item.id === "markup" )].children
							local_state.tool_title = children[ children.findIndex( item => item.id === local_state.markup_tool ) ].tooltip

							if( !sketch_widget )
								inits.sketch_widget( )

							sketch_widget.create( lookup[ tool ] )

						}

						break

					case "erase_all":
						custom_lyr.removeAll( )
						break

					default:
						local_state.tool_title = tools[ tools.findIndex( item => item.id === tool )].tooltip
						local_state.open = true
						break

            	}

				if( action === "close" ){
					local_state.map_tool = "click_srch"
					local_state.open = false
				}
			
			},
			
		},

		inits = {
			sketch_widget: ( ) => {
				sketch_widget = new SketchViewModel( { view: view, layer: custom_lyr } )
				sketch_widget.on( "create", event => { 
					if( event.state === "complete" ) 
						handle.graphic_complete( event.graphic.geometry ) 
				} )
				sketch_widget.on( "update", event => { 
					console.log( event.state )
					//if( event.state === "complete" ) 
					//	handle.graphic_complete( event.graphic.geometry ) 

				} )

			},

			area_widget: ( ) => {
				area_widget = new SketchViewModel( { 
					view: view, 
					layer: custom_lyr, 
					polygonSymbol:  {
						type: "simple-fill",
						color: [  191, 54, 38, 0.5 ],
						style: "solid",
						outline: {
							color: [  191, 54, 38, 1 ],
							width: 2

						}

					} 

				} )

				area_widget.on( "create", event => { if( event.state === "complete" ) handle.graphic_complete( event.graphic.geometry ) } )
				area_widget.on( "update", event => { if( event.state === "complete" ) handle.graphic_complete( event.graphic.geometry ) } )

			},

			dist_widget: ( ) => {
				dist_widget = new SketchViewModel( { 
					view: view, 
					layer: custom_lyr, 
					polylineSymbol: {
						type: "simple-line",
						color: [ 191, 54, 38 ],
						width: 2

					} 

				} )

				dist_widget.on( "create", event => { if( event.state === "complete" ) handle.graphic_complete( event.graphic.geometry ) } )
				dist_widget.on( "update", event => { if( event.state === "complete" ) handle.graphic_complete( event.graphic.geometry ) } )

			}

		},
		
		tools = [ 
            { icon: "overlays", id: "overlays", tooltip: "Overlays", disabled: false },
            { icon: "selectsrch", id: "select_srch", tooltip: "Select Search", disabled: true },
            { icon: "id", id: "identify", tooltip: "Identify Layer", disabled: false },
            { 
				icon: "tape", 
				id: "measure", 
				tooltip: "Measure", 
				children: [ 
					{ icon: "ruler", id: "dist_measure", tooltip: "Distance Measure" },
            		{ icon: "setsquare", id: "area_measure", tooltip: "Area Measure" } 
				],

			},
			{ 
				icon: "draw", id: "markup", tooltip: "Markup", disabled: false, children: [ 
					{ icon: "markuppt", id: "pt_markup", tooltip: "Point Markup" },
            		{ icon: "markupline", id: "line_markup", tooltip: "Line Markup" },
					{ icon: "markuppoly", id: "poly_markup", tooltip: "Poly Markup" }  
				],

			},
			{ icon: "trash", id: "erase", tooltip: "Erase Graphics", disabled: false },
            { icon: "print", id: "print", tooltip: "Print", disabled: false },
        
		]

	onMount( async ( ) => {
		const symbols = {
				sel_parcel: { type: "simple-line", color: [ 0, 255, 102 ], width: 3 },
				cnd_centroid: { type: "simple-marker", color: [ 255, 193, 7 ], size: 5, outline: { width: 1, color: [ 255, 193, 7 ], } },
				identify: { type: "simple-marker", color: [ 255, 255, 255 ], size: 10, outline: { width: 1, color: [ 255, 193, 7 ], } },
				sel_road: { type: "simple-line", color: [ 47, 204, 110 ], width: 4 },
				sel_addr: { type: "simple-marker", color: [ 47, 204, 110 ], size: 5, outline: { width: 1, color: [ 47, 204, 110 ] } },
				buffer: { type: "simple-fill", color: [  255, 0, 0, 0.35 ], style: "solid", outline: { color: [  255, 0, 0, 0.35  ], width: 2 } }

			}

		// Lazy Load ArcGIS API libraries 
		Extent = ( await import( "@arcgis/core/geometry/Extent" ) ).default
		GeometryEngine = await import( "@arcgis/core/geometry/geometryEngine" )
		Graphic = ( await import( "@arcgis/core/Graphic" ) ).default
		GraphicsLayer = ( await import( "@arcgis/core/layers/GraphicsLayer" ) ).default
		Map = ( await import( "@arcgis/core/Map" ) ).default
		MapImageLayer = ( await import( "@arcgis/core/layers/MapImageLayer" ) ).default
		MapView = ( await import( "@arcgis/core/views/MapView" ) ).default
		PrintTask = await import( "@arcgis/core/rest/print" )
		PrintParameters = ( await import( "@arcgis/core/rest/support/PrintParameters" )  ).default
		ReactiveUtils = await import( "@arcgis/core/core/reactiveUtils" )
		SketchViewModel = ( await import( "@arcgis/core/widgets/Sketch/SketchViewModel" ) ).default
		TileLayer = ( await import( "@arcgis/core/layers/TileLayer" ) ).default

		// Lazy Load Data
		overlays_data = ( await import ( "$lib/data/overlays" ) ).default
		
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
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/labels/MapServer",
					sublayers: [ 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

				ostreets: new MapImageLayer( {
					id: "ostreets",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/layers/MapServer",
					sublayers: [ 68, 67, 65, 64, 63, 48, 47, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

				trans: new MapImageLayer( {
					id: "trans",
					url: "https://polaris3g.mecklenburgcountync.gov/server/rest/services/layers/MapServer",
					opacity: 0.5,
					sublayers: [ 69, 66, 64, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 46, 45, 43, 42, 41, 40, 39, 38 ].map( idx => { return { id: idx, visible: false } } )
				
				} ),

			}

		cnd_lyr = new GraphicsLayer( { opacity: 0.6 } )
		sel_lyr = new GraphicsLayer( { opacity: 0.6 } )
		custom_lyr = new GraphicsLayer( { opacity: 1.0 } )

		//Initialize Map
		map = new Map( {
				layers: [ 
					...basemaps[ local_state.basemap_idx ].map( basemap => tile_lyrs[ basemap ] ), //basemaps
					overlay_lyrs.lbls, overlay_lyrs.ostreets, overlay_lyrs.trans, //overlays
					cnd_lyr, sel_lyr, custom_lyr //graphic layers

				]

			} )

		//Initalize Map View
		view = new MapView( {
			container: "viewDiv",
			map: map,
			extent: new Extent( { ...full_extent, spatialReference: { wkid: 2264 } } ),
			padding: { left: _offset }

		} )

		view.ui.remove( [ "attribution" ] )
		view.ui.move( "zoom", "bottom-left" )

		view.on( "click", event => {
			if( local_state.map_tool === "click_srch" ){
				const hit = { value: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}`, type: "XY", xy: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}` }
				
				local_state.zoom_to = false
				goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )
			
			}else if( local_state.map_tool === "identify" ){
				local_state.zoom_to = false
				messenger.set( [ { type: "add_identify_graphic", x: event.mapPoint.x, y: event.mapPoint.y } ] )
				goto( `/identify/${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}/${local_state.id_lyr}` )

			}
			
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
								grphs = rows.map( row => new Graphic( { geometry: getGeom( "polygon", row.geom_txt ), symbol: symbols.buffer } ) )

								custom_lyr.removeAll( )
								custom_lyr.addMany( grphs )

								break

							case "add_centroid_graphic":
								grphs = msg.centroids.map( centroid => new Graphic( { geometry: getGeom( "point", centroid ), symbol: symbols.cnd_centroid } ) )

								//remove sel layer graphics
								sel_lyr.removeAll( )
								cnd_lyr.removeAll( )
								cnd_lyr.addMany( grphs )
								if( cnd_lyr.graphics.length > 1 ){
									view.goTo( cnd_lyr.graphics )
								
								}else if( cnd_lyr.graphics.length > 0 ){
									view.center = getGeom( "point", msg.centroids[ 0 ] )
									view.goTo( { zoom: 8} )

								}
							
								break

							case "add_identify_graphic":
								grph = new Graphic( {
                            		geometry: getGeom( "point", { x: msg.x, y: msg.y } ),
                            		symbol: {
                                		type: "simple-marker",
                                		color: "#7dd3fc",
                                		size: "30px",
                                		outline: {
                                    		color: "#075985",
                                    		width: "2px",
                                		},
                                		path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
                            
                            		},

                        		} )
								
								custom_lyr.removeAll( )
								custom_lyr.add( grph )

								break

							case "add_parcel_graphic":
								grph = new Graphic( { geometry: getGeom( "polygon", msg.geom ), symbol: symbols.sel_parcel } )
								
								if( msg.clear_grphs ){
									cnd_lyr.removeAll( )
									custom_lyr.removeAll( )

								}

								sel_lyr.removeAll( )
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
								grphs = rows.map( row => new Graphic( { geometry: getGeom( "polyline", row.geom_txt ), symbol: symbols.sel_road } ) )

								custom_lyr.removeAll( )
								custom_lyr.addMany( grphs )

								break

							
							case "add_poi_graphic":
								grph = new Graphic( {
                            		geometry: getGeom( "point", { x: msg.x, y: msg.y } ),
                            		symbol: {
                                		type: "simple-marker",
                                		color: "#7dd3fc",
                                		size: "30px",
                                		outline: {
                                    		color: "#075985",
                                    		width: "2px",
                                		},
                                		path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
                            
                            		},
                            		
                        		} )
								
								sel_lyr.removeAll( )
								custom_lyr.removeAll( )
								custom_lyr.add( grph )

								view.center = getGeom( "point", getGeom( "point", { x: msg.x, y: msg.y } ) )
								view.goTo( { zoom: 8} )

								break

							case "id_lyr":
								local_state.id_lyr = msg.layer
								break

							case "toggle_layer":
								msg.layers.forEach( lyr => { handleOverlayToggle( lyr.group_idx, lyr.lyr_idx, lyr.visible ) } ) 
								break

							case "clear_all_graphics":
								if( sel_lyr.graphics.length > 0 )
									sel_lyr.removeAll( )

								if( cnd_lyr.graphics.length > 0 )
									cnd_lyr.removeAll( )

								if( custom_lyr.graphics.length > 0 )
									custom_lyr.removeAll( )

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
				if( stationary )
					tools[ tools.findIndex( item => item.id === "select_srch" )].disabled = ( view.scale > 7200 ? true : false )
				
			}, { initial: true } )

		mounted = true

	} )

	offset.subscribe( value => { 
		_offset = value

		if( view )
			view.padding = { ...view.padding, left:_offset }
					
	} )

</script>

<style>
    @import "@arcgis/core/assets/esri/themes/light/main.css";

</style>