<!--svelte:window on:click="{()=>close()}" /-->
<div class="relative">
    <div class="flex items-center {pad}">
        <input type="text" 
            class="grow bg-transparent text-md placeholder:text-md placeholder:text-suave focus:outline-none text-todo"
            {name}
            {placeholder}
            bind:value="{str}"
            bind:this={input}
            on:input="{(event)=>onChange(event)}"
            on:keydown="{(event)=>onKeyDown(event)}"
            use:focusOnMount />


        {#if go}
            <button 
                class="ml-1 inline-flex items-center justify-center w-{btnsize} h-{btnsize} transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{( )=>close( )}"
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
    
    <div class="{!is_open ? 'hidden' : 'absolute z-50'} top-[52px] {(btnsize<10 ? '-' : '' )}mt-[{btnsize-2}px] left-0 w-full md:max-h-[350px] border border-edge rounded overflow-y-auto">
        <ul class="bg-surface shadow-lg rounded-b-md" bind:this={list} >
            {#if !nomatch}
                {#each results as result, i}
                    <li>
                        <div 
                            on:click="{()=>close(i)}" 
                            on:keydown="{()=>close(i)}"
                            role="button" 
                            tabindex=-1
                            class="text-todo px-2 py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer last:rounded-b-md { i === arrowCounter ? ' bg-secondary' : '' }"
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
    import { createEventDispatcher } from "svelte"
    import { null2empty, icon } from "$lib/utils"

    // variables
    let is_open = false,
        input,
        list,
        pad = "p-1",
        btnsize = 10

    // component props
	export { pad as padding }
    export { btnsize as buttonsize }
    export let name = ""
    export let value = ""
    export let minchar = 2
    export let placeholder = ""
    export let items = [ ]
    export let nomatch = false
    export let spinner = false
    export let go = false
    export let arrowCounter = -1
    export let results= [ ]
    export let str = value

    // reactives
    $: if( items.length > 0 ){ // format results returned from searches
        filterResults( )

    }
    /*else{
        ( debounce( e => { 
            is_open = false // close dropdown after 1 second
        }, 2000 ) )( )
        

    }*/

    $: if( is_open ){
        dispatch( "open", { open: true } )

    }else{
        dispatch( "open", { open: false } )

    }

    // constants
    const dispatch = createEventDispatcher( ),
        
        focusOnMount = node => {  
            node.focus( )

        },
        
        debounce = ( fn, time ) => { // add a timeout before a function call
            let timeout
        
            return function( ){
                const functionCall = () => fn.apply( this, arguments )
                clearTimeout( timeout)
                timeout = setTimeout( functionCall, time )
            
            }

        }, 
        
        regExpEscape = s => { // regular expression to highlight search string in autocomplete results
            return s.replace( /[-\\^$*+?.()|[\]{}]/g, "\\$&" )

        },

        filterResults = ( ) =>{ // format results
            results = items.map( item => {
                const text = typeof item !== "string" ? item.value : item

                return {
                    value: item.value || item,
                    type: item.type,
                    label: null2empty( str ) === '' ? text : text.replace( RegExp( regExpEscape( null2empty( str ).trim( ) ), "i" ), "<span class='text-gray-700 font-bold'>$&</span>" )
                    
                }

            } )

        },

        close = ( idx = -1 ) => { // handle dropdown selection
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

        onChange = async event => { // handle input change
            if( str.trim( ).length >= Number( minchar ) ){
                is_open = true;

                ( debounce( e => {
                    dispatch( "query", str ) // dispatch autocomplete search query
                    }, 200 ) )( )
                
            }else{
                is_open = false

            }

        },

        onKeyDown = event => { // handle keyboard events
            if( event.key === "ArrowDown" && arrowCounter < results.length ){
                arrowCounter =  arrowCounter + 1
            
            }else if( event.key === "ArrowUp" && arrowCounter > 0 ){
                arrowCounter =  arrowCounter - 1

            }else if( event.key === "Enter" ){
                event.preventDefault( )
                close( arrowCounter )

            }else if( event.key === "Escape" )
                is_open = false

        }

</script>