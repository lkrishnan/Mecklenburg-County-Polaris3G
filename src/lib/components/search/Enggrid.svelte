<div class="relative w-full rounded border-primero">
    <div class="md:flex hidden flex-row items-center p-2">
        <div class="grow font-bold text-lg">
            {heading}
        </div>
        <div class="flex">
            <button 
                class="p-1 rounded-full group relative transition-colors duration-150 hover:text-segundo"
                on:click="{(event)=>{dispatch( "close", { close: false } )}}"
            >
                {@html icon( "close", 24, 24 )}
            </button>
            
        </div>
        
    </div>

    {#if list.length > 0}
        <div class="bg-lienzo">
            <Selecto items={list} bind:selected={selected} on:hit={handleHit} on:open={handleOpen}/>
        </div>
                
    {/if}
           
</div>
    
<script>
    import { createEventDispatcher } from "svelte"
    import { fade, fly } from "svelte/transition"
    import { messenger } from "$lib/store"
    import { icon } from "$lib/utils"
    import overlays_data from "$lib/data/overlays"
    import Selecto from "$lib/components/Selecto.svelte"

    export let heading = ""
    export let list = [ ]

    let selected = 0,
        is_open = false

    const dispatch = createEventDispatcher( ),

        handleHit = event => {
            const hit =  event.detail

            if( hit.value ){
                const group_idx = overlays_data.findIndex( item => item.id === "lnddvlpmnt" ),
                    lyr_idx = overlays_data[ group_idx ].children.findIndex( item => item.id === "enggrid" )

                //set checkboxes in overlay list
                overlays_data[ group_idx ].children[ lyr_idx ].checked = true
                overlays_data[ group_idx ].checked = ( overlays_data[ group_idx ].children.filter(item => item.checked).length === overlays_data[ group_idx ].children.length )

                messenger.set( [
                    { type: "zoom_to_extent", extent: { xmin: hit.xmin, ymin: hit.ymin, xmax: hit.xmax, ymax: hit.ymax } },
                    { type: "toggle_layer", layers: [ { group_idx: group_idx, lyr_idx: lyr_idx, visible: true } ] }

                ] )

            }

        },

        handleOpen = event => {
            is_open  = event.detail.open

        }

//Reactives
$: if( is_open ){
    dispatch( "open", { open: true } )

}else{
    dispatch( "open", { open: false } )

}

</script>