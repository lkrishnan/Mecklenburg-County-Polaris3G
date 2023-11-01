<div class="w-full flex flex-wrap justify-{justify} gap-4 text-pop font-semibold text-xs p-2 justify-center">
    {#each btns as btn}
        {#if btn.hasOwnProperty( "link" )}
            <a
                href='{btn.link}'
                class="flex items-center flex-col rounded shadow-md border-2 border-pop bg-lienzo p-1 hover:bg-pop hover:text-lienzo"
                target='_blank'
                rel='noreferrer'
            >
                <div class="rounded-full p-1">
                    {@html icon( btn.icon, 28, 28 )}
                </div>
                <span class="text-center w-[{btn.width}]">
                    {btn.label}
                </span>

            </a>

        {:else if btn.disabled}
            <button 
                class="flex items-center flex-col rounded disabled text-suave cursor-not-allowed border-2 border-suave bg-lienzo p-1"
            >
                <div class="rounded-full p-1">
                    {@html icon( btn.icon, 28, 28 )}
                </div>
        
                <span class="w-[{btn.width}]">{btn.label}</span>
    
            </button>
        {:else}
        
            <button 
                class="flex items-center flex-col rounded shadow-md border-2 border-pop bg-lienzo p-1 hover:bg-pop hover:text-lienzo"
                on:mouseover="{(event)=>{open=true}}"
                on:focus="{(event)=>{open=true}}"
                on:click="{(event)=>{dispatch("click", { icon: btn.icon })}}"
            >
                <div class="rounded-full p-1">
                    {@html icon( btn.icon, 28, 28 )}
                </div>
                
                <span class="w-[{btn.width}]">{btn.label}</span>
            
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