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
        
        
    {:else}
        <div class="flex items-center p-2 gap-2 text-pop">
            {@html icon( "alert", 48, 48 )}
            <h1>Search Unavailable</h1>
        </div>

    {/if}
           
</div>
    
<script>
    import { createEventDispatcher } from "svelte"
    import { fade, fly } from "svelte/transition"
    import { json2URL } from "$lib/utils"
    import { messenger } from "$lib/store"
    import { icon } from "$lib/utils"
    import overlays_data from "$lib/data/overlays"
    import Selecto from "$lib/components/Selecto.svelte"

    export let heading = ""
    export let list = [ ]

    let selected = 0,
    is_open = false

    const dispatch = createEventDispatcher( ),

        handleHit = async event => {
            const hit =  event.detail

            if( hit.value ){
                const params = {
                    table: "preliminary_plans_ln",
                    columns: "ST_XMin(ST_Extent(shape)) as xmin, ST_YMin(ST_Extent(shape)) as ymin, ST_XMax(ST_Extent(shape)) as xmax, ST_YMax(ST_Extent(shape)) as ymax",
                    filter: `projname = '${list[ selected ].value}'`,

                },
                response = await fetch( `/api/query/gis?${json2URL( params )}` ),
                rows = await response.json( )

                if( rows.length > 0 ){
                    const group_idx = overlays_data.findIndex( item => item.id === "lnddvlpmnt" ),
                        lyr_idx = overlays_data[ group_idx ].children.findIndex( item => item.id === "prelimplans" )

                    //set checkboxes in overlay list
                    overlays_data[ group_idx ].children[ lyr_idx ].checked = true
                    overlays_data[ group_idx ].checked = ( overlays_data[ group_idx ].children.filter(item => item.checked).length === overlays_data[ group_idx ].children.length )

                    messenger.set( [
                        { type: "zoom_to_extent", extent: rows[ 0 ] },
                        { type: "toggle_layer", layers: [ { group_idx: group_idx, lyr_idx: lyr_idx, visible: true } ] }

                    ] )

                }

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