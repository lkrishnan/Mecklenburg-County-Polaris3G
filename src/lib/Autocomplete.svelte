<svelte:window on:click="{()=>close()}" />

<div class="relative">
    <div class="flex items-center {pad}">
        <input type="text" 
            class="grow bg-transparent text-md placeholder:text-md placeholder:text-edge focus:outline-none text-inputtxt"
            {name}
            {placeholder}
            bind:value="{str}"
            bind:this={input}
            on:input="{(event)=>onChange(event)}"
            on:keydown="{(event)=>onKeyDown(event)}"
            use:focusOnMount />


        {#if go}
            <button class="ml-1 inline-flex items-center justify-center w-{btnsize} h-{btnsize} text-primary transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-secondary"
                on:click="{(event)=>onClick(event)}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
        {/if}
        
        {#if spinner}
            <div class="inline-flex items-center justify-center w-{btnsize} h-{btnsize}">
                <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        {:else}    
            <button class="inline-flex items-center justify-center w-{btnsize} h-{btnsize} text-primary transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-secondary"
                on:click="{(event)=>{str = ""; input.focus( ); is_open = false;}}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        {/if}
    </div>

    
    <div class="{!is_open ? 'hidden' : 'absolute z-20'} top-[50px] {(btnsize<10 ? '-' : '' )}mt-[{btnsize-2}px] left-0 w-full md:max-h-[350px] border border-edge rounded overflow-y-auto">
        <ul class="bg-surface shadow-lg rounded-b-md" bind:this={list} >
            {#if !nomatch}
                {#each results as result, i}
                    <li on:click="{()=>close(i)}" on:keydown="{()=>close(i)}" class="text-gray-700 px-2 py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-secondary hover:cursor-pointer last:rounded-b-md { i === arrowCounter ? ' bg-secondary' : '' }">
                        <span class="font-bold pr-1">{result.type}:</span>
                        {@html result.label}
                    </li>
                {/each}
            {:else}
                <li class="text-gray-700 font-semibold text-sm py-2 px-2">No matches found</li>
            {/if}
        </ul>
    </div>
                           
</div>


<script>
    import { createEventDispatcher } from "svelte"
    import { null2empty } from "$lib/utils" 

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
    export let arrowCounter = 0
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

        close = ( index = -1 ) => { // handle dropdown selection
            is_open = false
            arrowCounter = -1

            if( index > -1 ){
                input.blur( )
                value = results[ index ].value
                str = value
                dispatch( "hit", items[ index ] )
            
            }else if( !value ){
                is_open = false

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

                if( arrowCounter === -1 ){
                    arrowCounter = 0 // default select first item of list

                }
                close( arrowCounter ) // select dropdown item

            }else if( event.key === "Escape" ){
                is_open = false

            }

        },

        onClick = event => { // handle search button click
            if( nomatch || results.length === 0 ){
                console.log( "do backup search" ) //dispatch backup search query
                is_open = false
                
            }else{
                if( arrowCounter === -1 )
                    arrowCounter = 0 // default select first item of list

                close( arrowCounter ) // select dropdown item

            }

        }

</script>