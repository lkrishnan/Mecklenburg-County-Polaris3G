<div class="w-full mb-2 px-4 select-none">
    {#each list as item, i}
        <a href="{item.photo_url}" target="_blank">
            <img 
                src="{item.photo_url}" 
                alt="{item.photo_view}" 
                class="{i===show_idx ? '' : 'hidden'} border border-primero rounded" 
                on:error="{(event)=>{item.photo_url = "/photo_not_available.jpg"}}"
                />

        </a>
                    
    {/each}

    {#if list.length > 0 }
        <div class="flex py-1 justify-between items-center">
            <button 
                class="p-1.5 bg-primero fill-lienzo text-lienzo rounded-full hover:bg-segundo disabled:opacity-10"
                disabled="{show_idx===0?'disabled':''}"
                
                on:click="{(event)=>{show_idx--}}"
            >
                {@html icon( "arrowback", 24, 24 )}
                
            </button>

            <div class="grow">
                <span class="flex justify-center">
                    {formatUCWords( list[ show_idx ].photo_view )} ({show_idx+1}/{list.length})
    
                </span>
                <span class="flex justify-center">
                   Photo Date: {formatDate( list[ show_idx ].photo_date )}
    
                </span>
            </div>

            <button 
                class="p-1.5 bg-primero fill-lienzo text-lienzo rounded-full hover:bg-segundo disabled:opacity-10"
                disabled="{show_idx===list.length-1?'disabled':''}"
                
                on:click="{(event)=>{show_idx++}}"
            >
                {@html icon( "arrowforward", 24, 24 )}
                
            </button>
        </div>

    {/if}
    
</div>

<script>
    import {formatUCWords, formatDate} from "$lib/format"
    import {icon} from "$lib/utils"

    export let list = [ ]

    let show_idx = 0

    // reactives
    $: if( list.length > 0 )
        show_idx = 0

</script>

