<svelte:head>
	{@html webManifest}
</svelte:head>

<Map />

<div class="absolute z-10 left-2 top-2 md:w-[406px]" >
	<MainSearch leftdrawer={leftdrawer} on:leftdrawer={handleLeftDrawer} />
</div>

<main>
	<slot />
</main>

{#if leftdrawer}
	<div transition:slide="{{duration: 500, axis: 'x'}}" class="md:w-[230px] absolute left-0 top-0 z-20 flex flex-col h-full bg-lienzo md:border-r md:border-primero p-2 transition-all duration-1000 transform">
		<div class="flex items-center">
			<div class="flex-auto border">
				fsdfsd
			</div>
			<div class="flex-none border">
				<button class="inline-flex items-center justify-center w-10 h-10 text-primero transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz"
				on:click="{(event)=>{leftdrawer=false}}">
				<calcite-icon icon="x" scale="m" class="w-7 h-7 stroke-primero hover:stroke-segundo"></calcite-icon>
				</button>
			</div>
			
		</div>
	</div>
	<div class="bg-black opacity-20 absolute left-0 top-0 w-full h-full">
		
	</div>
{/if}

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<script>
    import "../app.css"
    import Map from "$lib/components/Map.svelte"
    import MainSearch from "$lib/components/MainSearch.svelte"
    import { onMount } from "svelte"
	import { pwaInfo } from "virtual:pwa-info"
	import { slide } from 'svelte/transition'
	import { propdrawer } from '$lib/store'

	let ReloadPrompt,
		leftdrawer = false,
		_propdrawer
		
	
	onMount( async ( ) => {
		pwaInfo && ( ReloadPrompt = ( await import( "$lib/components/ReloadPrompt.svelte" ) ).default )

	} )

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ""

	//$: hideBg( $page.url.pathname )
	//	propdrawer = false
	

	//{#if !hideMainSearch( $page.url.pathname ) }
    const /*hideMainSearch = ( route ) => {
			const route_parts = route.split( "/" ),
				not_allowed = [ "analysis", "othersearch" ]    

			return route_parts.some( item => not_allowed.includes( item ) )
				
		},*/
		hideCollapse = ( route ) => {
			const route_parts = route.split( "/" ),
				not_allowed = [ "" ]    
				
			route_parts.shift( )

			return route_parts.some( item => not_allowed.includes( item ) )

		},
		handleLeftDrawer = event => {
			console.log( "here")
            leftdrawer  = event.detail.leftdrawer

        }
    
	propdrawer.subscribe( value => { 
        _propdrawer = value

    } )

		
</script>

<style>
    /* For Firefox Browser */
.scrollbar {
  	scrollbar-width: thin;
  	scrollbar-color: #9ca3af #f3f4f6;

}


/* For Chrome, EDGE, Opera, Others */
.scrollbar::-webkit-scrollbar {
  	width: 7px;

}

.scrollbar::-webkit-scrollbar-track { 
  	background: #f3f4f6;

}

.scrollbar::-webkit-scrollbar-thumb { 
  	background:#9ca3af;

}

</style>

