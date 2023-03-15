<svelte:head>
	{@html webManifest}
</svelte:head>

<Map />
<div class="absolute left-0 top-0 flex flex-col gap-[10px] md:w-[430px] w-full h-full {!hideBg( $page.url.pathname ) ? 'bg-surface md:border-r md:border-edge' : ''} transition-colors text-statictxt">
    {#if !hideMainSearch( $page.url.pathname ) }
		<div class="flex flex-initial px-2 pt-2 ">
			<MainSearch />
		</div>	
		
	{:else}
		<div class="flex flex-initial p-2 border-b border-edge">
			<div class="w-full md:flex flex-row justify-center">
				<div class="flex flex-col gap-2">
					<button class="inline-flex items-center justify-center w-10 h-10 text-signify transition-colors duration-150 rounded-full ring-1 ring-signify focus:shadow-outline hover:bg-secondary"
						title="Home" on:click="{()=>{goto( `/` )}}">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
							
					</button>
					
					
				</div>
				
				
			</div>
			
      	</div>

	{/if}   
    
    <div class="flex-auto overflow-auto scrollbar">
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
    import Map from "$lib/Map.svelte"
    import MainSearch from "$lib/MainSearch.svelte"
    import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import { onMount } from "svelte"
	import { pwaInfo } from "virtual:pwa-info"

	let ReloadPrompt
	
	onMount( async ( ) => {
		pwaInfo && ( ReloadPrompt = ( await import( "$lib/ReloadPrompt.svelte" ) ).default )

	} )

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ""

    const hideMainSearch = ( route ) => {
			const route_parts = route.split( "/" ),
				not_allowed = [ "analysis", "othersearch" ]    

			return route_parts.some( item => not_allowed.includes( item ) )
				
		},
		hideBg = ( route ) => {
			const route_parts = route.split( "/" ),
				not_allowed = [ "" ]    
				
			route_parts.shift( )

			return route_parts.some( item => not_allowed.includes( item ) )

		}

</script>

<style>
    /* For Firefox Browser */
.scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #fff;
}


/* For Chrome, EDGE, Opera, Others */
.scrollbar::-webkit-scrollbar {
  width: 5px;
}

.scrollbar::-webkit-scrollbar-track { 
  background: #fff;
}

.scrollbar::-webkit-scrollbar-thumb { 
  background:#9ca3af;
}
</style>