<div class="w-full relative">
    <button 
        type="button" 
        class="relative w-full cursor-default rounded-md bg-surface py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-secondary focus:outline-none focus:ring-2 focus:ring-signify sm:text-sm sm:leading-6"
        on:click="{(event)=>{ open = !open }}"
        on:blur="{(event)=>{ ( debounce( e => { open = !open }, 200 ) )( ) }}"
        on:keydown="{(event)=>onKeyDown(event)}"
    >
        <span class="flex items-center">
            <span class="block truncate">{items[ selected ].address}</span>
        </span>
        
        <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
            </svg>
        </span>
    </button>

    <div class="{!open ? 'hidden' : 'absolute z-20'} w-full py-1">
        <ul 
            bind:this={element} 
            class="bg-surface shadow-lg rounded-md ring-1 ring-inset ring-secondary md:max-h-[200px] overflow-y-auto scrollbar"
            on:focus={(event)=>{ arrowCounter = -1 }}
            on:mouseover={(event)=>{ arrowCounter = -1 }}
        >
            {#each items as item, i}
                <li 
                    on:click="{()=>close(i)}" on:keydown="{()=>close(i)}" 
                    class="relative text-primary py-1.5 pl-1.5 pr-9 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-signify hover:text-signifytxt hover:cursor-pointer first:rounded-t-md last:rounded-b-md { i === arrowCounter ? ' bg-signify text-signifytxt' : '' }"
                >
                    <div class="flex items-center">
                        <span class="font-normal ml-1.5 block truncate">{item.address}</span>
                    </div>
                    {#if i == selected}  
                        <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 stroke-signify" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
    
</div>

<script>
    import { createEventDispatcher } from "svelte"

    // variables
    let open = false,
        element

     // component props
	export let items = [ ]
    export let selected = -1
    export let arrowCounter = -1

    const dispatch = createEventDispatcher( ),
            close = ( idx = -1 ) => { // handle dropdown selection
            // Reset
            //open = false
            arrowCounter = -1
            selected = idx

            if( idx > -1 ){
                dispatch( "hit", items[ idx ] )
            
            }
                
        },

        debounce = ( fn, time ) => { // add a timeout before a function call
            let timeout
        
            return function( ){
                const functionCall = () => fn.apply( this, arguments )
                clearTimeout( timeout)
                timeout = setTimeout( functionCall, time )
            
            }

        },
        
        onKeyDown = event => { // handle keyboard events
            if( event.key === "ArrowDown" && arrowCounter < items.length ){
                open = true
                arrowCounter =  arrowCounter + 1
                if( arrowCounter > 5 )
                    element.scrollBy( 0, 32 )
            
            }else if( event.key === "ArrowUp" && arrowCounter > 0 ){
                arrowCounter =  arrowCounter - 1
                console.log( arrowCounter )
                if( arrowCounter > 5 )
                    element.scrollBy( 0, -32 )

            }else if( event.key === "Enter" ){
                event.preventDefault( )
                close( arrowCounter )

            }else if( event.key === "Escape" )
                open = false

        }

</script>

<style>

</style>