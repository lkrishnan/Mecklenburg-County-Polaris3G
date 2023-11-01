<svelte:window bind:innerWidth={screen_size} />
<div class="h-screen cursor-pointer" id="viewDiv">
	<!-- Map Tools -->
	<!--<div class="hidden md:flex absolute right-20 m-2 gap-4">
		<div class="relative">
			<button 
				class="text-primero bg-lienzo border border-suave hover:bg-luz rounded-xl text-sm p-2 text-center inline-flex items-center shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
				type="button"
				on:click="{(event)=>{handleMapBtnToggle( 'labels' )}}"
				>
				Labels 
				<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
			
			</button>
			{#if map_btn_open.labels}
				<div 
					class="absolute z-10 right-0 top-[40px] bg-lienzo text-sm p-2 divide-y divide-gray-100 rounded shadow-xl w-44 dark:bg-gray-700"
					on:mouseleave="{(event)=>{ ( debounce( e => { map_btn_open.labels=false }, 200 ) )( ) }}"
					on:blur="{(event)=>{ ( debounce( e => { map_btn_open.labels=false }, 200 ) )( ) }}"
					role="button"
					tabindex="-1"
				>
					<ul class="p-2 space-y-3 text-sm text-todo">
						{#each overlays_data[ 0 ].children as child, i}
						<li>
							<div class="flex items-center">
							<input 
								id={child.name} 
								type="checkbox" 
								value=""
								bind:checked={child.checked} 
								class="w-4 h-4 rounded checked:bg-primero text-primero bg-primero"
								on:change="{(event)=>{ handleOverlayToggle( 0, i, event.target.checked ) }}"
							>
							<label for={child.name} class="ml-2 text-sm font-medium text-todo">{child.name}</label>
							</div>
						</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		

		<div class="relative">
			<button 
				class="text-primero bg-lienzo border border-suave hover:bg-luz rounded-xl text-sm p-2 text-center inline-flex items-center shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
				type="button"
				on:click="{(event)=>{handleMapBtnToggle( 'overlays' )}}"
			>
				Overlays
				<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
			
			</button>
			{#if map_btn_open.overlays}
				<div 
					class="absolute z-10 right-0 top-[40px] bg-lienzo text-sm py-1 px-2 rounded shadow-xl w-[290px] dark:bg-gray-700"
					on:mouseleave="{(event)=>{ ( debounce( e => { map_btn_open.overlays=false }, 200 ) )( ) }}"
					on:blur="{(event)=>{ ( debounce( e => { map_btn_open.overlays=false }, 200 ) )( ) }}"
					role="button"
					tabindex="-1"
				>
					{#each overlays_data.slice( 1 ) as item, i}
						<AccordionItem entry={item} on:active_tab_change={handleActiveTabChng} on:overlay_toggle="{(event)=>{ handleOverlayToggle( i+1, event.detail.lyr_idx, event.detail.checked ) }}" />
					{/each}
				</div>
			{/if}
		</div>
	</div>-->

	<!-- Right handside Tools -->
	<div class="absolute right-0 bottom-0 m-2">
		<BasemapToggle on:basemap_change={handleBasemapChng} on:aerial_yr_change={handleAerialYrChng} />

	</div>

	<div class="absolute z-10 right-0 top-0 m-2 bg-lienzo border-2 border-primero p-0 rounded-md flex flex-col gap-0 divide-y-2 divide-primero">
		{#each tools as tool, i}
			<button 
				class="p-2 {map_tool === tool.id ? 'bg-segundo text-lienzo' : 'bg-lienzo'} first:rounded-t last:rounded-b group relative hover:bg-segundo hover:border-segundo hover:text-lienzo disabled:bg-todo"
				on:click="{(event)=>{map_tool=tool.id; handleToolbar(tool.id, 'open');}}"
				disabled="{tool.disabled}"
			>
				{@html icon( tool.icon, 24, 24 )}
				{#if !open}
					<span
						class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
					>
						{tool.tooltip}
					</span>
				{/if}
			</button>

		{/each}
	</div>
	
	{#if open}
	<div
		in:fly="{{ y: -180, duration: 1200 }}" out:fade
		class="absolute right-12 top-0 m-2 border-2 border-primero p-1 min-w-[180px] max-h-[600px] rounded bg-lienzo overflow-auto"
	>
		<div class="flex flex-row items-center gap-2">
			<button 
				class="p-1 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz hover:text-segundo"
				on:click="{(event)=>{open=false; handleToolbar(map_tool, 'close')}}"
			>
				{@html icon( "close", 20, 20 )}
			</button>
			<div class="grow text-sm font-bold">{tool_title}</div>
			
		</div>
		<div class="p-2">
			{#if map_tool === "measure"}
				<div class="flex flex-row gap-3">
					{#each tools[ tools.findIndex( item => item.id === "measure" )].children as tool, i}
						<button 
							class="p-1 border {measure_tool === tool.id ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-suave'} rounded group relative hover:bg-segundo hover:text-lienzo hover:border-segundo"
							on:click="{(event)=>{measure_tool=tool.id; handleToolbar(tool.id, 'open')}}"
						>
							{@html icon( tool.icon, 24, 24 )}
							
						</button>
					{/each}
					
				</div>
				<div class="{measurement?'':'hidden'} text-sm pt-2">
					{@html measurement}
				</div>
								

			{:else if map_tool === "markup"}
				<div class="flex flex-row gap-3">
					{#each tools[ tools.findIndex( item => item.id === "markup" )].children as tool, i}
						<button 
							class="p-1 border {markup_tool === tool.id ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-suave'} rounded group relative hover:bg-segundo hover:text-lienzo hover:border-segundo"
							on:click="{(event)=>{markup_tool=tool.id; handleToolbar(tool.id, 'open')}}"
						>
							{@html icon( tool.icon, 24, 24 )}
							
						</button>
					{/each}
				</div>

			{:else if map_tool === "erase"}
				<div class="flex flex-col gap-3 text-sm">
					Click on graphics to remove individually.

					<button
						class="bg-primero px-2 py-1 border border-primero text-lienzo hover:bg-segundo"
						on:click="{(event)=>{handleToolbar('erase_all', 'open')}}"
					>
						Erase All
					</button>
				</div>

			{:else if map_tool === "overlays"}
				<div 
					class="text-sm w-[290px] dark:bg-gray-700"
				>
					{#each overlays_data as item, i}
						<AccordionItem entry={item} on:active_tab_change={handleActiveTabChng} on:overlay_toggle="{(event)=>{ handleOverlayToggle( i, event.detail.lyr_idx, event.detail.checked ) }}" />
					{/each}

				</div>

			{:else if map_tool === "identify"}
				<div 
					class="text-sm dark:bg-gray-700"
				>
					Click map to ID layers.

				</div>
			{/if}

		</div>
		
	</div>
	{/if}
	
</div>

<script>
	// Libraries
    import { onMount} from "svelte"
	import { last_hit, messenger, rsltados, offset, poi } from "$lib/store"
	import { goto } from "$app/navigation"
	import { srchstr2qrystr, removeArrayDups, json2URL, arrHasSameElems } from "$lib/utils"
	import BasemapToggle from "$lib/components/BasemapToggle.svelte"
	import overlays_data from "$lib/data/overlays"
	import AccordionItem from "$lib/components/AccordionItem.svelte"
	import { fade, fly } from "svelte/transition"
	import { icon } from "$lib/utils"

	// Variables
	let geom, view, map, tile_lyrs, overlay_lyrs, cnd_lyr, sel_lyr, custom_lyr,
		last_basemap_idx = 3,
		last_aerial_yr = "2023",
		zoom_to = true,
		map_btn_open = { 
			labels: false,
			overlays: false,
			select: false,
			markup: false,
			print: false,

		},
		sketch_widget, area_widget, dist_widget,
		map_tool = "click_srch",
		measure_tool = null,
		markup_tool = null,
		measurement = null,
		tool_title = "",
		screen_size,
		_offset,
		SketchViewModel, geometryEngine, Graphic,
		open = false,
		last_id_lyr,
		_rsltados,
		_poi,
		last_cnd_gids = [ ]
		
	// Constants
	const basemaps = {
			0: [ "topo", "hollow" ],
			1: [ "aerial_"+last_aerial_yr, "hollow" ],
			2: [ "aerial_"+last_aerial_yr ],
			3: [ "streets" ],
		
		},
		tools = [ 
            { icon: "overlays", id: "overlays", tooltip: "Overlays", disabled: false },
            { icon: "selectsrch", id: "select_srch", tooltip: "Select Search", disabled: true },
            { icon: "id", id: "identify", tooltip: "Identify Layer", disabled: false },
            { 
				icon: "tape", id: "measure", tooltip: "Measure", children: [ 
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
        
		],
        measure_btns = [
            { icon: "ruler", id: "dist_measure", tooltip: "Distance Measure" },
            { icon: "setsquare", id: "area_measure", tooltip: "Area Measure" },
        
		],
		
		handleBasemapChng = event => {
			const new_basemap_idx = event.detail.new_basemap_idx

			map.removeMany( basemaps[ last_basemap_idx ].map( lyr_id => map.findLayerById( lyr_id ) ) )
			map.addMany( basemaps[ new_basemap_idx ].map( lyr_id => tile_lyrs[ lyr_id ] ), 0 )
			last_basemap_idx = new_basemap_idx

		},
		
		handleAerialYrChng = event => {
			const new_aerial_yr = event.detail.new_aerial_yr

			map.remove( map.findLayerById( "aerial_" + last_aerial_yr ) )
			map.add( tile_lyrs[ "aerial_" + new_aerial_yr ], 0 )

			Object.keys( basemaps ).forEach( key => {
				if( basemaps[ key ].includes( "aerial_" + last_aerial_yr ) )
					basemaps[ key ][ 0 ] = "aerial_" + new_aerial_yr
				
			} )
			last_aerial_yr = new_aerial_yr

		},

		handleOverlayToggle = ( group_idx, lyr_idx, visible ) => {
			let layer,
				sub_lyrs = ( lyr_idx === -1 ? overlays_data[ group_idx ].sublyrs : overlays_data[ group_idx ][ "children" ][ lyr_idx ].sublyrs )

			Object.keys( sub_lyrs ).forEach( key => {
				layer = map.findLayerById( key )

				sub_lyrs[ key ].forEach( id => {
					const sublyr = layer.findSublayerById( id )
					sublyr.visible = visible

				} )
				
			} )

			//if( overlays_data[ group_idx ].children[ lyr_idx ].checked !== visible )
			//	overlays_data[ group_idx ].children[ lyr_idx ].checked = visible

		},

		handleActiveTabChng = ( event ) => {
			overlays_data.forEach( ( item, i ) => {
				overlays_data[ i ].open = ( item.id === event.detail.tab ? true : false )

			} )

		},

		handleMapBtnToggle = ( clicked ) => {
			Object.keys( map_btn_open ).forEach( btn => {
				map_btn_open[ btn ] = ( btn === clicked ? !map_btn_open[ btn ] : false )
				
			} )

		},

		handleGraphicComplete = geom => {
			switch( map_tool ){
				case "select_srch":
					const rings = geom.toJSON( ).rings,
						hit = { value: `${JSON.stringify( rings )}`, type: "poly", rings: rings }
		
					last_hit.set( hit )
					zoom_to = true
					sketch_widget.layer.removeAll( )
					map_tool = "click_srch"
					goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

					break

				case "markup":
					markup_tool = null

					break

				case "measure":
					if( measure_tool == "area_measure" ){
						const area = geometryEngine.planarArea( geom, "acres" )

						measurement = `Area: ${area.toFixed( 2 )} acres`

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
						measure_tool = null

					}else if( measure_tool == "dist_measure" ){
						const dist = geometryEngine.planarLength( geom, "feet" )

						measurement = `Distance: ${dist.toFixed( 2 )} ft`

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

						measure_tool = null

					}

					break

			}

		},

		handleToolbar = async ( tool, action ) => {
			let children

			switch( tool ){
                case "select_srch": 
                    open = false
                    if( !sketch_widget )
						initSketchWidget( )

					sketch_widget.layer.removeAll( )
                	sketch_widget.create( "polygon" )

                    break

				case "measure":
					if( action === "open" ){
						tool_title = tools[ tools.findIndex( item => item.id === tool )].tooltip
                    	open= true
					}else
						measurement = null

					
					break

				case "dist_measure":
					if( action === "open" ){
						children = tools[ tools.findIndex( item => item.id === "measure" )].children
						tool_title= children[ children.findIndex( item => item.id === measure_tool ) ].tooltip

						if( !dist_widget )
							initDistWidget( )
							
						dist_widget.create( "polyline" )

					}

					break

				case "area_measure":
					if( action === "open" ){
						children = tools[ tools.findIndex( item => item.id === "measure" )].children
						tool_title= children[ children.findIndex( item => item.id === measure_tool ) ].tooltip
						
						if( !area_widget )
							initAreaWidget( )

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
						tool_title = children[ children.findIndex( item => item.id === markup_tool ) ].tooltip

						if( !sketch_widget )
							initSketchWidget( )

						sketch_widget.create( lookup[ tool ] )
					}

					break

				case "erase_all":
					custom_lyr.removeAll( )
					break
                
                default:
					tool_title = tools[ tools.findIndex( item => item.id === tool )].tooltip
                    open= true
                    break

            }

			if( action === "close" ){
				map_tool = "click_srch"
				open = false
			}
			
		},

		initSketchWidget = ( ) => {
			sketch_widget = new SketchViewModel( { view: view, layer: custom_lyr } )
			sketch_widget.on( "create", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )
			sketch_widget.on( "update", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )

		},

		initAreaWidget = ( ) => {
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

			area_widget.on( "create", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )
			area_widget.on( "update", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )

		},

		initDistWidget = ( ) => {
			dist_widget = new SketchViewModel( { 
				view: view, 
				layer: custom_lyr, 
				polylineSymbol: {
					type: "simple-line",
					color: [ 191, 54, 38 ],
					width: 2

				} 

			} )

			dist_widget.on( "create", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )
			dist_widget.on( "update", event => { if( event.state === "complete" ) handleGraphicComplete( event.graphic.geometry ) } )

		}

	// Events
	onMount( async ( ) => {
		const Extent = ( await import( "@arcgis/core/geometry/Extent" ) ).default,	
			GraphicsLayer = ( await import( "@arcgis/core/layers/GraphicsLayer" ) ).default,
			Map = ( await import( "@arcgis/core/Map" ) ).default,
			MapImageLayer = ( await import( "@arcgis/core/layers/MapImageLayer" ) ).default,	
			MapView = ( await import( "@arcgis/core/views/MapView" ) ).default,
			TileLayer = ( await import( "@arcgis/core/layers/TileLayer" ) ).default,
			VectorTileLayer = ( await import( "@arcgis/core/layers/VectorTileLayer" ) ).default,
			{ getGeom } = await import("$lib/mapping"),
			reactiveUtils = await import( "@arcgis/core/core/reactiveUtils" ),
	
			symbols = {
				sel_parcel: {
					type: "simple-line",
					color: [ 0, 255, 102 ],
					width: 3

				},

				cnd_centroid: {
					type: "simple-marker",
					color: [ 255, 193, 7 ],
					size: 5,
					outline: {
						width: 1,
						color: [ 255, 193, 7 ],
					
					}

				},

				identify: {
					type: "simple-marker",
					color: [ 255, 255, 255 ],
					size: 10,
					outline: {
						width: 1,
						color: [ 255, 193, 7 ],
					
					}

				},

				sel_road: {
					type: "simple-line",
					color: [ 47, 204, 110 ],
					width: 4

				},

				sel_addr: {
					type: "simple-marker",
					color: [ 47, 204, 110 ],
					size: 5,
					outline: {
						width: 1,
						color: [ 47, 204, 110 ]
					
					}
					
				},

				buffer: {
					type: "simple-fill",
					color: [  255, 0, 0, 0.35 ],
					style: "solid",
					outline: {
						color: [  255, 0, 0, 0.35  ],
						width: 2

					}

				}


			},
			
			zoom = {
				toExtent: ( extent ) => {
					view.goTo( new Extent( { ...extent, spatialReference: { wkid: 2264 } } ) )
				
				}

			}

		SketchViewModel = ( await import( "@arcgis/core/widgets/Sketch/SketchViewModel" ) ).default
		geometryEngine = await import( "@arcgis/core/geometry/geometryEngine" )
		Graphic = ( await import( "@arcgis/core/Graphic" ) ).default

		// layers
		tile_lyrs = {
			streets: new TileLayer( { 
				id: "streets",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/basemap/MapServer"
			} ),
			/*streets: new TileLayer({
				id: "streets",
				url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/basemap/VectorBasemap/MapServer"
			} ),*/

			hollow: new TileLayer( { 
				id: "hollow",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/basemap_aerial/MapServer"
			} ),

			topo: new TileLayer( { 
				id: "topo",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/topohillshade/MapServer"
			} ),

			aerial_2023: new TileLayer( { 
				id: "aerial_2023",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/aerial2023/MapServer"
			} ),

			aerial_2022: new TileLayer( { 
				id: "aerial_2022",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/aerial2022/MapServer"
			} ),

			aerial_2021: new TileLayer( { 
				id: "aerial_2021",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/aerial2021/MapServer"
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
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/labels/MapServer",
				sublayers: [ 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
			
			} ),

			ostreets: new MapImageLayer( {
				id: "ostreets",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/layers/MapServer",
				sublayers: [ 68, 67, 65, 64, 63, 48, 47, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0 ].map( idx => { return { id: idx, visible: false } } )
			
			} ),

			trans: new MapImageLayer( {
				id: "trans",
				url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/layers/MapServer",
				opacity: 0.5,
				sublayers: [ 64, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 46, 45, 43, 42, 41, 40, 39, 38 ].map( idx => { return { id: idx, visible: false } } )
			
			} ),

		}
		cnd_lyr = new GraphicsLayer( { opacity: 0.6 } )
		sel_lyr = new GraphicsLayer( { opacity: 0.6 } )
		custom_lyr = new GraphicsLayer( { opacity: 1.0 } )

		//map
		map = new Map( {
			layers: [ 
				...basemaps[ last_basemap_idx ].map( basemap => tile_lyrs[ basemap ] ), //basemaps
				overlay_lyrs.lbls, overlay_lyrs.ostreets, overlay_lyrs.trans, //overlays
				cnd_lyr, sel_lyr, custom_lyr //graphic layers

			]

		} )

		//map view
		view = new MapView( {
			container: "viewDiv",
			map: map,
			extent: new Extent( {
				xmin: 1384251.24585599,
				ymin: 460978.995855999,
				xmax: 1537013.50075424,
				ymax: 660946.333333335,
				spatialReference: { wkid: 2264 }
			} ),
			padding: {
				//left: ( _offset > 0 ? 445 : 15 )
				left: _offset

			}

		} )
		
		//move map controls
		view.ui.remove( [ "attribution" ] )
		view.ui.move( "zoom", "bottom-left" )

		//view events
		view.on( "click", event => {
			if( map_tool === "click_srch" ){
				const hit = { value: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}`, type: "XY", xy: `${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}` }
			
				last_hit.set( hit )
				zoom_to = false
				goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )
			
			}else if( map_tool === "identify" ){
				zoom_to = false
				messenger.set( [ { type: "add_identify_graphic", x: event.mapPoint.x, y: event.mapPoint.y } ] )
				goto( `/identify/${event.mapPoint.x.toFixed( 4 )},${event.mapPoint.y.toFixed( 4 )}/${last_id_lyr}` )

			}
			
		} )
	
		view.when( ( ) => {
			rsltados.subscribe( async value => { 
				_rsltados = value

				if( _rsltados.length > 1 ){
					const gids = removeArrayDups( _rsltados.map( row => row.gisid ) )

					//remove sel layer graphics
					sel_lyr.removeAll( )

					//prevent duplicate requests to server
					if( !arrHasSameElems( gids, last_cnd_gids ) ){
						const params = {
								table: "parcels_py",
								columns: "round(ST_x(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_x, round(ST_y(ST_PointOnSurface(shape))::NUMERIC,4) as centroid_y",
								filter: `pid in ( '${gids.join( "','" )}' )`
							},
							response = await fetch( `/api/query/gis?${json2URL( params )}` ),
							rows = await response.json( ),
							grphs = rows.map( row => new Graphic( { geometry: getGeom( "point", { x: row.centroid_x, y: row.centroid_y } ), symbol: symbols.cnd_centroid } ) )

						cnd_lyr.removeAll( )
						cnd_lyr.addMany( grphs )

						//store gids of points on map
						last_cnd_gids = gids

					}

					view.goTo( cnd_lyr.graphics )

				}else if( _rsltados.length > 0 ){ 
					const rsltado = _rsltados[ 0 ]

					geom = rsltado.geom ?? null

					if( geom ){
						const grph = new Graphic( { geometry: getGeom( "polygon", geom ), symbol: symbols.sel_parcel } )

						sel_lyr.removeAll( )
						sel_lyr.addMany( [ grph ] )
	
						if( zoom_to )
							view.goTo( [ grph ] )
						else
							zoom_to = true

					}

					if( rsltado.type !== "PICK"){
						cnd_lyr.removeAll( )
						last_cnd_gids = [ ]

					}
						

				}

			} )

			poi.subscribe( _poi => {
				if( Object.keys( _poi ).length > 0 ){
					const grph = new Graphic( {
						geometry: getGeom( "point", { x: _poi.x, y: _poi.y } ),
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

					view.goTo( { 
						center: [ grph ], 
						zoom: 9  

					} )

				}
				
			} )

			messenger.subscribe( msgs => {
				if( msgs.length > 0 ){
					let params, response, rows, grphs

					msgs.forEach( async msg => { 
						switch( msg.type ){
							case "zoom_to_extent":
								zoom.toExtent( msg.extent )
								
								break

							case "toggle_layer":
								//overlays_open = false
								msg.layers.forEach( lyr => { handleOverlayToggle( lyr.group_idx, lyr.lyr_idx, lyr.visible ) } ) 
								break

							case "id_lyr":
								last_id_lyr = msg.layer
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

							case "add_buffer_graphic":
								params = {
									table: "parcels_py",
									columns: `ST_AsText(ST_Buffer(shape, ${msg.buffer})) as geom_txt`,
									filter: `pid = '${msg.gisid}'`,

								}
								response = await fetch( `/api/query/gis?${json2URL( params )}` )
								rows = await response.json( )
								grphs = rows.map( row => new Graphic( { geometry: getGeom( "polygon", row.geom_txt ), symbol: symbols.buffer } ) )

								custom_lyr.removeAll( )
								custom_lyr.addMany( grphs )

								break

							case "add_identify_graphic":
								const grph = new Graphic( {
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
                            		//attributes: {  ..._this.last_search_result },
                            		//popupTemplate: GetLocTemplate( _this.last_search_result.tag ),

                        		} )
								
								custom_lyr.removeAll( )
								custom_lyr.add( grph )
								break

						}

					} )

				}
				
			} )

		} )

		reactiveUtils.watch(
			( ) => [ view.stationary, view.scale ], 
			( [ stationary, zoom ] ) => { 
				if( stationary )
					tools[ tools.findIndex( item => item.id === "select_srch" )].disabled = ( view.scale > 7200 ? true : false )
				
			},
			{ initial: true}

		)

	} )
		
	offset.subscribe( value => { 
		_offset = value

		if( view )
			view.padding = { ...view.padding, left:_offset }
		//	view.padding = { ...view.padding, left: ( value > 15 ? value : 15 ) }
			
	} )


</script>

<style>
    @import "@arcgis/core/assets/esri/themes/light/main.css";


</style>
