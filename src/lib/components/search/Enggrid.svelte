<div class="relative w-full rounded border-primero">
    {#if list.length > 0}
        <!-- Left Buttons -->
        <div class = "absolute z-10 left-[0px] my-1 ml-1">
            {#if _results_count > 1 && _results_index > -1 }
                <button 
                    class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                    on:click="{(event)=>{results_index.set( -1 )}}"
                >
                    {@html icon( "arrowback", 28, 28 )}
                </button>

            {:else if _mobile && !_dual }
                <button 
                    class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                    on:click="{(event)=>{dual.set( !_dual )}}"
                >
                    {@html icon( "expandmore", 28, 28 )}
                </button>

            {:else if _mobile }
                <button 
                    class="md:hidden inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                    on:click="{(event)=>{dispatch( "leftdrawer", { leftdrawer: !leftdrawer } )}}"
                >
                    {@html icon( "hamburger", 28, 28 )}
                </button>
            
            {:else}
                <div class="hidden md:inline-flex items-center justify-center w-10 h-10">
                    {@html icon( "arrowselect", 28, 28 )}
                </div>
            
            {/if}
            
        </div>

        <div class="bg-lienzo">
            <Selecto 
                items={list} {pad} bind:selected={selected} {hide_items} {open}
                on:hit={handleHit} on:open={handleOpen}

            />

        </div>
                
    {:else}
        <div class="flex items-center p-2 gap-2 text-pop">
            {@html icon( "alert", 48, 48 )}
            <h1>Search Unavailable</h1>
        </div>

    {/if}
           
</div>
    
<script>
    import {createEventDispatcher} from "svelte"
    import {mobile, results_count, results_index, dual, messenger} from "$lib/store"
    import {getToggleLayerList} from "$lib/mapping"
    import {icon} from "$lib/utils"

    import Selecto from "$lib/components/Selecto.svelte"

    export let list = [ ]
    export let pad = ""
    export let leftdrawer = false
    export let hide_items = false
    export let open = false
    export let selected = 0 

    //Store Variables
    let _mobile,
        _results_count,
		_results_index,
        _dual

    let _open = false

    const dispatch = createEventDispatcher( ),

        handleHit = event => {
            const hit =  event.detail

            if( hit.value ){
                messenger.set( [
                    { type: "zoom_to_extent", extent: { xmin: hit.xmin, ymin: hit.ymin, xmax: hit.xmax, ymax: hit.ymax } },
                    { type: "toggle_layer", layers: getToggleLayerList( "lnddvlpmnt", "enggrid" ) }

                ] )

            }

        },

        handleOpen = event => {
            _open  = event.detail.open

        }

    //Subscriptions
    dual.subscribe( value => { _dual = value } )
    mobile.subscribe( value => { _mobile = value } )
    results_count.subscribe( value => { _results_count = value } )
    results_index.subscribe( value => { _results_index = value } )

    //Reactives
    $: dispatch( "open", { open: _open } )

</script>