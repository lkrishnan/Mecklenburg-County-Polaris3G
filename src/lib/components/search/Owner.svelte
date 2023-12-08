<div class="relative w-full bg-luz rounded border-primero">
    <div class="md:flex hidden flex-row items-center p-2">
        <div class="grow font-bold text-lg">
            {heading}
        </div>
        <div class="flex">
            <button 
                class="p-1 border border-luz rounded-full group relative transition-colors duration-150 hover:text-segundo"
                on:click="{(event)=>{dispatch( "close", { close: false } )}}"
            >
                {@html icon( "close", 24, 24 )}
            </button>
            
        </div>
        
    </div>

    <form class="px-2 pt-2" on:submit|preventDefault={validate}>
        <div class="flex w-full bg-luz gap-2 pb-2" >
            <div class="grow border bg-lienzo {fields.lastname.error ? 'border-pop' : 'border-todo' } rounded" id="lastname">
                <AutoComplete placeholder="Last Name / Business Name" minchar={fields.lastname.minchar} go={false}
                    bind:spinner={fields.lastname.spinner}  bind:nomatch={fields.lastname.nomatch} 
                    bind:items={fields.lastname.items} bind:str={fields.lastname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => {handleQuery( event, "lastname" ) }}
                    on:open={handleOpen}/>
            </div>
            <div class="w-[46px]" />
                
        </div>

        <p class="{fields.lastname.error ? '' : 'hidden' } mb-2 ml-2 text-pop text-xs italic">{fields.lastname.error}</p>
       
        <div class="flex w-full bg-lienzo gap-2" id="firstname">
            <div class="grow border {fields.firstname.error ? 'border-pop' : 'border-todo' } rounded">
                <AutoComplete placeholder="First Name" minchar={fields.firstname.minchar} go={false} 
                    bind:spinner={fields.firstname.spinner} bind:nomatch={fields.firstname.nomatch} 
                    bind:items={fields.firstname.items} bind:str={fields.firstname.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8"
                    on:query={event => {handleQuery( event, "firstname" ) }}
                    on:open={handleOpen}/>
            </div>
            
            <button
                id="go"
                class="bg-pop border border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
                type="submit">
                Go
            </button>
            
        </div>
        
        <p class="{fields.firstname.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.firstname.error}</p>
        
    </form>

</div>


<script>
    import { createEventDispatcher } from "svelte"
    import { fade, fly } from "svelte/transition"
    import { goto } from "$app/navigation"
    import { validateForm } from "$lib/validate" 
    import { json2URL, srchstr2qrystr, icon } from "$lib/utils"
    import AutoComplete from "$lib/components/AutoComplete.svelte"

    export let heading = ""
        	
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

        },
        is_open = false
        
    const dispatch = createEventDispatcher( ),

        validate = ( event ) => {
            if( event.submitter.id === "go" ){

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
                    
                    goto( `/${type.toLowerCase( )}/${srchstr2qrystr( value ) }` )

                }
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

            fields[ field ] = { ...fields[ field ], items:json, spinner: false, nomatch: false, error: '' }

            if( fields[ field ].items.length === 0 ) 
                fields[ field ].nomatch = true

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