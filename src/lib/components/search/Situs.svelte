<div class="relative w-full bg-lienzo border border-primero rounded">
    <!-- Hamburger Button -->
    <div class = "absolute z-10 left-[0px] my-1 ml-1.5">
        {#if _results_count > 1 && _results_index > -1 }
            <button 
                class="inline-flex items-center justify-center w-8 h-8 transition-colors duration-150 rounded-full text-pop hover:text-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{results_index.set( -1 )}}"
            >
                {@html icon( "arrowback", 28, 28 )}
            </button>

        {:else if _mobile && !_dual }
            <button 
                class="inline-flex items-center justify-center w-8 h-8 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{dual.set( !_dual )}}"
            >
                {@html icon( "expandmore", 28, 28 )}
            </button>

        {:else if _mobile }
            <button 
                class="md:hidden inline-flex items-center justify-center w-8 h-8 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{dispatch( "leftdrawer", { leftdrawer: !leftdrawer } )}}"
            >
                {@html icon( "hamburger", 28, 28 )}
            </button>
    
        {:else}
            <div class="hidden md:inline-flex items-center justify-center w-8 h-8">
                {@html icon( "search", 28, 28 )}
            </div>
    
        {/if}
        
    </div>

    <AutoComplete placeholder="Enter Situs Address" 
        {minchar} {spinner} go={false} {nomatch} {items} {hide_items} {value} {is_open}
        padding="pl-10 py-1 pr-1"
        buttonsize="8"     
        on:brute={handle.brute}
        on:hit={handle.hit}
        on:open={handle.open}
        on:query={handle.query}
    />    
           
</div>

<script>
    import {createEventDispatcher} from "svelte"
    import {mobile, results_count, results_index, dual} from "$lib/store"
    import {json2URL, srchstr2qrystr, icon} from "$lib/utils"
    import {goto} from "$app/navigation"

    import AutoComplete from "$lib/components/AutoComplete.svelte"

    export let leftdrawer = false
    export let hide_items = false
    export let value = ""
    export let is_open = false

    //Store Variables
    let _mobile,
        _results_count,
		_results_index,
        _dual

    let items = [ ],
        nomatch = false,
        spinner = false
       

    const dispatch = createEventDispatcher( ),
        minchar = 3,

        handle = {
            brute: event => {
                let hit

                const srch_str = event.detail

               if( items.length > 0 )
                    hit = items[ 0 ]

                // propogate hit
                if( hit )
                    hit_it( hit.type, hit.value )
                else
                    dispatch( "error", { msg: "Enter a Valid Search String!" } )

            },
            
            hit: event => {
                hit_it( event.detail.type, event.detail.value )

            },

            query: async event => {
                // Fetch Results
                spinner = true

                const srch_str = event.detail.trim( )
                
                if( srch_str.length >= minchar ){
                    const response = await fetch( `/api/validate/situs?${json2URL( { address: srch_str.trim( ) } )}` )
                    
                    items = ( response.ok ? await response.json( ) : [ ] )

                }else
                    items.length = 0
                
                nomatch = ( items.length === 0 )

                if( _mobile )
                    dispatch( "items", { items: items, srch_str: srch_str, nomatch: nomatch } )

                spinner = false

            },

            open: event => {
                is_open  = event.detail.open

            },

        },

        hit_it = ( type, value ) => {
            dispatch( "reset", { msg: "" } )
            goto( `/${type.toLowerCase( )}/${srchstr2qrystr( value ) }` )

        }

    //Subscriptions
    dual.subscribe( value => { _dual = value } )
    mobile.subscribe( value => { _mobile = value } )
    results_count.subscribe( value => { _results_count = value } )
    results_index.subscribe( value => { _results_index = value } )

    //Reactives
    $:dispatch( "open", { open: is_open } )

</script>