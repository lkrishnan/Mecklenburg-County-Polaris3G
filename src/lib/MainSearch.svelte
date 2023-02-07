<div class="relative w-full bg-surface border border-edge shadow-lg rounded">
    <!-- Hamburger Button -->
    <div class = "absolute z-10 left-[0px] my-1 ml-1">
        <button class="inline-flex items-center justify-center w-10 h-10 text-primary transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
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
    <AutoComplete placeholder="Enter address / parcel# /owner / landmark" minchar="5" spinner={spinner} nomatch={nomatch} {items} padding="px-12 py-1 md:pr-1 pr-11"
        on:hit={handleHit} on:query={handleQuery} on:open={handleOpen} />

     <!-- Navigation Row -->
    {#if !is_open}
        <div class="hidden md:flex flex-row border-t border-edge">
            <button type="button" class="rounded-bl-md p-2 text-center inline-flex items-center text-primary text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                on:click="{()=>{goto( `/othersearch` )}}">
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
    import AutoComplete from "$lib/Autocomplete.svelte"
    import jsonToURL from "$lib/jsontourl"
    import { validateGISID } from "$lib/validateStrings" 
    import { goto } from "$app/navigation"
    import { last_hit } from '$lib/store.js'

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
            goto( `/${event.detail.type.toLowerCase( )}/${event.detail.value.replace(/\s/g, "+").toLowerCase( )}` )

        },

        handleOpen = event => {
            is_open  = event.detail.open

        },

        handleQuery = async event => { // fetch matches
            let jsons

            const srch_str = event.detail.trim( ),
                urls = [ ]
                
            // Address Query
            const address_args = {
                    columns: "full_address as value, 'ADDRESS' as type, objectid as matid, groundpid as gisid, round(ST_X(the_geom)::NUMERIC,4) as x, round(ST_Y(the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address",
                    limit: 8,
                    filter: `ts @@ to_tsquery('addressing_en', '${srch_str.toUpperCase().replace(/ /g, '&') + ':*'}')
                                and txt_cdeuse not in ('METER', 'VALUE-IMPR', 'MINING', 'SIGN', 'MASTER ADDRESS', 'BRIDGE', 'CATV', 'PHONE', 'UTILITY', 'SAW SERVICE', 'BUS STOP', 'CELL TOWER', 'UNKNOWN', 'OTHER MUNICIPAL', 'FOREST-PARK', 'OCS POLE', 'GREENWAY ENTRANCE', 'DUMPSTER' )
                                and the_geom is not null`
                }
            urls.push( `https://api.mcmap.org/v1/query/master_address_table?${jsonToURL( address_args )}` )

            // GISID Query
            console.log( validateGISID( srch_str ) )
            if( validateGISID( srch_str ) ){
                const gisid_args = {
                    columns: `pid as value, 'GISID' as type, pid as gisid`,
                    limit: 5,
                    filter: `pid ~* '${srch_str}' and the_geom is not null`,
                    group: `pid`
                
                }
                urls.push( `https://api.mcmap.org/v1/query/tax_parcels?${jsonToURL( gisid_args )}` )
            
            }

            // Park Query
            const park_args = {
                columns: `prkname as value, 'PARK' as type, round(ST_X(p.the_geom)::NUMERIC,4) as x, round(ST_Y(p.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lat, t.pid as gisid, prkaddr as address`,
                limit: 5,
                filter: `prkname ilike '%${srch_str}%' and p.the_geom && t.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/parks p, tax_parcels t?${jsonToURL( park_args )}` )

            // Library Query
            const library_args = {
                columns: `name as value, 'LIBRARY' as type, round(ST_X(l.the_geom)::NUMERIC,4) as x, round(ST_X(l.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, address`,
                limit: 5,
                filter: `name ilike '%${srch_str}%' and l.the_geom && p.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/libraries l, tax_parcels p?${jsonToURL( library_args )}` )

            // Public Schools Query
            const public_schools_args = {
                columns: `s.schlname as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' ||s.city as address, s.type as desc`,
                limit: 5,
                filter: `s.schlname ilike '%${srch_str}%' and s.the_geom && p.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/schools s, tax_parcels p?${jsonToURL( public_schools_args )}` )

            // Charter Schools Query
            const charter_schools_args = {
                columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                limit: 5,

                filter: `s.school ilike '%${srch_str}%' and s.the_geom && p.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/charter_schools s, tax_parcels p?${jsonToURL( charter_schools_args )}` )

            // Private Schools Query
            const private_schools_args = {
                columns: `s.school as value, 'SCHOOL' as type, round(ST_X(s.the_geom)::NUMERIC,4) as x, round(ST_X(s.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(s.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, s.address || ' ' || s.city || ' NC ' || zip as address`,
                limit: 5,
                filter: `s.school ilike '%${srch_str}%' and s.the_geom && p.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/schools_private s, tax_parcels p?${jsonToURL( private_schools_args )}` )

            // Business Query
            const business_args = {
                columns: `b.company as value, 'BUSINESS' as type, round(ST_X(b.the_geom)::NUMERIC,4) as x, round(ST_X(b.the_geom)::NUMERIC,4) as y, round(ST_X(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(b.the_geom, 4326))::NUMERIC,4) as lat, p.pid as gisid, b.address || ' ' || b.city || ' ' || b.state || ' ' || b.zip as address`,
                limit: 5,
                filter: `b.company ilike '%${srch_str}%' and b.the_geom && p.the_geom`
            }
            urls.push( `https://api.mcmap.org/v1/query/businesswise_businesses b, tax_parcels p?${jsonToURL( business_args )}` )

            // Fetch Results
            spinner = true
            jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
            spinner = false
            nomatch = false
            items = [ ].concat( ...jsons )
                        .map( elem => { 
                            elem.gisid = elem.gisid || elem.pid 
                            return elem 
                        } )

            if( items.length === 0 ) nomatch = true

        },
        
        handleContextChoice = where => {
            console.log( where )
            context_menu_open = false

        }

</script>