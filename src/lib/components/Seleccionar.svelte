<svelte:window bind:innerHeight={screen_ht} />
<div class="w-full relative" bind:this={body}>
    
    <button 
        type="button" 
        class="relative w-full cursor-pointer rounded py-3 pl-3 pr-10 text-left shadow ring-1 ring-inset ring-primero focus:outline-none focus:ring-2 focus:ring-segundo sm:text-sm sm:leading-6 {items.length === 0 ? 'cursor-not-allowed text-suave' : 'text-primero' }"
        
        on:click="{(event)=>{open = !open; let bnd = body.getBoundingClientRect( ); pos = ( bnd.bottom + 200 < screen_ht ? 'top-12' : 'bottom-14' )}}"
        on:blur="{(event)=>{( debounce( e => { open = false }, 200 ) )( ) }}"
        on:keydown="{(event)=>onKeyDown(event)}"
    >
        <span class="flex items-center">
            {#if items.length > 0 }
                <span class="block">{items[ selected ].label}</span>

            {:else}
                <span class="block text-suave">Nothing to Select</span>

            {/if}
            
        </span>
        
        <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            {@html icon( "unfold", 24, 24 )}

        </span>

    </button>
    
    <div class="absolute z-20 {!open ? 'hidden' : pos } w-full mt-1 border border-primero rounded">
        <ul 
            bind:this={element} 
            class="bg-lienzo shadow-lg md:max-h-[200px] overflow-y-auto scrollbar rounded"
            on:focus={(event)=>{arrowCounter = -1}}
            on:mouseover={(event)=>{arrowCounter = -1}}
        >
            {#each items as item, i}
                <li 
                    class="relative py-1.5 pl-1.5 pr-9 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer { i === arrowCounter ? ' bg-segundo text-lienzo' : '' }"
                >
                    <span 
                        class="font-normal ml-1.5 block truncate"
                        on:click="{()=>close(i)}" 
                        on:keydown="{()=>close(i)}"
                        role="button" 
                        tabindex=-1 
                    >                
                        {item.label}
                    </span>
                    
                    {#if i == selected}  
                        <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-segundo">
                            {@html icon( "checksm", 28, 28 )}
                            
                        </span>
    
                    {/if}
    
                </li>
    
            {/each}
    
        </ul>
    
    </div>

</div>



<script>
    import {createEventDispatcher} from "svelte"
    import {icon} from "$lib/utils"

    // variables
    let open = false,
        element,
        body,
        screen_ht,
        pos = 'top-12'

     // component props
	export let items = [ ]
    export let selected = -1
    export let arrowCounter = -1

    const dispatch = createEventDispatcher( ),
            close = ( idx = -1 ) => { // handle dropdown selection
            // Reset
            arrowCounter = -1
            selected = idx

            if( idx > -1 )
                dispatch( "hit", items[ idx ] )
            
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
    .scrollbar {
	    border-radius: 5px;

    }
    /* For Chrome, EDGE, Opera, Others */
    .scrollbar::-webkit-scrollbar {
        border-radius: 5px;

    }

    .scrollbar::-webkit-scrollbar-track { 
        border-radius: 5px;

    }

    .scrollbar::-webkit-scrollbar-thumb { 
        border-radius: 5px;

    }
</style>