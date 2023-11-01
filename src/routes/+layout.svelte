<svelte:head>
	{@html webManifest}
</svelte:head>

<svelte:window bind:innerWidth={screen_size} />

<Map />

<div class="{ screen_size > 768 ? 'absolute left-0 top-0 z-30' : 'hidden' } flex flex-col items-center w-14 h-full gap-0.5 p-2 bg-luz border-r-2 border-primero shadow-lg">
	{#each btns as btn, i}
		<button 
            class="p-1 border bg-luz border-luz rounded group relative hover:bg-segundo hover:border-segundo hover:text-lienzo hover:fill-lienzo"
			on:click="{(event)=>{handleClick(btn.tool, i)}}"
        >
            {@html icon( btn.icon, 26, 26 )}
           
                <span
                    class="bg-segundo text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] left-12 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    {btn.tooltip}
                </span>
            
        </button>
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

{#if _searchdrawer}
	<div
		in:fly="{{ y: -180, duration: 1200 }}" out:fade
		class="absolute z-20 left-14 top-0 h-full md:w-[406px] border-r bg-lienzo border-primero overflow-auto scrollbar"
	>
		<div class="flex flex-row items-center p-4">
			<div class="grow font-bold text-lg">
				{btns[ sel_search ].tooltip}
			</div>
			<div class="flex">
				<button 
					class="p-1 border bg-lienzo border-lienzo rounded-full group relative transition-colors duration-150 hover:bg-luz hover:fill-segundo"
					on:click="{(event)=>{searchdrawer.set(false);}}"
				>
					{@html icon( "close", 24, 24 )}
				</button>
				
			</div>
			
		</div>

		{#if btns[ sel_search ].tool === "analysis" }
			<Analysis />
		{:else if btns[ sel_search ].tool === "owner"}
			<Owner />
		{:else if btns[ sel_search ].tool === "situs"}
			<Situs />
		{:else if btns[ sel_search ].tool === "prelimplan"}
			<Prelimplan />
		{:else if btns[ sel_search ].tool === "enggrid"}
			<Enggrid />
		{/if}

	</div>
{/if}

<div class="absolute z-10 md:left-14 left-0 top-0 md:w-[408px] w-full md:border-r-2 border-primero shadow-lg { $page.route.id.match( /(datos)/ig ) && datosdrawer ? 'h-full overflow-auto scrollbar bg-lienzo' : 'rounded-b md:border-b-2' }">
	<div class="{screen_size > 768 ? 'bg-lienzo' : 'hidden'}">
		<div class="flex flex-row">
			<Seal />
		</div>
		
	</div>
	<div class="sticky top-0 p-2 flex flex-col gap-2 bg-lienzo z-10">
		<MainSearch leftdrawer={leftdrawer} on:leftdrawer={handleLeftDrawer} />
		
	</div>

	{#if datosdrawer }
		<main
			transition:slide="{{duration: 500, axis: 'x'}}"
		>
			<slot />
		</main>
	
		

	{/if}

	

</div>

{#if datosdrawer }
	<button 
		transition:slide="{{duration: 500, axis: 'x'}}"
		class="{_searchdrawer || !$page.route.id.match( /(datos)/ig ) || !datosdrawer ? 'hidden' : 'absolute z-6' } left-0 top-[50%] bg-lienzo border-y border-r border-primero text-primero hover:text-segundo hover:bg-luz rounded-r ml-[464px] shadow-lg invisible md:visible"
		alt="Collapse side panel"
		on:click="{(event)=>{datosdrawer = false;}}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>

	</button>

{:else}

	<button 
		transition:slide="{{delay: 500, axis: 'x'}}"
		class="{_searchdrawer || !$page.route.id.match( /(datos)/ig ) || datosdrawer ? 'hidden' : 'absolute z-5' } left-0 top-[50%] ml-[56px] bg-lienzo border-y border-r border-primero text-primero hover:text-segundo hover:bg-luz rounded-r shadow-lg"
		alt="Collapse side panel"
		on:click="{(event)=>{datosdrawer = true;}}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>
{/if}

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<script>
    import "../app.css"
    
	import { onMount } from "svelte"
	import { pwaInfo } from "virtual:pwa-info"
	import { fade, fly, slide } from "svelte/transition"
	import { icon } from "$lib/utils"
	import { searchdrawer, offset } from "$lib/store"
	import { page } from "$app/stores"

	import Analysis from "$lib/components/search/Analysis.svelte"
	import Enggrid from "$lib/components/search/Enggrid.svelte"
	import MainSearch from "$lib/components/search/MainSearch.svelte"
	import Map from "$lib/components/Map.svelte"
	import Owner from "$lib/components/search/Owner.svelte"
	import Prelimplan from "$lib/components/search/Prelimplan.svelte"
	import Seal from "$lib/components/Seal.svelte"
	import Situs from "$lib/components/search/Situs.svelte"
	
	let ReloadPrompt,
		leftdrawer = false,
		sel_search = 0,
		datosdrawer = true,
		screen_size,
		_searchdrawer = false,
		_offset
			
	const btns = [ 
		{ icon: "hamburger", tool: "hamburger", tooltip: "Hidden Menu" },
		{ icon: "labresearch", tool: "analysis", tooltip: "Market Analysis" },
		{ icon: "person", tool: "owner", tooltip: "Owner Search" },
		{ icon: "locationcity", tool: "situs", tooltip: "Situs Address Search" },
		{ icon: "architecture", tool: "prelimplan", tooltip: "Preliminary Plan Search" },
		{ icon: "grid", tool: "enggrid", tooltip: "Engineering Grid Search" },
    ],
	widths = { strip: 50, datos: 406 },
	
	handleClick = ( tool, idx ) => {
		switch( tool ){
			case "hamburger": 
				leftdrawer = !leftdrawer
				break

			case "analysis": case "owner": case "situs": case "prelimplan": case "enggrid":
				searchdrawer.set( true )
				sel_search = idx
				break

		}

    }, 
	
	handleLeftDrawer = event => { leftdrawer  = event.detail.leftdrawer }

	onMount( async ( ) => {
		pwaInfo && ( ReloadPrompt = ( await import( "$lib/components/ReloadPrompt.svelte" ) ).default )

	} )
    
	searchdrawer.subscribe( value => { 
        _searchdrawer = value

    } )

	offset.subscribe( value => { 
		_offset = value

	} )

	$: offset.set( $page.route.id.match( /(datos)/ig ) && screen_size > 768 && datosdrawer ? ( widths.strip + widths.datos ) : ( screen_size > 768 ? widths.strip : 0 ) )

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ""
			
</script>