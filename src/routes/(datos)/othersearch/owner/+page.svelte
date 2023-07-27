<div class="p-2">
    <form class="p-2" on:submit|preventDefault={validate}>
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="lastname">
                Last Name / Business Name
            </label>
            <div class="w-full bg-lienzo border {fields.lastname.error ? 'border-pop' : 'border-todo' } rounded" id="lastname">
                <AutoComplete placeholder="Required" minchar={fields.lastname.minchar} go={false}
                    bind:spinner={fields.lastname.spinner}  bind:nomatch={fields.lastname.nomatch} 
                    bind:items={fields.lastname.items} bind:str={fields.lastname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "lastname" ) }}/>
            </div>
            <p class="{fields.lastname.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.lastname.error}</p>
        </div>
        
        
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="firstname">
                First Name
            </label>
            <div class="w-full bg-surface border {fields.firstname.error ? 'border-pop' : 'border-todo' } rounded" id="firstname">
                <AutoComplete placeholder="Required" minchar={fields.firstname.minchar} go={false} 
                    bind:spinner={fields.firstname.spinner}  bind:nomatch={fields.firstname.nomatch} 
                    bind:items={fields.firstname.items} bind:str={fields.firstname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "firstname" ) }}/>
            </div>
            <p class="{fields.firstname.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.firstname.error}</p>

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
    import AutoComplete from "$lib/components/AutoComplete.svelte";
    import { last_hit } from '$lib/store'
    import { goto } from "$app/navigation"
    	
    let fields = {
            firstname: { val: null,
                rules: [
                        v => ( v && v.trim( ).length > 75 ? "First Name must be within 75 characters" : null ),
                    ], 
                minchar: 2,
                items: [ ],
                nomatch: false,
                spinner: false,

            },
            lastname: { 
                val: null,
                rules: [
                        v => ( !v ? "Last Name is required" : null ),
                        v => ( v.trim( ).length > 75 ? "Last Name must be within 75 characters" : null ),
                    ],
                minchar: 2,
                items: [ ],
                nomatch: false,
                spinner: false,
  
            },

        }
        
    const validate = ( ) => {
            const verdict = validateForm( fields )
            fields = verdict.fields

            if( verdict.valid ){
                let attribs = { },
                    type,
                    value

                Object.keys( fields ).forEach( field => {
                    if( fields[ field ].val )
                        attribs[ field ] = fields[ field ].val

                } )

                if( attribs.hasOwnProperty( "lastname" ) && attribs.hasOwnProperty( "firstname" ) ){
                    type = "OWNER"
                    value = attribs.lastname + ", " + attribs.firstname

                }else if( attribs.hasOwnProperty( "lastname" ) ){
                    type = "OWNERLAST"
                    value = attribs.lastname

                }
                   
                const hit = { value: `${value}`, type: `${type}`, ...attribs }
                last_hit.set( hit )
				goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

            }

        },
        handleQuery = async ( event, field ) => { // fetch matches
            // Fetch Results
            fields[ field ].spinner = true

            const srch_str = event.detail.trim( ),
                getArgs = ( ) => {
                    const args = { 
                            get: field,
                            ...( fields.lastname.val && { lastname: fields.lastname.val } ),
                            ...( fields.firstname.val && { firstname: fields.firstname.val } ),
                            
                        }

                    return args

                },
                response = await fetch( `/api/validate/owner?${json2URL( getArgs( ) )}` ), 
                json = ( response.ok ? await response.json( ) : [ ] )

            fields[ field ] = { ...fields[ field ], items:json, spinner: false, nomatch: false }

            if( fields[ field ].items.length === 0 ) nomatch = true

        }

</script>