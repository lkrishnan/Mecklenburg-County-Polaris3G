<div class="w-full flex flex-wrap justify-{justify} gap-2 text-pop font-semibold text-xs p-2 justify-center">
    {#each btns as btn}
        {#if btn.hasOwnProperty( "link" )}
            <a
                href='{btn.link}'
                class="flex items-center flex-col rounded shadow-md border-2 border-pop bg-lienzo p-2 hover:bg-pop hover:text-lienzo"
                target='_blank'
                rel='noreferrer'
                on:click="{(event)=>{dispatch("click", { icon: btn.icon })}}"
            >
                {@html icon( btn.icon, 28, 28 )}
                {btn.label}
                
            </a>

        {:else if btn.disabled}
            <button 
                class="flex items-center flex-col border-suave border-2 rounded shadow-md p-2 bg-lienzo text-suave cursor-not-allowed disabled"
            >
                {@html icon( btn.icon, 28, 28 )}
                {btn.label}
                    
            </button>
        {:else}
            <button 
                class="flex items-center flex-col border-pop border-2 rounded shadow-md p-2 bg-lienzo fill-pop hover:bg-pop hover:text-lienzo hover:fill-lienzo"
                on:mouseover="{(event)=>{open=true}}"
                on:focus="{(event)=>{open=true}}"
                on:click="{(event)=>{dispatch("click", { icon: btn.icon })}}"
            >
                
                {@html icon( btn.icon, 28, 28 )}
                {btn.label}
                                
            </button>

        {/if}

    {/each}

</div>

<script>
    import {icon} from "$lib/utils"
    import { createEventDispatcher } from "svelte"

    export let btns = [ ]
    export let justify = "start"

    const dispatch = createEventDispatcher( )

</script>