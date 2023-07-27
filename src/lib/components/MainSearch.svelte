<div class="relative w-full bg-lienzo border border-suave rounded shadow-lg">
    
        <!-- Hamburger Button -->
        <div class = "absolute z-10 left-[0px] my-1 ml-1">
            <button 
                class="inline-flex items-center justify-center w-10 h-10 text-primero transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz"
                on:click="{(event)=>{dispatch( "leftdrawer", { leftdrawer: !leftdrawer } )}}"
            >
                <calcite-icon icon="hamburger" scale="m" class="w-6 h-6 stroke-primero hover:stroke-segundo"></calcite-icon>
            </button>
        </div>
        <div class = "md:hidden absolute z-1 right-[0px] my-1 mr-1">
            <button class="inline-flex items-center justify-center w-10 h-10 text-primero transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz"
                on:click="{(event)=>{context_menu_open = !context_menu_open;}}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
            <div class="{context_menu_open ? 'absolute' : 'hidden'} right-0 z-1 mt-2 origin-top-right rounded-md bg-lienzo shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <ul class="bg-lienzo shadow-lg rounded-b-md border-t" >
                    {#each content_menu_list as item, i}
                        <li on:click="{()=>handleContextChoice(item.value)}" on:keydown="{()=>handleContextChoice(item.value)}" class="text-todo py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-luz hover:cursor-pointer last:rounded-b-md">
                            <span class="pr-1">{item.text}</span>
                        </li>
                    {/each}
                </ul>
            </div>
            
        </div>
        <!-- Search Row -->
        <AutoComplete placeholder="Enter address / parcel# /owner / landmark" minchar="3" spinner={spinner} go={true} nomatch={nomatch} {items} padding="px-12 py-1 md:pr-1 pr-11"
            on:hit={handleHit} on:brute={handleBrute} on:query={handleQuery} on:open={handleOpen} />
    
     <!-- Navigation Row -->
    {#if !is_open}
        <div class="hidden md:flex flex-row border-t border-suave gap-2 px-2 pt-1">
            <!--<button 
                type="button" 
                class="p-1 text-center inline-flex items-center text-sm font-semibold hover:text-segundo hover:bg-luz hover:rounded-t focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{(event)=>{ goto('/othersearch/owner'); }}"
            >
                {@html icon( "arrowback", 24, 24 )}
            </button>-->

            <button 
                type="button" 
                class="{($page.url.pathname.includes( 'othersearch' )?'text-segundo border-segundo border-b-2':'')} p-2 rounded-t text-center inline-flex items-center text-sm font-semibold hover:text-segundo hover:bg-luz focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{(event)=>{ goto('/othersearch/owner'); }}"
            >
                Other Search
            </button>

            <button 
                type="button"
                class="{($page.url.pathname.includes( 'analysis' )?'text-segundo border-segundo border-b-2':'')} p-2 rounded-t text-center inline-flex items-center text-sm font-semibold hover:text-segundo hover:bg-luz focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{(event)=>{ goto('/analysis'); }}"
            >
                Mrkt Analysis
            </button>

            <button 
                type="button" 
                class="{($page.url.pathname.includes( 'identify' )?'text-segundo border-segundo border-b-2':'')} p-2 rounded-t text-center inline-flex items-center text-sm font-semibold hover:text-segundo hover:bg-luz focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{(event)=>{ propdrawer.set(true); goto('/identify'); }}"
            >
                Identify
            </button>
            
            <button 
                type="button" 
                class="{_results.length > 0?'hover:text-segundo hover:bg-luz':'disabled text-suave cursor-not-allowed'} {_last_results_pg === $page.url.pathname ? 'text-segundo border-segundo border-b-2' : ''} p-2 rounded-t text-center inline-flex items-center text-sm font-semibold focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{(event)=>{ goto(_last_results_pg) }}"
            >
                Results
            </button>
    
            <!--<div class="grow flex justify-end">
                <button 
                    type="button" 
                    class="rounded-md p-2 text-center inline-flex items-center text-primero text-sm font-semibold hover:text-segundo hover:bg-luz focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    on:click="{(event)=>{ jump_to_open = !jump_to_open }}"
                    on:blur="{(event)=>{ ( debounce( e => { jump_to_open = !jump_to_open }, 200 ) )( ) }}"
                >
                    Jump To
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="dropdown" class="{!jump_to_open ? 'hidden' : 'absolute z-20'} mt-10 bg-lienzo border border-primero divide-y divide-gray-100 rounded-b shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-primero dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {#each jump_to_items as item, i}
                              <li 
                                class="{item.selected ? 'hidden' : 'block'} px-4 py-2 hover:bg-luz hover:text-segundo hover:cursor-pointer"
                                  on:click="{()=>jumpTo(item.idx)}" on:keydown="{()=>jumpTo(item.idx)}"
                                
                            >
                                {item.label}
                              </li>
                        {/each}
    
                    </ul>
    
                </div>
                
            </div>-->
        </div>
        
    {/if}

</div>

<script>
    import { getAPIURL } from "$lib/api"
    import { goto } from "$app/navigation"
    import AutoComplete from "$lib/components/AutoComplete.svelte"
    import { last_hit, last_results_pg, results, propdrawer } from '$lib/store'
    import { srchstr2qrystr, icon } from "$lib/utils"
    import { validateCNumber, validateAddress, validateOwnerName, validateNumeric, validateAtleast7, validateIntersection, validateLatLng, validateStatePlane } from "$lib/validate" 
    import { page } from "$app/stores"
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

		],
        _last_results_pg,
        _results

    // constants
    const dispatch = createEventDispatcher( ),
    
        handleHit = event => {
            last_hit.set( event.detail )
            goto( `/${event.detail.type.toLowerCase( )}/${srchstr2qrystr( event.detail.value )}` )

        },

        handleBrute = event => {
            const srch_str = event.detail

            let hit

            if( validateStatePlane( srch_str ) ){
                const xy = srch_str.split( "," ).map( coord => parseFloat( coord.trim( ) ).toFixed( 4 ) )
                
                hit = { value: `${xy[ 0 ]},${xy[ 1 ]}`, type: "XY", x: xy[ 0 ], y: xy[ 1 ] }
		        
            }else if( validateLatLng( srch_str ) ){
                const latlng = srch_str.split( "," ).map( coord => parseFloat( coord.trim( ) ).toFixed( 4 ) )
                
                hit = { value: `${latlng[ 0 ]},${latlng[ 1 ]}`, type: "LATLNG", lat: latlng[ 0 ], lng: latlng[ 1 ] }
		        
            }

            // propogate hit
            if( hit ){
                console.log( hit )
                last_hit.set( hit )
                goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

            }
            
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
                    ...( validateOwnerName( srch_str ) ? [ getAPIURL( "owner", srch_str ) ] : [ ] ),
            
                ]

            // Fetch Results
            spinner = true
            jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
            spinner = false
            nomatch = false
            
            items = [ ].concat( ...jsons )
                        /*.map( elem => { 
                            elem.gisid = elem.gisid || elem.pid 
                            return elem 
                        } )*/

            if( items.length === 0 ) nomatch = true

        },
        
        handleContextChoice = where => {
            context_menu_open = false

        },
		jumpTo = idx => {
			switch( idx ){
				case 0:
					goto( `/othersearch/owner` )
					break

				case 1:
					goto( `/analysis` )
					break

				case 2:
					goto( `/identify` )
					break


			}

			//jump_to_items = jump_to_items.map( item => { return { ...item, selected: ( idx === item.idx ? true : false ) } } )

		},
        debounce = ( fn, time ) => { // add a timeout before a function call
            let timeout
        
            return function( ){
                const functionCall = () => fn.apply( this, arguments )
                clearTimeout( timeout)
                timeout = setTimeout( functionCall, time )
            
            }

        }

    last_results_pg.subscribe( value => { 
        _last_results_pg = value

    } )

    results.subscribe( value => {
        _results = value
    } )

</script>