<div 
    class="flex flex-row gap-2 p-4 bg-lienzo border-b last:border-b-0 border-edge hover:bg-secondary hover:cursor-pointer"
    role="button"
    tabindex=-1
    on:click="{()=>handleHit( )}" 
    on:keydown="{event=>handleKeyDown( event )}"
>
    <div>
        {idx+1}.

    </div>
    
    <div class="grow truncate">
        <!-- pid -->
        <div>
            <span class="text-segundo font-semibold">Parcel ID &#x2022;</span> {info.pid}

        </div>

        <!-- address -->
        {#if info?.mat && [ "ownership", "property" ].includes( view )}
            <div class="truncate">
                {#if info.mat.length > 1}
                    <span class="text-segundo font-semibold">Addresses on Property:</span> 
                    {@html formatArrAsHTML( info.mat.map( item => item.address ) )}

                {:else}
                <span class="font-semibold">
                    {info.mat.map( item => item.address )[ 0 ]}
                </span>

                {/if}

            </div>

        {/if}

        <!-- Owner -->
        {#if info?.owner && [ "ownership", "deed" ].includes( view )}
            <div>
                <span class="text-segundo font-semibold">Ownership</span>
                    {@html formatOwnersAsHTML2( info.owner )}
            </div>
        {/if}

        <!-- Sale info -->
        {#if ( info.sale_price || info.sale_date) && [ "property" ].includes( view )}
            <div>
                <span class="text-segundo font-semibold">Last Sale &#x2022;</span> 
                {formatMoney( info.sale_price )} ({formatDate( info.sale_date )})

            </div>

        {/if}

        <!-- market val -->
        {#if info.market_value && [ "property" ].includes( view )}
            <div>
                <span class="text-segundo font-semibold">Market Value &#x2022;</span> 
                {formatMoney( info.market_value )}

            </div>

        {/if}

        <!-- Area -->
        {#if [ "deed", "property" ].includes( view )}
            <div>
                <span class="text-segundo font-semibold">Land Area &#x2022;</span> 
                {( info.sqft ? formatLandArea( info.land_size, info.land_unit, ( info.sqft / 43650 ) ) : "NA" )}
            
            </div>

        {/if}

        <!-- Legal Desc -->
        {#if [ "deed" ].includes( view )}
            <div class="truncate">
                <span class="text-segundo font-semibold">Legal Desc &#x2022;</span> 
                { ( info.legal_description ? info.legal_description : "NA" ) }
                
            </div>

        {/if}
    
        <!-- Deed -->
        {#if [ "deed" ].includes( view )}
            <div class="truncate">
                <span class="text-segundo font-semibold">Deed &#x2022;</span> 
                {info.deed_book}-{info.deed_page}
                
            </div>

        {/if}

        <!-- Building -->
        {#if info?.bldg && [ "property" ].includes( view )}
            {#each info.bldg as bldg, i}
                <div class="pb-2 last:pb-0">
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
                            class="flex flex-wrap gap-1 justify-center p-2"
                        >
                            <PocoCard title="Year Built" iconname="today" content="{(bldg.year_built ? bldg.year_built : "NA" )}" />
                            <PocoCard title="Sq. Feet" iconname="setsquare" content="{(bldg.total_sqft ? bldg.total_sqft : "NA" )}" />
                            <PocoCard title="Bedrooms" iconname="bed" content="{(bldg.bedrooms ? bldg.bedrooms : "NA" )}" />
                            <PocoCard title="Full Baths" iconname="bath" content="{(bldg.full_baths ? bldg.full_baths : "NA" )}" />

                        </div>

                    {/if}

                </div>

            {/each}

        {/if}

    </div>
            
</div>

<script>
    import { createEventDispatcher } from "svelte"
	import { formatMoney, formatArrAsHTML, formatLandArea, formatDate, formatOwnersAsHTML2 } from "$lib/format"
    import PocoCard from "$lib/components/PocoCard.svelte"
    import { slide } from "svelte/transition"
    
    // component props
	export let info = {}
    export let idx = {}
    export let view = "ownership"

    const dispatch = createEventDispatcher( ),
        handleKeyDown = ( event ) => {
            if( event.key === "Enter" ){
                event.preventDefault( )
                handleHit( )

            }

        },

        handleHit = ( ) => { 
            dispatch( "pick", { idx: idx } )
           
        }

</script>

<style>
	svg { 
        transition: transform 0.2s ease-in;
        transform: rotate(0.25turn);
    }
    [aria-expanded=true] svg { transform: rotate(0.75turn); }
</style>