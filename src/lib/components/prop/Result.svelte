<div 
    class="flex flex-row gap-2 p-4 bg-lienzo border-b last:border-b-0 border-edge hover:bg-secondary hover:cursor-pointer"
    role="button"
    tabindex=-1
    on:click|stopPropagation="{()=>handleHit( )}" 
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
            
                {#if info.mat.length > 3}
                    <div class="flex items-center gap-2">
                        <span class="text-segundo font-semibold">Addresses on Property:</span>
                        <button 
                            class="pl-2 pr-1 text-xs bg-luz fill-primero rounded-md group hover:bg-lienzo hover:text-primero hover:fill-primero"
                            on:click|stopPropagation={( )=>{max3=!max3} }
                        >
                            <span class="flex items-center">
                                {( max3 ? "More" : "Less" )}
                                {@html icon( ( max3 ? "expandmore" : "expandless" ), 20, 20 )}
        
                            </span>
        
                        </button>

                    </div>
                    
                    <div class="truncate">
                        {@html formatArrAsHTML( info.mat.slice( 0, 3 ).map( item => item.address ), "" )}

                        {#if !max3 }
                            {@html formatArrAsHTML( info.mat.slice( 3 ).map( item => item.address ), "<br/>", 3 )}
                        
                        {/if}

                    </div>

                {:else if info.mat.length > 1}
                    <span class="text-segundo font-semibold">Addresses on Property:</span>
                    <div class="truncate">
                        {@html formatArrAsHTML( info.mat.map( item => item.address ), "" )}
                    </div>
                    
                {:else if info.mat.length > 0}
                    <span class="text-segundo font-semibold">Address on Property:</span>
                    <div class="truncate font-semibold">
                        {info.mat.map( item => item.address )[ 0 ]}
                    </div>

                {:else}
                    <span class="text-segundo font-semibold">Address on Property:</span>
                    <div>NA </div>
                
                {/if}


        {/if}

        <!-- Owner -->
        {#if info?.owner && [ "ownership", "deed" ].includes( view )}
            <div class="truncate">
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
                <div class="flex justify-start items-center gap-2 pb-1 last:pb-0">
                    <span class="text-segundo font-semibold">Building {bldg.bldg_seq}:</span>
                    <button 
                        class="pl-2 pr-1 text-xs bg-luz fill-primero rounded-md group hover:bg-lienzo hover:text-primero hover:fill-primero"
                        on:click|stopPropagation={( )=>{ bldg.open = !bldg.open} }
                    >
                        <span class="flex items-center">
                            {( bldg.open ? "Hide" : "Show" )}
                            {@html icon( ( bldg.open ? "expandless" : "expandmore" ), 20, 20 )}
    
                        </span>
    
                    </button>

                </div>    

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

            {/each}

        {/if}

    </div>
            
</div>

<script>
    //Svelte Libraries
    import {createEventDispatcher} from "svelte"
    import {slide} from "svelte/transition"

    //Custom Libraries
	import {formatMoney, formatArrAsHTML, formatLandArea, formatDate, formatOwnersAsHTML2 } from "$lib/format"
    import {icon} from "$lib/utils"
    import PocoCard from "$lib/components/PocoCard.svelte"
        
    // component props
	export let info = {}
    export let idx = {}
    export let view = "ownership"
    export let max3 = true

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