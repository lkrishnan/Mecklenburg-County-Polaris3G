<div class="relative w-full bg-lienzo border-2 rounded border-primero">
    <!-- Left Buttons -->
    <div class = "absolute z-10 left-[0px] my-1 ml-1">
        {#if _results_count > 1 && _results_index > -1 }
            <button 
                class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full text-pop hover:text-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{results_index.set( -1 )}}"
            >
                {@html icon( "arrowback", 28, 28 )}
            </button>

        {:else if _mobile && !_dual }
            <button 
                class="inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{dual.set( !_dual )}}"
            >
                {@html icon( "expandmore", 28, 28 )}
            </button>

        {:else if _mobile }
            <button 
                class="md:hidden inline-flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full fill-primero hover:fill-segundo hover:bg-luz focus:shadow-outline"
                on:click="{(event)=>{dispatch( "leftdrawer", { leftdrawer: !leftdrawer } )}}"
            >
                {@html icon( "hamburger", 28, 28 )}
            </button>
        
        {:else}
            <div class="hidden md:inline-flex items-center justify-center w-10 h-10">
                {@html icon( "search", 28, 28 )}
            </div>
        
        {/if}
        
    </div>
    
    <!-- Search Row -->
    <AutoComplete 
        placeholder="Enter address / parcel# /owner / landmark" 
        {minchar} {spinner} go={false} {nomatch} {items} {hide_items} {value} {is_open}
        padding="px-12 py-1 pr-1"
        on:hit={handle.hit} on:brute={handle.brute} on:query={handle.query} on:open={handle.open} 
        
    />
    
</div>

<script>
    import {getAPIURL} from "$lib/api"
    import {goto} from "$app/navigation"
    import {mobile, results_count, results_index, dual} from "$lib/store"
    import {srchstr2qrystr, icon} from "$lib/utils"
    import {formatStatePlane, formatLatLng} from "$lib/format"
    import {validateCNumber, validateAddress, validateOwnerName, validateTaxPIDMin7, validateIntersection, validateLatLng, validateStatePlane, validateTaxPID, validateName, validateRoad} from "$lib/validate" 
    import {createEventDispatcher} from "svelte"
	
	import AutoComplete from "$lib/components/AutoComplete.svelte"
    	
    export let leftdrawer = false
    export let hide_items = false
    export let value = ""
    export let is_open = false
        	
    //Store Variables
    let _mobile,
        _results_count,
		_results_index,
        _dual

    //Other Variables
    let items = [ ],
        nomatch = false,
        spinner = false
        
    // Constants
    const dispatch = createEventDispatcher( ),
        minchar = 3,
    
        handle = {
            hit: event => {
                dispatch( "reset", { msg: "" } )
                goto( `/${event.detail.type.toLowerCase( )}/${srchstr2qrystr( event.detail.srch_key.toString( ) )}` )

            },

            brute: event => {
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
                if( hit ){
                    dispatch( "reset", { msg: "" } )
                    goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.srch_key ) }` )

                }else
                    dispatch( "error", { msg: "Enter a Valid Search String!" } )
                    
            },

            open: event => {
                is_open  = event.detail.open    

            },

            query: async event => { // fetch matches
                let jsons

                const srch_str = event.detail.trim( )

                if( srch_str.length >= minchar ){
                    const urls = [
                            //address
                            ...( validateAddress( srch_str ) ? [ `/api/validate/address?addr=${srch_str}` ] : [ ] ),

                            //pid
                            ...( validateTaxPIDMin7( srch_str ) ? [ `/api/validate/pid?pid=${srch_str}` ] : [ ] ),

                            //gisid
                            ...( validateCNumber( srch_str ) ? [ `/api/validate/gisid?gisid=${srch_str}` ] : [ ] ),
                            
                            //road
                            ...( validateRoad( srch_str ) ?[ getAPIURL( "road", srch_str ) ] : [ ] ),

                            //intersection
                            ...( validateIntersection( srch_str ) ? [ getAPIURL( "intersection", srch_str ) ] : [ ] ),

                            //owner name - fullname
                            ...( validateOwnerName( srch_str ) ? [ getAPIURL( "owner", srch_str ) + "&exact=0" ] : [ ] ),

                            ...( validateName( srch_str ) ?[ 
                                    getAPIURL( "ownerlast", srch_str ) + "&exact=0", //owner name - last
                                    getAPIURL( "park", srch_str ), //park
                                    getAPIURL( "school", srch_str ), //school
                                    getAPIURL( "library", srch_str ), //library
                                    getAPIURL( "business", srch_str ), //busstop
                                    getAPIURL( "lightrail", srch_str ), //lightrail
                                    getAPIURL( "busstop", srch_str ), //busstop
                                    
                                ] : [ ] ),
                            
                        ]

                    // Fetch Results
                    spinner = true
                    jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
                    items = [ ].concat( ...jsons )

                }else
                    items.length = 0

                nomatch = ( items.length === 0 )

                if( _mobile )
                    dispatch( "items", { items: items, srch_str: srch_str, nomatch: nomatch } )

                spinner = false
                
            }
            
        }

    //Subscriptions
    dual.subscribe( value => { _dual = value } )
    mobile.subscribe( value => { _mobile = value } )
    results_count.subscribe( value => { _results_count = value } )
    results_index.subscribe( value => { _results_index = value } )

    //Reactives
    $:dispatch( "open", { open: is_open } )


</script>