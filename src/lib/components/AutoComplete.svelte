<div class="relative">
    <div class="flex items-center {pad}">
        <input type="text" 
            class="grow bg-transparent text-md placeholder:text-md placeholder:text-suave focus:outline-none text-todo"
            {name}
            {placeholder}
            bind:value="{str}"
            bind:this={input}
            on:input="{(event)=>handle.change( event )}"
            on:keydown="{(event)=>handle.keyDown( event )}"
            use:focusOnMount />


        {#if go}
            <button 
                class="ml-1 inline-flex items-center justify-center w-{btnsize} h-{btnsize} transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{( )=>handle.close( )}"
            >
                {@html icon( "search", 28, 28 )}
            </button>
        {/if}
        
        {#if spinner}
            <div class="inline-flex items-center justify-center w-{btnsize} h-{btnsize} fill-segundo">
                {@html icon( "spinner", 28, 28 )}
            </div>
        {:else}    
            <button 
                class="inline-flex items-center justify-center w-{btnsize} h-{btnsize} transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{str = ""; input.focus( ); is_open = false;}}"
            >
                {@html icon( "close2", 28, 28 )}
            </button>
        {/if}
    </div>
    
  <div class="{is_open && !hide_items ? 'absolute z-50 mt-1' : 'hidden' } {(btnsize<10 ? '-' : '' )}mt-[{btnsize-2}px] left-0 w-full max-h-[350px] border border-edge overflow-y-auto scrollbar">
        <ul class="bg-lienzo shadow-lg" bind:this={list} >
            {#if !nomatch}
                {#each results as result, i}
                    <li>
                        <div 
                            on:click="{()=>handle.close( i )}" 
                            on:keydown="{()=>handle.close( i )}"
                            role="button" 
                            tabindex=-1
                            class="text-todo px-2 py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer { i === arrowCounter ? ' bg-secondary' : '' }"
                        >
                            <span class="font-bold pr-1 text-segundo">{result.type}:</span>
                            {@html result.label}
                        </div>
                        
                    </li>
                    
                {/each}
            {:else}
                <li class="text-pop font-semibold text-sm py-2 px-2">No matches found</li>
            {/if}
        </ul>
    </div>
                           
</div>

<script>
    import {createEventDispatcher} from "svelte"
    import {formatSearchResults} from "$lib/format"
    import {debounce, icon, null2empty} from "$lib/utils"

    // variables
    let input,
        list,
        pad = "p-1",
        btnsize = 10

    // component props
	export { pad as padding }
    export { btnsize as buttonsize }
    export let name = ""
    export let value = ""
    export let minchar = 3
    export let placeholder = ""
    export let items = [ ]
    export let nomatch = false
    export let spinner = false
    export let go = false
    export let arrowCounter = -1
    export let results = [ ]
    export let str = value
    export let hide_items = false
    export let is_open = false
    
    // constants
    const dispatch = createEventDispatcher( ),
        
        focusOnMount = node => {  
            node.focus( )

        },

        handle = {
            close: ( idx = -1 ) => { // handle dropdown selection
                // Reset
                is_open = false
                arrowCounter = -1

                if( idx > -1 ){
                    input.blur( )
                    value = results[ idx ].value
                    str = value
                    
                    dispatch( "hit", items[ idx ] )

                }else{
                    if( str.trim( ).length >= Number( minchar ) ){
                        dispatch( "brute", str )

                    }

                }
                
            },

            change: async event => { // handle input change
                ( debounce( e => { dispatch( "query", str ) }, 200 ) )( )

            },

            keyDown: event => { // handle keyboard events
                if( event.key === "ArrowDown" && arrowCounter < results.length )
                    arrowCounter =  arrowCounter + 1
            
                else if( event.key === "ArrowUp" && arrowCounter > 0 )
                    arrowCounter =  arrowCounter - 1

                else if( event.key === "Enter" ){
                    event.preventDefault( )
                    handle.close( arrowCounter )

                }else if( event.key === "Escape" )
                    is_open = false

            },

            itemChange: ( _items ) => {
                if( !hide_items && _items.length > 0 )
                    results = formatSearchResults( _items, str )

                if( _items.length > 0 )
                    is_open = true
                else if( str.length < 3 )
                    is_open = false

            }
            
        }

    // reactives
    $: handle.itemChange( items )
    
    $: dispatch( "open", { open: is_open } )

</script>