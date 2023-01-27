<div class="relative">
    <div class={`flex gap-1 items-center ${pad || 'p-1'}`}>
        <input type="text" 
            class="grow bg-transparent text-lg placeholder:italic placeholder:text-sm focus:outline-none text-gray-900"
            {name}
            {placeholder}
            bind:value="{srch_str}"
            bind:this={input}
            on:input="{(event)=>onChange(event)}"
            on:keydown="{(event)=>onKeyDown(event)}"
            use:focusOnMount />


        <button class="inline-flex items-center justify-center w-10 h-10 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </button>
        
        {#if spinner}
            <div class="inline-flex items-center justify-center w-10 h-10">
                <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        {:else}    
            <button class="inline-flex items-center justify-center w-10 h-10 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        {/if}
    </div>
    
    <div class="{!is_open ? 'hidden' : ''} w-full">
        <ul class="w-full bg-white shadow-lg rounded-b-md border-t" bind:this={list} >
            {#if !nomatch}
                {#each results as result, i}
                    <li class="text-gray-700 px-2 py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-gray-100 hover:cursor-pointer last:rounded-b-md">
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

    let is_open = false
    let max_items= 10
    let input
    let list
    let pad

	export { pad as padding }
    export let name = ""
    export let value = ""
    export let minchar = 2
    export let placeholder = ""
    export let items = [ ]
    export let nomatch = false
    export let spinner = false
    export let arrowCounter = 0
    export let results= [ ]
    export let srch_str = value

    const dispatch = createEventDispatcher( )

    function focusOnMount( node ){
        node.focus( )

    }

    // debounce
    const debounce = ( fn, time ) => {
        let timeout
        
        return function( ){
            const functionCall = () => fn.apply( this, arguments )
            clearTimeout( timeout)
            timeout = setTimeout( functionCall, time )
        
        }

    }

    $: if (items.length > 0) {
        filterResults( )
    }

    $: if( is_open ){
        dispatch( "open", { open: true } )

    }else{
        dispatch( "open", { open: false } )

    }
    
    const regExpEscape = (s) => {
        return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")

    }

    async function onChange( event ){
        if( srch_str.trim( ).length >= Number( minchar ) ){
            is_open = true;

            ( debounce( e => {
                dispatch( "query", srch_str )
                }, 200 ) )( )
            
        }else{
            is_open = false

        }

    }


    function onKeyDown( event ){
        if( event.key === "ArrowDown" && arrowCounter < results.length ){
            arrowCounter =  arrowCounter + 1
        
        }else if( event.key === "ArrowUp" && arrowCounter > 0 ){
            arrowCounter =  arrowCounter - 1

        }else if( event.key === "Enter" ){
            event.preventDefault( )

            if( arrowCounter === -1 ){
                arrowCounter = 0 // Default select first item of list

            }
            close( arrowCounter )

        }else if( event.key === "Escape" ){
            is_open = false

        }

    }

    function close( index = -1 ){
        is_open = false
        arrowCounter = -1

        if( index > -1 ){
            input.blur( )
            value = results[ index ].value
            srch_str = value
            dispatch( "hit", items[ index ] )
        
        }else if( !value ){
            is_open = false

        }

    }
    
    function filterResults( ){
        results = items.map(item => {
            const text = typeof item !== "string" ? item.value : item

            return {
                value: item.value || item,
                type: item.type,
                label: srch_str.trim( ) === '' ? text : text.replace(RegExp(regExpEscape(srch_str.trim()), 'i'), "<span class='text-gray-700 font-bold'>$&</span>")
            }

        } )

    }

</script>