<div class="text-sm">
    {#if infos.length > 1 }
        <div class="mt-2">
            <Selecto on:hit={handleHit} items={items} selected={selected}/>
            
        </div>

        <div class="mt-2">
            <InfoTable infos={info} />
        </div>
        

    {:else if infos.length > 0}
        <InfoTable infos={info} />

    {:else}
        <div class="text-pop flex justify-center gap-4">
            {@html icon( "alert", 48, 48 )}
            <span class="self-center font-bold">No data found</span>
            
        </div>
    {/if}
</div>


<script>
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Selecto from "$lib/components/Selecto.svelte"
    import { icon } from "$lib/utils"
    
    export let data

    const items = data.rows.map( (row, i) => { return { id: i, value: row.name } } ),
        infos = data.rows.map( row => { 
            return Object.entries( row ) 
                    .filter( kv => kv[ 0 ].toLowerCase( ) !== "shape" )
                    .map( ( fkv, i ) => {
                        return { label: fkv[ 0 ], value: fkv[ 1 ] } 

                    } )

        } ),
        
        handleHit = event => {
            console.log( event.detail.id )
            info = infos[ event.detail.id ]

        }

    let selected = 0,
        info = infos[ selected ]


    
</script>