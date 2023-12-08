<div class="relative w-full rounded border-primero">
    <div class="md:flex hidden flex-row items-center p-2">
        <div class="grow font-bold text-lg">
            {heading}
        </div>
        <div class="flex">
            <button 
                class="p-1 rounded-full group relative transition-colors duration-150 hover:text-segundo"
                on:click="{(event)=>{dispatch( "close", { close: false } )}}"
            >
                {@html icon( "close", 24, 24 )}
            </button>
            
        </div>
        
    </div>

    <form class="px-2 pt-2">
        <div class="w-full bg-lienzo border {fields.situs_addr.error ? 'border-pop' : 'border-todo' } rounded" id="situs_addr">
            <AutoComplete placeholder="Enter Situs Address" minchar={fields.situs_addr.minchar} go={false}
                bind:spinner={fields.situs_addr.spinner}  bind:nomatch={fields.situs_addr.nomatch} 
                bind:items={fields.situs_addr.items} bind:str={fields.situs_addr.val}
                padding="pl-3 pr-2 py-2" buttonsize="8" 
                on:query={event => { handleQuery( event ) }}
                on:hit={handleHit}
                on:open={handleOpen}/>
        </div>
        <p class="{fields.situs_addr.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.situs_addr.error}</p>
                    
    </form>
           
</div>

<script>
    import { createEventDispatcher } from "svelte"
    import { fade, fly } from "svelte/transition"
    import { validateForm } from "$lib/validate" 
    import { json2URL, srchstr2qrystr, icon } from "$lib/utils"
    import { goto } from "$app/navigation"
    import AutoComplete from "$lib/components/AutoComplete.svelte"

    export let heading = ""

    let fields = {
            situs_addr: { val: null,
                rules: [
                        v => ( v && v.trim( ).length > 75 ? "Situs must be within 75 characters" : null ),
                    ], 
                minchar: 2,
                items: [ ],
                nomatch: false,
                spinner: false,
                hit_prop: [ "pid", "gisid" ]

            }

        },
        hit,
        is_open = false

    const dispatch = createEventDispatcher( ),
        handleHit = event => {
            hit =  event.detail

            const verdict = validateForm( fields )
                fields = verdict.fields

            if( verdict.valid && hit.value === fields.situs_addr.val )
                goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )


        },
        
        handleQuery = async event => { // fetch matches
            // Fetch Results
            fields.situs_addr.spinner = true

            const response = await fetch( `/api/validate/situs?${json2URL( { address: fields.situs_addr.val } )}` ), 
                json = ( response.ok ? await response.json( ) : [ ] )

            fields.situs_addr = { ...fields.situs_addr, items:json, spinner: false, nomatch: false }

            if( fields.situs_addr.items.length === 0 )
                fields.situs_addr.nomatch = true

        },

        handleOpen = event => {
            is_open  = event.detail.open

        }

    //Reactives
    $: if( is_open ){
        dispatch( "open", { open: true } )

    }else{
        dispatch( "open", { open: false } )

    }

</script>