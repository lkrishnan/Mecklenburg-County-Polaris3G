<svelte:window bind:innerWidth={viewport_width} bind:innerHeight={viewport_height} />

<svelte:head>
	<title>{_title===undefined ? "Polaris" : _title}</title>
	<meta charset="UTF-8">
  	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta name="description" content="Polaris - Mecklenburg County Property Ownership and Land Records System.">
	<meta name="author" content="Lak Krishnan">

	<!-- Open Graph -->
	<meta property="og:url" content="{href}">
  	<meta property="og:type" content="website">
	<meta property="og:title" content="{_title===undefined ? "Polaris" : _title}" />
	<meta property="og:description" content="Polaris - Mecklenburg County Property Ownership and Land Records System.">
	<meta property="og:image" content="https://meckgisdev.mecklenburgcountync.gov/android-icon-512.png">
	<meta property="og:image:width" content="512">
  	<meta property="og:image:height" content="512">

	 <!-- icon and theme stuff -->
	 <link rel="icon" href="/favicon.png" type="image/png"><!-- 32×32 -->
	 <link rel="icon" href="/logo.svg" type="image/svg+xml">
	 <link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180×180 -->
	 <meta name="theme-color" content="#211746"/>

</svelte:head>

<Map />

{#if _mobile !== undefined}
	{#if leftdrawer}
		<div
			transition:slide="{{duration: 500, axis: ( _mobile ? 'y' : 'x' )}}" 
			class="absolute z-40 left-0 w-full md:w-72 bottom-0 md:top-0 flex flex-col bg-luz shadow-lg transition-all duration-1000 transform"
		>
				<div class="flex flex-row items-center p-2 bg-primero text-lienzo">
					<div class="grow font-bold text-2xl">
						Polaris
					</div>
					<div class="flex">
						<button 
							class="p-1 rounded-full group relative transition-colors duration-150 hover:text-primero hover:bg-lienzo"
							on:click="{(event)=>{leftdrawer=false}}"
						>
							{@html icon( "close", 24, 24 )}
						</button>
						
					</div>
					
				</div>

				{#if _mobile}
					<div class="flex justify-center gap-2 py-2">
						{#each Object.keys( btns ) as btn, i}
							{#if btns[ btn ].show }
								<button 
									class="p-1 rounded group relative hover:bg-segundo hover:border-segundo hover:text-lienzo hover:fill-lienzo"
									on:click="{(event)=>{handle.click(btns[ btn ].tool, i)}}"
								>
									{@html icon( btns[ btn ].icon, 28, 28 )}
										<span class="bg-segundo text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute md:top-[4px] md:left-12 top-10 -left-[45px] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
											{btns[ btn ].tooltip}
											
										</span>
													
								</button>

							{/if}

						{/each}

					</div>

				{/if}

				<div>
					{#each Object.keys( left_btns ) as btn, i}
						{#if left_btns[ btn ].show }
							{#if left_btns[ btn ].link}
								<a 
									class="flex flex-col p-2  hover:bg-suave hover:text-lienzo hover:fill-lienzo"
									href='{left_btns[ btn ].link}' 
									target='_blank' 
									rel='noreferrer'
								>
									<div class="flex flex-row gap-2 items-center text-sm">
										{@html icon( left_btns[ btn ].icon, 24, 24 )}
										{@html left_btns[ btn ].label}
									</div>
									
								</a>
							{:else}
								<button 
									class="w-full p-1 rounded hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
								>
									<div class="flex flex-row gap-2 items-center text-sm">
										{@html icon( left_btns[ btn ].icon, 24, 24 )}
										{@html left_btns[ btn ].label}
									</div>
													
								</button>
							
							{/if}

						{/if}

					{/each}
					
				</div>
			

		</div>

		<div class="absolute left-0 top-0 z-30 h-full w-full bg-suave opacity-80">
			
		</div>
		
	{/if}

	<div class="hidden md:flex absolute left-0 top-0 z-20 h-full flex-col p-2 gap-0.5 bg-luz shadow-lg">
		{#each Object.keys( btns ) as btn, i}
			{#if btns[ btn ].show }
				<button 
					class="p-1 rounded group relative hover:bg-segundo hover:border-segundo hover:text-lienzo hover:fill-lienzo"
					on:click="{(event)=>{handle.click(btns[ btn ].tool, i)}}"
				>
					{@html icon( btns[ btn ].icon, 26, 26 )}
						<span class="bg-segundo text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute md:top-[4px] md:left-12 -top-10 -left-[45px] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
							{btns[ btn ].tooltip}
							
						</span>
									
				</button>

			{/if}

		{/each}
	</div>

	{#if btns.analysis.open}
		<svelte:component 
			this={Analysis} 
			heading={btns.analysis.tooltip} 
			fields={btns.analysis.fields}
			list={btns.analysis.list}
			gisid={btns.analysis.gisid}
			neigh_code={btns.analysis.neigh_code}
			on:close={event=>{btns.analysis.open = event.detail.open; btns.analysis.fields = event.detail.fields;}} 

		/>

	{/if}

	<div 
		class="absolute z-10 left-0 md:left-[50px] top-0 w-full md:w-[408px] overflow-auto scrollbar
				{ ( $page.route.id.match( /(prop)|identify/ig ) && _datadrawer && ( _mobile ? !_dual : true ) ) || search_active ? 'h-full' : ''}
				{ ( $page.route.id.match( /(prop)|identify/ig ) && _datadrawer && ( _mobile ? !_dual : true ) ) ? 'bg-luz' : ''}
				{ search_active && _mobile ? 'bg-lienzo' : '' }"
	>

		<div
			bind:this={the_top} 
			class="{( $page.route.id.match( /(prop)|identify/ig ) && _datadrawer ) ? `` : `border-r-2` }"
				
		>
			<Banner />

		</div>
			
		<div class="sticky { _mobile ? ( _dual ? '' : 'bg-luz' ) : 'bg-luz' } top-0 z-50 p-2 {( $page.route.id.match( /(prop)|identify/ig ) && _datadrawer ) ? `` : (_mobile ? `` : `border-b-2 border-r-2 rounded-br-lg` ) }">
			{#if _search === "main"}
				<MainSearch 
					leftdrawer={leftdrawer} 
					hide_items={_mobile && true}
					value={search_value}
					is_open={search_active}
					on:error={handle.search_error}
					on:items={handle.search_items}
					on:leftdrawer={handle.left_drawer} 
					on:open={handle.open} 
					on:reset={handle.search_error}

				/>

			{:else if _search === "owner"}	
				<svelte:component 
					this={Owner} 
					leftdrawer={leftdrawer} 
					hide_items={_mobile && true}
					value={search_value}
					is_open={search_active}
					on:close={event=>{search.set("main")}} 
					on:error={handle.search_error}
					on:items={handle.search_items}
					on:leftdrawer={handle.left_drawer} 
					on:open={handle.open} 
					on:reset={handle.search_error}
					/>


			{:else if _search === "situs"}
				<svelte:component 
					this={Situs} 
					leftdrawer={leftdrawer} 
					hide_items={_mobile && true}
					value={search_value}
					is_open={search_active}
					on:close={event=>{search.set("main")}} 
					on:error={handle.search_error}
					on:items={handle.search_items}
					on:leftdrawer={handle.left_drawer}
					on:open={handle.open}
					on:reset={handle.search_error}

				/>

			{:else if _search === "prelimplan"}
				<svelte:component 
					this={Prelimplan} 
					leftdrawer={leftdrawer} 
					list={btns.prelimplan.list}
					selected={btns.prelimplan.selected}
					hide_items={_mobile && true}
					open={search_active}
					pad="pl-9"
					on:close={event=>{search.set("main")}} 
					on:leftdrawer={handle.left_drawer}
					on:open={handle.open}
					
				/>

			{:else if _search === "enggrid"}
				<svelte:component 
					this={Enggrid}
					leftdrawer={leftdrawer} 
					list={btns.enggrid.list}
					selected={btns.enggrid.selected}
					hide_items={_mobile && true}
					open={search_active}
					pad="pl-9"
					on:close={event=>{search.set("main")}} 
					on:leftdrawer={handle.left_drawer}
					on:open={handle.open}
					
				/>

			{/if}

			{#if search_error.length > 0}
				<div class="flex flex-row gap-1 items-center text-pop text-xs italic bg-luz pt-2 px-2 pb-2 md:pb-0">
					{@html icon( "alert", 24, 24 )} {search_error}
				</div>
			{/if}

		</div>

		<div class="{search_active & _mobile ? 'h-full bg-lienzo': 'hidden' }">
			<ul>
				{#if !search_nomatch}
					{#each search_results as result, i}
						<li>
							<div 
								on:click="{()=>handle.search_pick( i )}" 
								on:keydown="{()=>handle.search_pick( i )}"
								role="button" 
								tabindex=-1
								class="text-todo border-t border-suave py-4 px-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer"
							>
								{#if [ "owner", "situs", "main" ].includes( _search )}
									<span class="font-bold pr-1 text-segundo">{result.type}:</span>

								{/if}
								{@html result.label}


							</div>
							
						</li>
							
					{/each}

				{:else}
					<li class="text-pop font-semibold text-sm py-2 px-2">No matches found</li>

				{/if}

			</ul>
						
		</div>
		
		<main 
			class="{(( search_active || ( !_datadrawer && $page.status < 404 ) ) && _mobile ) ? 'hidden' : ''} 
					{( _mobile && _dual ? ( $page.status < 404 ? 'fixed h-2/4 bottom-0 w-full' : 'fixed bottom-0 w-full' ) : '' )}"
			on:touchmove={handle.touch_move}
			on:touchend={handle.touch_end}
			on:touchstart={handle.touch_start}
		>
			<slot />

		</main>
		<Analytics />

	</div>

{/if}

<script>
    import "../app.css"
	import "@fontsource/roboto"
    
	import {onMount} from "svelte"
	import {slide} from "svelte/transition"
	import {goto} from "$app/navigation"
	import {page} from "$app/stores"
	import {offset, messenger, search, datadrawer, mobile, dual, title} from "$lib/store"
	import {getPrelimPlan} from "$lib/api"
	import {formatSearchResults} from "$lib/format"
	import {getPrelimPlans, getEnggrids, getAnlyzFieldsInit, getAnlyzDropDowns} from "$lib/formhelp"
	import {getToggleLayerList} from "$lib/mapping"
	import {srchstr2qrystr, icon} from "$lib/utils"
	
	import Analytics from "$lib/components/Analytics.svelte"
	import MainSearch from "$lib/components/search/MainSearch.svelte"
	import Map from "$lib/components/Map.svelte"
	import Banner from "$lib/components/Banner.svelte"

	//Store Variables
	let _search,
		_datadrawer,
		_mobile,
		_dual,
		_title

	//Components
	let Owner, Situs, Prelimplan, Enggrid, Analysis

	//Other Variables
	let leftdrawer = false,
		btns =  {
			hamburger: { icon: "hamburger", tool: "hamburger", tooltip: "Hidden Menu", show: true },
			main: { icon: "search", tool: "main", tooltip: "Main Search", show: true },
			owner: { icon: "person", tool: "owner", tooltip: "Owner Search", show: true },
			situs: { icon: "locationcity", tool: "situs", tooltip: "Situs Address Search", show: true },
			analysis: { 
				icon: "labresearch", tool: "analysis", tooltip: "Market Analysis", show: true,
				open: false, 
				list: null, 
				gisid: null, 
				neigh_code: null,
				initstate: null,
				fields: null, 
				
			},
			prelimplan: { icon: "architecture", tool: "prelimplan", tooltip: "Preliminary Plan Search", list: null, selected: 0, show: true },
			enggrid: { icon: "grid", tool: "enggrid", tooltip: "Engineering Grid Search", list: null, selected: 0, show: true },
			sidepanel: { icon: "expandless", tool: "sidepanel", tooltip: "Expand side panel", show: false },

		},
		left_btns = {
			tutorials: { icon: "link", label: "Tutorials", link: "https://www.youtube.com/playlist?list=PLB4an5GfqfkM7vvP2Obv4bUzKNmWFr5Q5", show: true },
			tips: { icon: "link", label: "Quick Tips", link: "/pdf/POLARIS3GQUICKTIPS.pdf", show: true },
			report_propinfo_map: { icon: "agent", label: "Report bad Prop Info/Map", link: "https://mecklenburgcountync-563955.workflowcloud.com/forms/d024bf6c-b9b0-4cf5-a7d9-7ac376f0370c", show: true },
			report_mail_addr: { icon: "agent", label: "Report bad Mail Address", link: "https://mecklenburgcountync-563955.workflowcloud.com/forms/0314aa67-0083-4905-9b29-a571be01717e", show: true },
			report_address_road: { icon: "agent", label: "Report Address or Road issues", link: "https://meckgov.maps.arcgis.com/apps/webappviewer/index.html?id=0068439ff27f430abe04082770d2bfea", show: true },
			report_other_issues: { icon: "agent", label: "Report Other issues", link: "https://mecklenburgcountync-563955.workflowcloud.com/forms/7e935f44-bba6-4a6c-9887-de89bae68c8c", show: true },
			moreapps: { icon: "link", tool: "moreapps", label: "More Apps", link: "https://maps.mecklenburgcountync.gov/polarisapps/", show: true },
						
		},
		route,
		href,
		search_active = false,
		search_error = "",
		search_nomatch = false,
		search_results = [ ],
		search_value = "",
		touch_moved = false,
		touch_startY,
		touch_endY,
		viewport_width,
		viewport_height,
		the_top
					
	const widths = { strip: 50, datos: 406 },

		handle = {
			click: async ( tool, idx ) => {
				switch( tool ){
					case "hamburger": 
						leftdrawer = !leftdrawer
						break

					case "analysis":
						if( !btns.analysis.list )
							btns.analysis.list = await getAnlyzDropDowns( )

						btns.analysis.fields = getAnlyzFieldsInit( btns.analysis.list, btns.analysis.gisid, btns.analysis.neigh_code )
						btns.analysis.open = !btns.analysis.open
						search_error = ""
						break

					case "owner": case "situs": case "main":
						search.set( tool )
						search_value = ""
						search_error = ""
						search_results.length = 0
						break
					
					case "prelimplan":
						if( !btns.prelimplan.list )
							btns.prelimplan.list = await getPrelimPlans( )		

						search.set( tool )
						search_error = ""
						search_results.length = 0
						break

					case "enggrid":
						if( !btns.enggrid.list )
							btns.enggrid.list = await getEnggrids( )		

						search.set( tool )
						search_error = ""
						search_results.length = 0						
						break

					case "sidepanel":
						datadrawer.set( !_datadrawer )
						break

				}

			}, 

			left_drawer: event => { 
				leftdrawer  = event.detail.leftdrawer 

			},

			open: event => {
				search_active  = event.detail.open

				if( search_active && [ "prelimplan", "enggrid" ].includes( _search ) && search_results.length === 0 )
					search_results = btns[_search].list

			},

			search_error: event =>{
				search_error = event.detail.msg

			},

			search_items: event => {
				search_nomatch = event.detail.nomatch
				search_results = formatSearchResults( event.detail.items, event.detail.srch_str )
				
			},

			search_pick: async i => {
				const hit = search_results[ i ]

				if( hit.value ){
					if( [ "owner", "situs", "main" ].includes( _search ) ){
						goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( String( hit.srch_key ) ) }` )
						search_value = hit.value
						search_active = false
						search_error = "" 

					}else if( _search === "prelimplan" ){
						const rows = await getPrelimPlan( hit.value )

						if( rows.length > 0 ){
							messenger.set( [
									{ type: "zoom_to_extent", extent: rows[ 0 ] },
									{ type: "toggle_layer", layers: getToggleLayerList( "lnddvlpmnt", "prelimplans" ) }

								] )

						}


						
					}else if( _search === "enggrid" ){
						messenger.set( [
								{ type: "zoom_to_extent", extent: { xmin: hit.xmin, ymin: hit.ymin, xmax: hit.xmax, ymax: hit.ymax } },
								{ type: "toggle_layer", layers: getToggleLayerList( "lnddvlpmnt", "enggrid" ) }

							] )
						
					}

				}
				
			},

			touch_start: event => {
				if( event.changedTouches[ 0 ].screenY !== undefined )
					touch_startY = event.changedTouches[ 0 ].screenY
		
			},

			touch_move: event => {
				touch_moved = true
			
			},

			touch_end: event => {
				if( touch_moved ){
					
					if( event.changedTouches[ 0 ].screenY !== undefined )
						touch_endY = event.changedTouches[ 0 ].screenY

					if( touch_startY > touch_endY )
						dual.set( !_dual )

					else if( touch_startY < touch_endY && !_dual ) 
						dual.set( !_dual )
					
					else if( touch_startY < touch_endY && _dual ) 
						datadrawer.set( !_datadrawer )

					touch_moved = false	
										
				}
			
			}

		}
	
	//Events
	onMount( async ( ) => {
		Owner = ( await import( "$lib/components/search/Owner.svelte" ) ).default
		Situs = ( await import( "$lib/components/search/Situs.svelte" ) ).default
		Prelimplan = ( await import( "$lib/components/search/Prelimplan.svelte" ) ).default
		Enggrid = ( await import( "$lib/components/search/Enggrid.svelte" ) ).default
		Analysis = ( await import ( "$lib/components/search/Analysis.svelte" ) ).default

		//Subscriptions
		messenger.subscribe( msgs => { 
            msgs.forEach( msg => { 
				switch( msg.type ){
                    case "set_gisid_anlyz_buffer":
                        btns.analysis.gisid = msg.gisid

						break

					case "set_neigh_code":
                        btns.analysis.neigh_code = msg.neigh_code

                        break

					case "redo_analysis":
						if( btns.analysis.list )
							btns.analysis.open = !btns.analysis.open
						else
							handle.click( "analysis" )

						break

					case "scroll_to_top":
						the_top.scrollIntoView( { behavior: "smooth" } )
						break

                }

            } )

        } )

		search.subscribe( value => { _search = value } )
		datadrawer.subscribe( value => { _datadrawer = value } )
		
	} )

	mobile.subscribe( value => { _mobile = value } )
	dual.subscribe( value => { _dual = value } )
	title.subscribe( value => { _title = value } )

	//Reactives
	$: if( $page.route.id ){
		route = $page.route.id
		href =  $page.url.href

	}

	$: mobile.set( viewport_width <= 768 )

	$: offset.set( { 
			left: ( !_mobile && route.match( /(prop)|identify/ig ) && _datadrawer ? 452 : (mobile ? -6 : 46 ) ), 
			bottom: ( _mobile && _dual && route.match( /(prop)|identify/ig ) ? viewport_height/2 : 0 ), 
			top: ( _mobile && _dual ? 50 : 0 ) 
		} )

	$: btns.sidepanel = { 
			...btns.sidepanel, 
			icon: ( _datadrawer ? "expandless" : "expandmore" ), 
			tooltip: ( _datadrawer ? "Collapse side panel" : "Expand side panel" ), 
			show: ( route.match( /(prop)|identify/ig ) ? true : false )

		}

	$: btns.hamburger = { ...btns.hamburger, show: !_mobile }
	
	$: if( route === "/" )
		messenger.set( [ { type: "clear_all_graphics" } ] )
			
</script>