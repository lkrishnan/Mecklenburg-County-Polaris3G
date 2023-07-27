<div class="w-full flex justify-{justify} gap-4 text-pop font-semibold text-xs p-2">
    {#each btns as btn}
        {#if btn.hasOwnProperty( "link" )}
            <a
                href='{btn.link}'
                class="flex items-center flex-col rounded-lg border-2 border-pop bg-lienzo shadow-lg p-1 hover:bg-pop hover:text-lienzo"
                target='_blank'
                rel='noreferrer'
            >
                <div class="rounded-full p-1">
                    {@html icon( btn.icon, 28, 28 )}
                </div>
                <span class="text-center max-w-[48px]">
                    {btn.label}
                </span>

            </a>

        {:else}
        
            <button 
                class="flex items-center flex-col rounded-lg border-2 border-pop bg-lienzo shadow-lg p-1 hover:bg-pop hover:text-lienzo"
                on:mouseover="{(event)=>{open=true}}"
                on:focus="{(event)=>{open=true}}"
                on:click="{(event)=>{dispatch("click", { icon: btn.icon })}}"
            >
                <div class="rounded-full p-1">
                    {@html icon( btn.icon, 28, 28 )}
                </div>
                
                <span class="max-w-[48px]">{btn.label}</span>
            
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