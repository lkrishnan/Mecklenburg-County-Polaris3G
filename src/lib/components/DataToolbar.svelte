<svelte:window bind:innerWidth={screen_size} />

<div class="relative flex flex-row w-full px-2 gap-2">
    <div class="flex w-[90px]">
        {#if _historia.rsltados.length > 0 && _rsltados.length === 1 }
            <button 
                class="p-2 border-2 border-pop bg-lienzo text-pop rounded group relative hover:bg-pop hover:text-lienzo hover:fill-lienzo"
                on:click="{(event)=>{handleClick( 'back' )}}"
            >
                <span class="flex flex-row gap-2">
                    {@html icon( "arrowback", 24, 24 )}
                    Back

                </span>
                                
            </button>
            
        {/if}
    </div>
        
    <div class="flex grow gap-0 justify-center">
        {#if _rsltados.length > 1 }
            <button 
                class="p-2 border-2 border-primero {rsltadoview === "ownership" ? 'bg-segundo text-lienzo fill-lienzo' : 'bg-lienzo' } rounded-l group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
                on:click="{(event)=>{handleClick( 'ownership' )}}"
            >
                {@html icon( "person", 24, 24 )}
                
                <span
                    class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[44px]' : 'bottom-[44px]'} -left-[75%] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    Ownership View
                
                </span>
                
            </button>

            <button 
                class="p-2 border-x-1 border-y-2 border-primero {rsltadoview === "property" ? 'bg-segundo text-lienzo fill-lienzo' : 'bg-lienzo' } group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
                on:click="{(event)=>{handleClick( 'property' )}}"
            >
                {@html icon( "homenwork", 24, 24 )}
                
                <span
                    class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[44px]' : 'bottom-[44px]'} -left-[65%] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    Property View
                
                </span>
                
            </button>

            <button 
                class="p-2 border-2 border-primero {rsltadoview === "deed" ? 'bg-segundo text-lienzo fill-lienzo' : 'bg-lienzo' } rounded-r group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
                on:click="{(event)=>{handleClick( 'deed' )}}"
            >
                {@html icon( "realestateagent", 24, 24 )}
                
                <span
                    class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[44px]' : 'bottom-[44px]'} -left-[50%] w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    Deed View                
                
                </span>
                
            </button>
        {/if}
   </div>

   <div class="flex w-[90px] justify-end">
        {#if $page.route.id.match( /analysis/ig )}
            <button 
                class="p-2 border-2 border-primero bg-lienzo rounded group relative hover:bg-segundo hover:text-lienzo hover:fill-lienzo"
                on:click="{(event)=>{handleClick( 'back' )}}"
            >
                {@html icon( "tune", 24, 24 )}
                
                <span
                    class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute {screen_size > 768 ? 'top-[44px]' : 'bottom-[44px]'} right-0 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    Redo Filter

                </span>
                
            </button>

        {/if}

   </div>
    
</div>

<script>
    import { createEventDispatcher } from "svelte"
    //import { fade, fly } from "svelte/transition"
    import { icon, debounce } from "$lib/utils"
    import { last_hit, historia, rsltados } from "$lib/store.js"
    import { goto } from "$app/navigation"
    import { page } from "$app/stores"

    let _historia,
        _last_hit, 
        _rsltados,
        open = false,
        screen_size,
        mouse_on = false

     // component props
	export let rsltadoview

    const dispatch = createEventDispatcher( ),
        btns = [ 
            { icon: "arrowback", tool: "back", tooltip: "Back to Results" },
            { icon: "eye", tool: "view", tooltip: "View Type" },
            { icon: "tune", tool: "filter", tooltip: "Filter" },
            { icon: "redo", tool: "redo", tooltip: "Redo Analysis" },
            
        ],

        handleClick = ( tool) => {
            switch( tool ){
                case "ownership": case "property": case "deed":
                    if( rsltadoview !== tool ){
                        rsltadoview = tool
                        dispatch( "viewChange", { view: rsltadoview } )
                    }
                    break

                case "back":
                    last_hit.set( _historia.hit )
		            goto( `/${_historia.hit.type.toLowerCase( )}/${_historia.hit.value}` )
                    break

            }

        }

    historia.subscribe( value => { _historia = value } )
	last_hit.subscribe( value => { _last_hit = value } )
    rsltados.subscribe( value => { _rsltados = value } )

</script>