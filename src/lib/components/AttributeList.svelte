<div class="text-sm">
    {#if infos.length > 0 }
        {#if infos.length > 1 }
            <div class="mt-2 bg-lienzo">
                <Selecto on:hit={handleHit} items={items} selected={selected}/>
                
            </div>

        {/if}

        <div class="{infos.length > 1 ? 'mt-2' : 'mt-0'}">
            <InfoTable infos={infos[selected]} />
            
        </div>
        
    {:else}
        <div class="text-pop flex justify-start gap-2 p-2">
            {@html icon( "alert", 48, 48 )}
            <span class="self-center font-bold">No data found</span>
            
        </div>

    {/if}
</div>

<script>
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Selecto from "$lib/components/Selecto.svelte"
    import { icon } from "$lib/utils"

    export let infos = [ ]
    export let selected = 0
    export let items = [ ]

    const handleHit = event => { selected = event.detail.id }

</script>