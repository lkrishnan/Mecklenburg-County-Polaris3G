<div class="p-2">
    <form class="p-2" on:submit|preventDefault={validate}>
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="lastname">
                Last Name / Business Name
            </label>
            <div class="w-full bg-surface border {fields.lastname.error ? 'border-red-500' : 'border-edge' } rounded" id="lastname">
                <AutoComplete placeholder="Required" minchar={fields.lastname.minchar} go={false}
                    bind:spinner={fields.lastname.spinner}  bind:nomatch={fields.lastname.nomatch} 
                    bind:items={fields.lastname.items} bind:str={fields.lastname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "lastname" ) }}/>
            </div>
            <p class="{fields.lastname.error ? '' : 'hidden' } mt-2 ml-2 text-red-500 text-xs italic">{fields.lastname.error}</p>
        </div>
        
        
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="firstname">
                First Name
            </label>
            <div class="w-full bg-surface border {fields.firstname.error ? 'border-red-500' : 'border-edge' } rounded" id="firstname">
                <AutoComplete placeholder="Required" minchar={fields.firstname.minchar} go={false} 
                    bind:spinner={fields.firstname.spinner}  bind:nomatch={fields.firstname.nomatch} 
                    bind:items={fields.firstname.items} bind:str={fields.firstname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "firstname" ) }}/>
            </div>
            <p class="{fields.firstname.error ? '' : 'hidden' } mt-2 ml-2 text-red-500 text-xs italic">{fields.firstname.error}</p>

        </div>
        
        <div>
            <button class="bg-primary text-secondary hover:bg-secondary hover:text-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Go
            </button>
        </div>
    </form>
           
</div>

<script>
    import { validateForm } from "$lib/validate" 
    import jsonToURL from "$lib/jsontourl"
    import AutoComplete from "$lib/Autocomplete.svelte"
	
    let fields = {
            firstname: { val: null,
                rules: [
                        v => ( v && v.trim( ).length > 75 ? "Last Name must be within 75 characters" : null ),
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
                console.log( "do the search" )

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
                response = await fetch( `/api/parcel/owner?${jsonToURL( getArgs( ) )}` ), 
                json = ( response.ok ? await response.json( ) : [ ] )

            fields[ field ] = { ...fields[ field ], items:json, spinner: false, nomatch: false }

            if( fields[ field ].items.length === 0 ) nomatch = true

        }

</script>