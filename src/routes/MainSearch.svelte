<div class="md:w-[430px] w-full box-border bg-white border border-gray-300 shadow-lg rounded">
    <!-- Hamburger Button -->
    <div class = "absolute z-10 left-[0px] my-1 ml-3">
        <button class="inline-flex items-center justify-center w-10 h-10 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
    </div>
    
    <!-- Search Row -->
    <AutoComplete placeholder="Enter address / parcel# /owner / landmark" minchar="5" spinner={spinner} nomatch={nomatch} {items} padding="px-12 py-1 pr-1"
                on:hit={handleHit} on:query={handleQuery} on:open={handleOpen} />
   
    <!-- Navigation Row -->
    {#if !is_open}
        <div class="hidden md:flex flex-row border-t border-grey-300">
            <button type="button" class="rounded-bl-md text-gray-900 font-bold text-sm p-2 text-center inline-flex items-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:hover:bg-gray-700 dark:focus:ring-gray-600" >
                Other Search
            </button>

            <button type="button" class="text-gray-900 font-bold text-sm p-2 text-center inline-flex items-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                Market Analysis
            </button>

            <button type="button" class="text-gray-900 font-bold text-sm p-2 text-center inline-flex items-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                Identify
            </button>

        </div>
    {/if}

    
    
</div>



    

<script>
    import AutoComplete from "./Autocomplete.svelte"
    import jsonToURL from "./jsontourl";

    let items = [ ],
        nomatch = false,
        spinner = false,
        is_open = false

    function handleHit( event ){
        console.log( event )

    }

    function handleOpen( event ){
        is_open  = event.detail.open

    }

    // Fetch Suggestions
    async function handleQuery( event ){
        const srch_str = event.detail.trim( ),
            urls = [ ]
            
        // Address Query
        const address_args = {
                columns: "full_address as value, 'ADDRESS' as type, groundpid, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address",
                limit: 8,
                filter: `ts @@ to_tsquery('addressing_en', '${srch_str.toUpperCase().replace(/ /g, '&') + ':*'}') and cde_status='A' and the_geom is not null`
            }
        urls.push( `https://api.mcmap.org/v1/query/master_address_table?${jsonToURL( address_args )}` )


        // Fetch Results
        spinner = true
        Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
            .then( jsons => {
                spinner = false
                nomatch = false
                items = [ ].concat( ...jsons )
                            .map( elem => { 
                                elem.groundpid = elem.groundpid || elem.pid 
                                return elem 
                            } )

                if( items.length === 0 ) nomatch = true
  
            } )

    }


</script>