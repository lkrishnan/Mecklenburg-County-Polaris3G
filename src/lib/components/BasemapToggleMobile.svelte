<div class="relative flex flex-col items-center"
    on:mouseleave="{(event)=>{ ( debounce( e => { if(!mouse_on)open=false }, 200 ) )( ) }}"
    on:blur="{(event)=>{ ( debounce( e => { if(!mouse_on)open=false }, 200 ) )( ) }}"    
    role="button"
    tabindex="-1"
>
    <div class="flex flex-row flex-wrap gap-4 justify-center">
        {#each basemaps as basemap, idx}
            <button class="border-2 {(idx==basemap_idx?'border-segundo bg-segundo':'border-primero')} text-lienzo bg-primero text-xs rounded w-[60px] h-[64px] hover:border-segundo hover:bg-segundo hover:text-lienzo"
                on:click="{(event)=>{basemap_idx=idx;handleClick( 'basemap', basemap.idx )}}">
                <img alt="{basemap.label}" src="{basemap.img}" />    
                <div class="p-1">{basemap.label}</div>
            
            </button>
                    
        {/each}
    </div>

    {#if [ 1, 2 ].includes( basemap_idx )}
        <div class="pt-4 font-semibold text-sm">
            Aerial Year
        </div>

        <div class="flex flex-row flex-wrap gap-4 w-72 pt-4 justify-center">
            <!--<Selecto items={aerial_list} bind:selected={aerial_selected} on:hit={handle.hit} />-->
            {#each aerial_yrs as yr, idx}
                <button 
                    class="{idx==yr_idx?'bg-segundo':'bg-primero'} text-lienzo text-sm rounded p-3 hover:bg-segundo"
                    on:click="{(event)=>{yr_idx = idx; handleClick( 'aerial_yr', yr )}}"
                >
                    {yr}
                </button>
            {/each}

        </div>

    {/if}
    
</div>

<script>
    import StreetsThumb from '$lib/images/street_thumb_b2wm.jpg'
    import HybridThumb from "$lib/images/Jhbrid_thumb_b2.jpg"
    import AerialsThumb from "$lib/images/thumbnail1591224931210.jpeg"
    import TopoThumb from "$lib/images/Terrain_Labels_Web_map.jpg"
    import { createEventDispatcher } from "svelte"

    let open = false,
        mouse_on = false,
        basemaps = [
            { idx: 3, label: "Streets", img: StreetsThumb },
            { idx: 2, label: "Aerials", img: AerialsThumb },
            { idx: 1, label: "Hybrid", img: HybridThumb },
            { idx: 0, label: "Topo", img: TopoThumb },    
                        
        ],
        basemap_idx = 0,
        aerial_yrs = [ "2023", "2022", "2021", "2020", "2019", "2018", "2017" ],
        yr_idx = 0

    // constants
    const dispatch = createEventDispatcher( ),
        debounce = ( fn, time ) => { // add a timeout before a function call
            let timeout
        
            return function( ){
                const functionCall = () => fn.apply( this, arguments )
                clearTimeout( timeout)
                timeout = setTimeout( functionCall, time )
            
            }

        },
        handleClick = ( typ, selection ) => {
            if( typ == "basemap")
                dispatch( "basemap_change", { new_basemap_idx: selection } )

            else if( typ == "aerial_yr")
                dispatch( "aerial_yr_change", { new_aerial_yr: selection } )

            
        }

</script>