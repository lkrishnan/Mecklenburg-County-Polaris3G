<div 
    class="grid grid-cols-12 gap-x-3 gap-y-0 bg-surface border-b last:border-b-0 border-edge p-4 hover:bg-secondary hover:cursor-pointer"
    role="button"
    tabindex=-1
    on:click="{()=>handleHit( info.pid, info.gisid )}" 
    on:keydown="{event=>handleKeyDown(event, info.pid, info.gisid)}"
    
>
    <div class="col-span-1 row-span-{5+info.bldg.length}">
        {idx+1}.
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Parcel ID &#x2022;</span> {info.pid}
    </div>
    
    <div class="col-span-11 truncate grow {(info.situs_address.length > 0 ? '' : 'hidden')}">
        {#if info.situs_address.length > 1}
            <span class="font-semibold text-segundo">Tax Situs Addresses:</span> {@html formatArrAsHTML( info.situs_address )}
        {:else if info.situs_address.length === 1 }
            <span class="font-semibold">{info.situs_address}</span>
        {/if}
    </div>
    
    
    <div class="col-span-11">
        <span class="text-segundo font-semibold">Last Sale &#x2022;</span> {formatMoney( info.sale_price )} ({info.sale_date})

    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Market Value &#x2022;</span> {formatMoney( info.market_value )}

    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Land Area &#x2022;</span> {( info.sqft ? ( formatLandArea( info.land_size, info.land_unit, ( info.sqft / 43650 ) ) ) : null )}
        
    </div>

    {#each info.bldg as bldg, i}
        <div class="col-span-11">
            <button 
                class="text-lienzo bg-segundo p-2 rounded text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full" 
                type="button"
                on:click={(event)=>{event.stopPropagation();bldg.open = !bldg.open;}} 
                aria-expanded={bldg.open}
            >
                <div class="flex">
                    <span class="flex grow justify-start">Building {bldg.bldg_seq}</span>    
                    <svg class="w-4 h-4 flex-none" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    
                </div>
                
            </button>
            

            {#if bldg.open}
                <div 
                    transition:slide={{ duration: 300 }}
                    class="col-span-11 flex flex-wrap gap-1 justify-center p-2"
                >
                    <PocoCard title="Year Built" iconname="today" content="{bldg.year_built}" />
                    <PocoCard title="Sq. Feet" iconname="setsquare" content="{bldg.total_square_feet}" />
                    <PocoCard title="Bedrooms" iconname="bed" content="{bldg.bedrooms}" />
                    <PocoCard title="Full Baths" iconname="bath" content="{bldg.full_baths}" />

                </div>

            {/if}

        </div>

    {/each}

</div>

<script>
	import { formatMoney, formatArrAsHTML, formatLandArea } from "$lib/format"
    import { srchstr2qrystr, sortArrayofObjs } from "$lib/utils"
    import { last_hit } from '$lib/store'
    import { goto } from "$app/navigation"
    import { onMount } from "svelte"
    import PocoCard from "$lib/components/PocoCard.svelte"
    import { slide } from "svelte/transition"
    
    // component props
	export let info = {}
    export let idx = {}

    const handleKeyDown = ( event, pid, gisid ) => {
            if( event.key === "Enter" ){
                event.preventDefault( )
                handleHit( pid, gisid )

            }

        },
        
        handleHit = ( pid, gisid ) => { 
            const hit = { value: pid, type: `PICK`, pid: pid, gisid: gisid }
            last_hit.set( hit )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

</script>

<style>
	svg { 
        transition: transform 0.2s ease-in;
        transform: rotate(0.25turn);
    }
    [aria-expanded=true] svg { transform: rotate(0.75turn); }
</style>