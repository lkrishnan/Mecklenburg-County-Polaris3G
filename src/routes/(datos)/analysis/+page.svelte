<div class="m-2">
    <!-- tabs -->
    <div class="px-8">
        <div class="flex items-center">
            {#each ufields.parts.items as part,index}
                <div class="flex items-center relative">
                    <button 
                        class="inline-flex items-center justify-center w-16 h-16 transition-colors duration-150 rounded-full border-2 {(ufields.parts.selected===index?'bg-segundo fill-lienzo text-lienzo border-segundo':'hover:bg-luz')} focus:shadow-outline"
                        on:click="{(event)=>{ ufields.parts.selected = index }}"

                    >
                        {@html icon( part.icon, 28, 28 )}
                    </button>

                    <div class="absolute top-0 -ml-8 text-center mt-20 w-32 text-xs font-medium uppercase text-teal-600">{part.title}</div>
                </div>
                {#if index < (ufields.parts.items.length - 1)  }
                    <div class="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
                {/if}

            {/each}
        </div>
    </div>

    <div class="mt-8 p-4">
        <form class="p-2 {(ufields.parts.selected!==0?'hidden':'')}" on:submit|preventDefault={validate}>
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="search_types">
                    Primary Search Type
                </label>
                <Selecto on:hit={handleHit} bind:items={ufields.search_types.items} bind:selected={ufields.search_types.selected} />

            </div>

            <!-- Jurisdictions -->
            {#if ufields.search_types.selected === 0}
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="jurisdictions">
                    Jurisdiction
                </label>
                <Selecto on:hit={handleHit} items={ufields.jurisdictions.items} selected={ufields.jurisdictions.selected} />

            </div>

            <!-- Neighborhood Code -->
            {:else if ufields.search_types.selected === 1}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="street_name">
                        Appraisal Neighborhood Code
                    </label>
                    <div class="w-full bg-lienzo border {vfields.neigh_code.error ? 'border-pop' : 'border-todo' } rounded" id="neigh_code">
                        <AutoComplete placeholder="Required" minchar={vfields.neigh_code.minchar} go={false}
                            bind:spinner={vfields.neigh_code.spinner}  bind:nomatch={vfields.neigh_code.nomatch} 
                            bind:items={vfields.neigh_code.items} bind:str={vfields.neigh_code.val}
                            padding="pl-3 pr-2 py-2" buttonsize="8" 
                            on:query={event => { handleQuery( event, "neigh_code" ) }}
                            on:hit={handleHit}/>
                    </div>
                    <p class="{vfields.neigh_code.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{vfields.neigh_code.error}</p>
                </div>

            <!-- Streetname Code -->
            {:else if ufields.search_types.selected === 2}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="street_name">
                        Street Name
                    </label>
                    <div class="w-full bg-lienzo border {vfields.street_name.error ? 'border-pop' : 'border-todo' } rounded" id="street_name">
                        <AutoComplete placeholder="Required" minchar={vfields.street_name.minchar} go={false}
                            bind:spinner={vfields.street_name.spinner}  bind:nomatch={vfields.street_name.nomatch} 
                            bind:items={vfields.street_name.items} bind:str={vfields.street_name.val}
                            padding="pl-3 pr-2 py-2" buttonsize="8" 
                            on:query={event => { handleQuery( event, "street_name" ) }}
                            on:hit={handleHit}/>
                    </div>
                    <p class="{vfields.street_name.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{vfields.street_name.error}</p>
                </div>

            {:else if ufields.search_types.selected === 3}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="buffer">
                        Buffer Size
                    </label>

                    <input 
                        type="text" 
                        class="border {vfields.buffer.error ? 'border-pop' : 'border-primero' } text-sm rounded block w-full p-2.5" placeholder="Buffer Size (0 - 5280) ft." 
                        bind:value="{vfields.buffer.val}"
                    />
                </div>

            {/if}
            
            <div class="flex justify-end">
                <button class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Next
                </button>
            </div>

        </form>
    </div>
</div>

<script>
    import { onMount} from "svelte"
    import { selection, messenger } from "$lib/store.js"
    import Selecto from "$lib/components/Selecto.svelte"
    import AutoComplete from "$lib/components/search/AutoComplete.svelte"
    import { icon, json2URL } from "$lib/utils"
    import { goto } from "$app/navigation"
    import { page } from "$app/stores"
    import { validateForm, validateNumeric } from "$lib/validate"
    
    let ufields = {
        parts : {
            items: [ 
                { title: "Search Type", icon: "searchtype" },
                { title: "Parcel Info", icon: "information" }, 
                { title: "Building Info", icon: "homenwork" },
                { title: "Sale Info", icon: "money" }, 
            ],
            selected: 0
        },
        search_types: {
            items: [ ],
            selected: 0 

        },
        jurisdictions: {
            items: [
                { value: "Charlotte", municipality: "CHARLOTTE", type: "JURIS" },    
                { value: "Cornelius", municipality: "HUNTERSVILLE", type: "JURIS" },
                { value: "Davidson", municipality: "DAVIDSON", type: "JURIS" },
                { value: "Matthews", municipality: "MATTHEWS", type: "JURIS" },
                { value: "Mint Hill", municipality: "MINT HILL", type: "JURIS" },
                { value: "Pineville", municipality: "PINEVILLE", type: "JURIS" },
                { value: "Stallings", municipality: "STALLINGS", type: "JURIS" },
                { value: "UNINC Mecklenburg Co", municipality: "MECKLENBURG COUNTY-UNINCORPORATED", type: "JURIS" },
            ],
            selected: 0
        },
        
    },
    vfields = {
        street_name: {
            val: null,
            rules: [
                v => ( v && v.trim( ).length > 75 ? "Street Name must be within 75 characters" : null ),
            ], 
            minchar: 2,
            items: [ ],
            nomatch: false,
            spinner: false,
            hit_prop: [ "pid", "gisid" ]

        },

        neigh_code: {
            val: null,
            rules: [
                v => ( v && v.trim( ).length > 3 && v.trim( ).length < 7 ? "Neighborhood code Street must be between 4 to 7 characters" : null ),
            ], 
            minchar: 1,
            items: [ ],
            nomatch: false,
            spinner: false,
            hit_prop: [ "pid", "gisid" ]

        },

        buffer: {
            val: null,
                rules: [
                    v => ( !v ? "Buffer is required" : null ),
                    v => ( validateNumeric( v ) && parseInt( v ) > -1 && parseInt( v ) <= 5280 ? null : "Buffer should be a number between 0 - 5280 ft." ),

                ]
        },

    },
    _selection,
    geom

    onMount( async () => {
        selection.subscribe( async value => { 
            _selection = value
            geom = _selection.geom ?? null
           
            if( geom ){
                ufields.search_types.items = [ 
                    { value: "Jurisdiction" }, 
                    { value: "Appraisal Neighborhood Code" }, 
                    { value: "Street Name" },
                    { value: "Buffer Selected Property" },
                ]

            }else{
                ufields.search_types.items = [ 
                    { value: "Jurisdiction" }, 
                    { value: "Appraisal Neighborhood Code" }, 
                    { value: "Street Name" },
                ]

            }    

            //btns[ 3 ].disabled = ( _selection.pid ? false: true )

        } )
    } )

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

        handleHit = event => {

        },

        handleQuery = async ( event, field ) => { // fetch matches
           // Fetch Results
            vfields[ field ].spinner = true

            const srch_str = event.detail.trim( ),
                getArgs = ( field ) => {
                    const args = {
                        street_name: { name: vfields[ field ].val }, 
                        neigh_code: { neigh_code: vfields[ field ].val },

                    }

                    return args[ field ]

                },
                getAPIURL = ( field ) => {
                    const urls = {
                        street_name: `/api/validate/road`,
                        neigh_code: `/api/validate/neighborhood`,
                    }

                    return urls[ field ]
                    
                },
                response = await fetch( `${getAPIURL( field )}?${json2URL( getArgs( field ) )}` ), 
                json = ( response.ok ? await response.json( ) : [ ] )

                vfields[ field ] = { ...vfields[ field ], items:json, spinner: false, nomatch: false }

            if( vfields[ field ].items.length === 0 ) 
                vfields[ field ].nomatch = true

        }

    

</script>