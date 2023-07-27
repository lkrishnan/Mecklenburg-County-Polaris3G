<div class="p-2">
    <form class="p-2" on:submit|preventDefault={validate}>
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="situs_addr">
                Situs Address
            </label>
            <div class="w-full bg-lienzo border {fields.situs_addr.error ? 'border-pop' : 'border-todo' } rounded" id="situs_addr">
                <AutoComplete placeholder="Required" minchar={fields.situs_addr.minchar} go={false}
                    bind:spinner={fields.situs_addr.spinner}  bind:nomatch={fields.situs_addr.nomatch} 
                    bind:items={fields.situs_addr.items} bind:str={fields.situs_addr.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "situs_addr" ) }}
                    on:hit={handleHit}/>
            </div>
            <p class="{fields.situs_addr.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.situs_addr.error}</p>
        </div>
        
        <div>
            <button class="bg-pop border border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                Go
            </button>
        </div>
    </form>
           
</div>

<script>
    import { validateForm } from "$lib/validate" 
    import { json2URL, srchstr2qrystr } from "$lib/utils"
    import AutoComplete from "$lib/components/AutoComplete.svelte"
    import { last_hit } from '$lib/store'
    import { goto } from "$app/navigation"

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
        hit

    const validate = ( ) => {
        const verdict = validateForm( fields )
            fields = verdict.fields

        if( verdict.valid && hit.value === fields.situs_addr.val ){
            last_hit.set( hit )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

    },

    handleHit = event => {
        hit =  event.detail

    },
    
    handleQuery = async ( event, field ) => { // fetch matches
        // Fetch Results
        fields[ field ].spinner = true

        const srch_str = event.detail.trim( ),
            getArgs = ( ) => {
                const args = { 
                        address: fields.situs_addr.val
                        
                    }

                return args

            },
            response = await fetch( `/api/validate/situs?${json2URL( getArgs( ) )}` ), 
            json = ( response.ok ? await response.json( ) : [ ] )

        fields[ field ] = { ...fields[ field ], items:json, spinner: false, nomatch: false }

        if( fields[ field ].items.length === 0 ) nomatch = true

    }

</script>