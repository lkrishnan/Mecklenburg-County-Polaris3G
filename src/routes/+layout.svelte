<!--<svelte:head>
	{@html webManifest}
</svelte:head>-->

<svelte:window bind:innerWidth={screen_size} />

<Map />

<div class="flex bg-luz { screen_size > 768 ? 'fixed left-0 top-0 z-40 h-full flex-col p-2 gap-0.5' : 'sticky bottom-0 w-full justify-center p-2 gap-2' } shadow-lg">
	{#each Object.keys( btns ) as btn, i}
		{#if btns[ btn ].show }
			<button 
				class="{ screen_size <= 768 && btns[ btn ].tool === 'hamburger' ? 'hidden' : '' } p-1 border bg-luz border-luz rounded group relative hover:bg-segundo hover:border-segundo hover:text-lienzo hover:fill-lienzo"
				on:click="{(event)=>{handleClick(btns[ btn ].tool, i)}}"
			>
				{@html icon( btns[ btn ].icon, 26, 26 )}
					<span class="bg-segundo text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute md:top-[4px] md:left-12 -top-10 -left-[45px] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm">
						{btns[ btn ].tooltip}
						
					</span>
								
			</button>

		{/if}

	{/each}
</div>

{#if leftdrawer}
	<div transition:slide="{{duration: 500, axis: 'x'}}" class="md:w-[{widths.datos-200}px] absolute md:left-14 left-0 top-0 z-20 flex flex-col h-full bg-lienzo md:border-r md:border-primero transition-all duration-1000 transform">
		<div class="flex flex-row items-center p-2">
			<div class="grow font-bold text-2xl">
				Polaris 3G
			</div>
			<div class="flex">
				<button 
					class="p-1 border bg-lienzo border-lienzo rounded-full group relative transition-colors duration-150 hover:bg-luz hover:fill-segundo"
					on:click="{(event)=>{leftdrawer=false}}"
				>
					{@html icon( "close", 24, 24 )}
				</button>
				
			</div>
			
		</div>
	</div>
	
{/if}

{#if btns.analysis.open}
	<Analysis 
		heading={btns.analysis.tooltip} 
		fields={btns.analysis.fields}
		list={btns.analysis.list}
		gisid={btns.analysis.gisid}
		neigh_code={btns.analysis.neigh_code}
		on:close={event=>{btns.analysis.open = event.detail.open; btns.analysis.fields = event.detail.fields;}} 

	/>

{/if}

<div class="absolute z-10 md:left-[52px] left-0 top-0 md:w-[408px] w-full overflow-auto scrollbar
		{ search_active ? 'h-full' : '' }
		{ ( $page.route.id.match( /(prop)|identify/ig ) && _datadrawer ) ? 'shadow-lg h-full bg-luz' : '' }"
>
	<div class="bg-luz pb-2 { ( $page.route.id.match( /((prop)|identify)/ig ) && _datadrawer ) ? '' : 'rounded-br-lg' }">
		<div class="{_search === 'main' ? 'flex' :'hidden'}">
			<Seal />
		</div>
		<div class="sticky top-0 p-2 z-50 bg-luz">
			{#if _search === "main"}
				<MainSearch leftdrawer={leftdrawer} on:leftdrawer={handleLeftDrawer} on:open={handleOpen} />
			
			{:else if _search === "owner"}
				<Owner heading={btns.owner.tooltip} on:close={event=>{search.set("main")}} on:open={handleOpen} />
			
			{:else if _search === "situs"}
				<Situs heading={btns.situs.tooltip} on:close={event=>{search.set("main")}} on:open={handleOpen} />
				
			{:else if _search === "prelimplan"}
				<Prelimplan heading={btns.prelimplan.tooltip} list={btns.prelimplan.list} on:close={event=>{search.set("main")}} on:open={handleOpen}/>
				
			{:else if _search === "enggrid"}
				<Enggrid heading={btns.enggrid.tooltip} list={btns.enggrid.list} on:close={event=>{search.set("main")}} on:open={handleOpen}/>
			
			{/if}
		</div>
		
	
		<main>
			<slot />
		</main>

	</div>

</div>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />

{/if}

<script>
    import "../app.css"
    
	import {onMount} from "svelte"
	//import {pwaInfo} from "virtual:pwa-info"
	import {slide} from "svelte/transition"
	import {page} from "$app/stores"
	import {getPrelimPlans, getEnggrids, getAnlyzFieldsInit, getAnlyzDropDowns} from "$lib/formhelp"
	import {offset, messenger, search, datadrawer} from "$lib/store"
	import {icon} from "$lib/utils"
	
	import Analysis from "$lib/components/search/Analysis.svelte"
	import Enggrid from "$lib/components/search/Enggrid.svelte"
	import MainSearch from "$lib/components/search/MainSearch.svelte"
	import Map from "$lib/components/Map.svelte"
	import Owner from "$lib/components/search/Owner.svelte"
	import Prelimplan from "$lib/components/search/Prelimplan.svelte"
	import Seal from "$lib/components/Banner.svelte"
	import Situs from "$lib/components/search/Situs.svelte"
	
	let ReloadPrompt,
		screen_size,	
		leftdrawer = false,
		btns =  {
			hamburger: { icon: "hamburger", tool: "hamburger", tooltip: "Hidden Menu", show: true },
			analysis: { 
					icon: "labresearch", 
					tool: "analysis", 
					tooltip: "Market Analysis", 
					open: false, 
					list: null, 
					gisid: null, 
					neigh_code: null,
					initstate: null,
					fields: null, 
					show: true
				},
			owner: { icon: "person", tool: "owner", tooltip: "Owner Search", show: true },
			situs: { icon: "locationcity", tool: "situs", tooltip: "Situs Address Search", show: true },
			prelimplan: { icon: "architecture", tool: "prelimplan", tooltip: "Preliminary Plan Search", list: null, show: true },
			enggrid: { icon: "grid", tool: "enggrid", tooltip: "Engineering Grid Search", list: null, show: true },
			sidepanel: { icon: "doublearrowdown", tool: "sidepanel", tooltip: "Expand side panel", show: false },

		},
		search_active = false,
		_offset,
		_search = "main",
		_route,
		_datadrawer = true
			
	const widths = { strip: 50, datos: 406 },
		
		handleClick = async ( tool, idx ) => {
			switch( tool ){
				case "hamburger": 
					leftdrawer = !leftdrawer
					break

				case "analysis":
					if( !btns.analysis.list )
						btns.analysis.list = await getAnlyzDropDowns( )

					btns.analysis.fields = getAnlyzFieldsInit( btns.analysis.list, btns.analysis.gisid, btns.analysis.neigh_code )
					btns.analysis.open = !btns.analysis.open
					break

				case "owner": case "situs":
					search.set( search === tool ? "main" : tool )
					break
				
				case "prelimplan":
					if( !btns.prelimplan.list )
						btns.prelimplan.list = await getPrelimPlans( )		

					search.set( search === tool ? "main" : tool )
					break

				case "enggrid":
					if( !btns.enggrid.list )
						btns.enggrid.list = await getEnggrids( )		

					search.set( search === tool ? "main" : tool )
					
					break

				case "sidepanel":
					_datadrawer = !_datadrawer
					datadrawer.set( _datadrawer )
					break

			}

		}, 
	
		handleLeftDrawer = event => { leftdrawer  = event.detail.leftdrawer },

		handleOpen = event => {
            search_active  = event.detail.open

        },

		handleRouteChange = ( route, _datadrawer ) => {
			if( route === "/" )
				messenger.set( [ { type: "clear_all_graphics" } ] )

			btns.sidepanel = { 
					...btns.sidepanel, 
					icon: ( _datadrawer ? "doublearrowup" : "doublearrowdown" ), 
					tooltip: ( _datadrawer ? "Collapse side panel" : "Expand side panel" ), 
					show: ( route.match( /(prop)|identify/ig ) ? true : false )

				}

		}

	onMount( async ( ) => {
		//pwaInfo && ( ReloadPrompt = ( await import( "$lib/components/ReloadPrompt.svelte" ) ).default )

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
						btns.analysis.open = !btns.analysis.open
						break

                }

            } )

        } )

		offset.subscribe( value => { _offset = value } )
		search.subscribe( value => { _search = value } )
		datadrawer.subscribe( value => { _datadrawer = value } )

	} )
	

	//Reactives
	$: if( $page.route.id )
		_route = $page.route.id
	
	$: { handleRouteChange( _route, _datadrawer ) }
	
	$: offset.set( $page.route.id.match( /(prop)|identify/ig ) && screen_size > 768 && _datadrawer ? ( widths.strip + widths.datos ) : ( screen_size > 768 ? widths.strip : 0 ) )

	//$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ""
			
</script>