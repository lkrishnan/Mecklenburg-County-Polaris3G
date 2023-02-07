<Map />
<div class="absolute left-0 top-0 flex flex-col gap-[10px] md:w-[430px] w-full h-full {!hideBg( $page.url.pathname ) ? 'bg-surface md:border-r md:border-edge' : ''} pt-2 px-2 transition-colors text-statictxt">
    {#if !hideMainSearch( $page.url.pathname ) }
        <div class="flex flex-initial">
            <MainSearch />
    
    </div>
    {/if}   
    <div class="flex-auto overflow-auto scrollbar">
        <main>
            <slot />
        </main>

    </div>
    
</div>

<script>
    import "../app.css"
    import Map from "$lib/Map.svelte"
    import MainSearch from "$lib/MainSearch.svelte"
    import { page } from "$app/stores"

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