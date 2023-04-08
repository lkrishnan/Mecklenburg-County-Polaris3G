<div class="relative w-full bg-surface border border-edge shadow-lg rounded">
    <!-- Hamburger Button -->
    <div class = "absolute z-10 left-[0px] my-1 ml-1">
        <button class="inline-flex items-center justify-center w-10 h-10 text-primary transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-secondary">
            <!--<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>-->
            <calcite-icon icon="hamburger" scale="m" class="w-6 h-6 stroke-primary"></calcite-icon>
        </button>
    </div>
    <div class = "md:hidden absolute z-1 right-[0px] my-1 mr-1">
        <button class="inline-flex items-center justify-center w-10 h-10 text-primary transition-colors duration-150 bg-surface rounded-full focus:shadow-outline hover:bg-secondary"
            on:click="{(event)=>{context_menu_open = !context_menu_open;}}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
        </button>
        <div class="{context_menu_open ? 'absolute' : 'hidden'} right-0 z-1 mt-2 origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <ul class="bg-white shadow-lg rounded-b-md border-t" >
                {#each content_menu_list as item, i}
                    <li on:click="{()=>handleContextChoice(item.value)}" on:keydown="{()=>handleContextChoice(item.value)}" class="text-gray-900 px-2 py-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-gray-100 hover:cursor-pointer last:rounded-b-md">
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
        <div class="hidden md:flex flex-row border-t border-edge">
            <button type="button" class="rounded-bl-md p-2 text-center inline-flex items-center text-primary text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                on:click="{()=>{goto( `/othersearch/owner` )}}">
                Other Search
            </button>


            <button type="button" class="p-2 text-center inline-flex items-center text-primary text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                on:click="{()=>{goto( `/analysis` )}}">
                Market Analysis
            </button>

            <button type="button" class="p-2 text-center inline-flex items-center text-primary text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                Identify
            </button>
            
        </div>
    {/if}

</div>

<script>
    import { goto } from "$app/navigation"
    import AutoComplete from "$lib/Autocomplete.svelte"
    import { getAPIURL } from "$lib/api"
    import { last_hit } from '$lib/store'
    import { srchstr2qrystr } from "$lib/utils"
    import { validateCNumber, validateAddress, validateOwnerName, validateNumeric, validateAtleast7, validateIntersection } from "$lib/validate" 
        	
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

        ]

    // constants
    const handleHit = event => {
            last_hit.set( event.detail )
            goto( `/${event.detail.type.toLowerCase( )}/${srchstr2qrystr( event.detail.value )}` )

        },

        handleBrute = event => {
            console.log( event )
        },

        handleOpen = event => {
            is_open  = event.detail.open

        },

        handleQuery = async event => { // fetch matches
            let jsons

            const srch_str = event.detail.trim( ),
                urls = [
                    //address
                    ...( validateAddress( srch_str ) ? [ getAPIURL( "address", srch_str ) ] : [ ] ),
                    //gisid
                    ...( validateCNumber( srch_str ) ? [ getAPIURL( "gisid", srch_str ) ] : [ ] ),
                    //pid
                    ...( validateAtleast7 ? [ getAPIURL( "pid", srch_str ) ] : [ ] ),
                    //road
                    getAPIURL( "road", srch_str ),
                    //intersection
                    ...( validateIntersection( srch_str ) ? [ getAPIURL( "intersection", srch_str ) ] : [ ] ),
                    //facilities
                    ...( ( validateNumeric( srch_str ) || validateCNumber( srch_str ) ) ? [ ] : [ 
                            getAPIURL( "park", srch_str ),
                            getAPIURL( "library", srch_str ),
                            getAPIURL( "school", srch_str ),
                            getAPIURL( "business", srch_str ),
                            getAPIURL( "busstop", srch_str ),
                            getAPIURL( "lightrail", srch_str ),

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

        }

</script>