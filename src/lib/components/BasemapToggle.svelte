<div class="relative"
    on:mouseleave="{(event)=>{ ( debounce( e => { if(!mouse_on)open=false }, 200 ) )( ) }}"
    on:blur="{(event)=>{ ( debounce( e => { if(!mouse_on)open=false }, 200 ) )( ) }}"    
    role="button"
    tabindex="-1"
>
    <div class="flex col-span-1 row-span-2 justify-end p-0">
        <button 
            class="border-2 border-primero bg-primero text-lienzo text-xs {!open?'rounded':([ 1,2 ].includes( basemap_idx )?'rounded-br':'rounded-r')} w-[78px] h-[76px] hover:bg-segundo"
            on:mouseover="{(event)=>{open=true}}"
            on:focus="{(event)=>{open=true}}"
        >
            <img alt="{basemaps[ basemap_idx ].label}" src="{basemaps[ basemap_idx ].img}" />
            <div class="p-1">{basemaps[ basemap_idx ].label}</div>
        
        </button>
    </div>

    {#if open}
        <div 
            transition:slide="{{duration: 500, axis: "x"}}"
            class="absolute right-[78px] bottom-0 flex gap-2 h-[76px] items-center p-1 px-2 bg-lienzo border-y-2 border-l-2 border-primero rounded-l"
            on:focus="{(event)=>{mouse_on=true}}"
            on:mouseover="{(event)=>{mouse_on=true}}"
            on:mouseleave="{(event)=>{ mouse_on=false }}"
            on:blur="{(event)=>{ mouse_on=false }}"
            role="button"
            tabindex="-1"
        >
            {#each basemaps as basemap, i}
                {#if i!==basemap_idx}
                <button class="border-2 {(i==basemap_idx?'border-segundo bg-segundo':'border-primero')} text-lienzo bg-primero text-xs rounded w-[60px] h-[64px] hover:border-segundo hover:bg-segundo hover:text-lienzo"
                    on:click="{(event)=>{handleClick( 'basemap', i )}}">
                    <img alt="{basemap.label}" src="{basemap.img}" class="w-full" />    
                    <div class="p-1">{basemap.label}</div>
                
                </button>
                {/if}
                
            {/each}

        </div>
    {/if}

    {#if open && [ 1,2 ].includes( basemap_idx )}
        <div 
            transition:slide="{{duration: 500, axis: "y"}}"
            class="absolute bottom-[76px] w-[78px] border-x-2 border-t-2 border-primero bg-lienzo flex flex-col gap-2 p-2 rounded-t"
        >
            {#each aerial_yrs as yr, idx}
                <button 
                    class="{idx==yr_idx?'bg-segundo':'bg-primero'} text-lienzo text-xs rounded p-1 hover:bg-segundo"
                    on:click="{(event)=>{handleClick( 'aerial_yr',idx )}}"
                >
                    {yr}
                </button>
            {/each}
        </div>
    {/if}

</div>

<script>
    import StreetsThumb from '$lib/images/streets_thumb.jpg'
    import HybridThumb from "$lib/images/hybrid_thumb.jpg"
    import AerialsThumb from "$lib/images/aerial_thumb.jpg"
    import TopoThumb from "$lib/images/topo_thumb.jpg"
    import { createEventDispatcher } from "svelte"
    import { slide } from "svelte/transition"

    let open = false,
        mouse_on = false,
        basemaps = [
            { idx: 0, label: "Topo", img: TopoThumb },    
            { idx: 1, label: "Hybrid", img: HybridThumb },
            { idx: 2, label: "Aerials", img: AerialsThumb },
            { idx: 3, label: "Streets", img: StreetsThumb },
            
        ],
        aerial_yrs = [ "2017", "2018", "2019", "2020", "2021", "2022", "2023" ],
        basemap_idx = 3,
        yr_idx = 6

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
            if( typ == "basemap"){
                basemap_idx = selection;
                dispatch( "basemap_change", { new_basemap_idx: basemap_idx } )

            }else if( typ == "aerial_yr"){
                yr_idx = selection
                dispatch( "aerial_yr_change", { new_aerial_yr: aerial_yrs[ yr_idx ] } )

            }
            
        }
</script>