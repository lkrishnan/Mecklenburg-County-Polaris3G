<div class="relative w-full bg-lienzo border-2 rounded border-primero">
    <!-- Hamburger Button -->
    <div class = "md:hidden absolute z-10 left-[0px] my-1 ml-1">
        <button 
            class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
            on:click="{(event)=>{dispatch( "leftdrawer", { leftdrawer: !leftdrawer } )}}"
        >
            {@html icon( "hamburger", 28, 28 )}
        </button>
    </div>
    <div class = "md:hidden absolute z-1 right-[0px] my-1 mr-1">
        <button 
            class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
            on:click="{(event)=>{context_menu_open = !context_menu_open;}}"
        >
            {@html icon( "morevert", 28, 28 )}
        </button>

        <div class="{context_menu_open ? 'absolute' : 'hidden'} right-0 z-1 mt-2 origin-top-right rounded-md bg-lienzo shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <ul class="bg-lienzo shadow-lg rounded-b-md border-t" >
                {#each content_menu_list as item, i}
                    <li>
                        <div 
                            on:click="{()=>handleContextChoice(item.value)}" 
                            on:keydown="{()=>handleContextChoice(item.value)}" 
                            role="button"
                            tabindex="-1"
                            class="text-todo py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer last:rounded-b-md">
                            <span class="pr-1">{item.text}</span>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        
    </div>

    <!-- Search Row -->
    <AutoComplete 
        placeholder="Enter address / parcel# /owner / landmark" 
        minchar="3" spinner={spinner} go={true} nomatch={nomatch} {items} 
        padding="md:px-2 px-12 py-1 md:pr-1 pr-11"
        on:hit={handleHit} on:brute={handleBrute} on:query={handleQuery} on:open={handleOpen} 
        
    />
    
</div>

<script>
    import { getAPIURL } from "$lib/api"
    import { goto } from "$app/navigation"
    import AutoComplete from "$lib/components/AutoComplete.svelte"
    import { srchstr2qrystr, icon } from "$lib/utils"
    import { formatStatePlane, formatLatLng } from "$lib/format"
    import { validateCNumber, validateAddress, validateOwnerName, validateNumeric, validateAtleast7, validateIntersection, validateLatLng, validateStatePlane, validateTaxPID } from "$lib/validate" 
    import { createEventDispatcher } from "svelte"
    	
    export let leftdrawer = leftdrawer

        	
    // variables
    let items = [ ],
        nomatch = false,
        spinner = false,
        is_open = false,
        context_menu_open = false,
        content_menu_list = [ 
            { text: "Other Search", value: "other_search" },
            { text: "Market Analysis", value: "market_analysis" },
            { text: "Identify", value: "identify" }

        ],
        jump_to_open = false,
		jump_to_items = [
			{ idx: 0, label: "Other Search", selected: false },
			{ idx: 1, label: "Market Analysis", selected: false },
			{ idx: 2, label: "Identify", selected: false },

		]

    // constants
    const dispatch = createEventDispatcher( ),
    
        handleHit = event => {
            goto( `/${event.detail.type.toLowerCase( )}/${srchstr2qrystr( event.detail.srch_key.toString( ) )}` )

        },

        handleBrute = event => {
            const srch_str = event.detail

            let hit

            if( validateTaxPID( srch_str ) )
                hit = { type: "PID", srch_key: srch_str }
            
            else if( validateCNumber( srch_str ) )
                hit = { type: "GISID", srch_key: srch_str }
            
            else if( validateStatePlane( srch_str ) ){
                const xy = formatStatePlane( srch_str.split( "," ).map( coord => parseFloat( coord.trim( ) ).toFixed( 4 ) ) )
                hit = { type: "XY", srch_key: xy }
		        
            }else if( validateLatLng( srch_str ) ){
                const latlng = formatLatLng( srch_str.split( "," ).map( coord => parseFloat( coord.trim( ) ).toFixed( 4 ) ) )
                hit = { type: "LATLNG", srch_key: latlng }
		        
            }

            //standardized address search needs to be added

            // propogate hit
            if( hit )
                goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.srch_key ) }` )
            
        },

        handleOpen = event => {
            is_open  = event.detail.open

        },

        handleQuery = async event => { // fetch matches
            let jsons

            const srch_str = event.detail.trim( ),
                urls = [
                    //address
                    ...( validateAddress( srch_str ) ? [ `/api/validate/address?addr=${srch_str}` ] : [ ] ),
                    //gisid
                    ...( validateCNumber( srch_str ) ? [ `/api/validate/gisid?gisid=${srch_str}` ] : [ ] ),
                    //pid
                    ...( validateAtleast7 ? [ `/api/validate/pid?pid=${srch_str}` ] : [ ] ),
                    //road
                    `/api/validate/road?name=${srch_str}`,
                    //intersection
                    ...( validateIntersection( srch_str ) ? [ getAPIURL( "intersection", srch_str ) ] : [ ] ),
                    //facilities
                    ...( ( validateNumeric( srch_str ) || validateCNumber( srch_str ) ) ? [ ] : [ 
                        `/api/validate/facility/park?name=${srch_str}`,
                            `/api/validate/facility/library?name=${srch_str}`,
                            `/api/validate/facility/school?name=${srch_str}`,
                            `/api/validate/facility/business?name=${srch_str}`,
                            `/api/validate/facility/busstop?name=${srch_str}`,
                            `/api/validate/facility/lightrail?name=${srch_str}`,

                        ] ),
                    //owner name - fullname
                    ...( validateOwnerName( srch_str ) ? [ getAPIURL( "owner", srch_str ) + "&exact=0" ] : [ ] ),
            
                ]

            // Fetch Results
            spinner = true
            jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
            spinner = false
            nomatch = false
            items = [ ].concat( ...jsons )
                        
            if( items.length === 0 ) nomatch = true

        },
        
        handleContextChoice = where => {
            context_menu_open = false

        }

    $: if( is_open ){
        dispatch( "open", { open: true } )

    }else{
        dispatch( "open", { open: false } )

    }

</script>