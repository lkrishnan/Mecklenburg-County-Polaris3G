<div class="px-2 pb-2 text-sm">
    <div class="mb-4 border border-primero bg-luz rounded shadow-lg">
        <Heading title="Identify Location" iconname="pushpin" />
        {#if _mobile && _dual }
        <button 
            class="absolute top-0 right-0 mx-3 my-1 p-1.5 fill-lienzo rounded-full group hover:bg-lienzo hover:text-primero hover:fill-primero"
            on:click="{dual.set( !_dual )}"
        >
            {@html icon( "expandless", 24, 24 )}
                
        </button>
    
    {/if}
        <InfoTable infos={infos} />
    </div>
    
    <div class="mb-4 border border-primero bg-luz rounded shadow-lg">
        <Heading title="Layer List" iconname="maplegend" />
        <div class="mb-4 p-2">
            <div class="mb-2">Choose a layer from the dropdown to see field values.</div>
            <div class="bg-lienzo">
                <Selecto on:hit={handle.hit} items={items} selected={selected} />
            </div>
        </div>
    </div>
    
    <div class="border border-primero bg-luz rounded shadow-lg">
        <Heading title="Layer Attributes" iconname="maplegend" />
        <main class="px-2">
            <slot/>
        </main>
        
    </div>
    
</div>

<script>
	/** @type {import('./$types').LayoutData} */
    
    import {goto} from "$app/navigation"
    import {messenger, mobile, dual, title} from "$lib/store"
    import {icon} from "$lib/utils"

    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Selecto from "$lib/components/Selecto.svelte"

    export let data

    //Store Variables
    let _mobile,
        _dual,
        _title

    //Other Variables
    let items= [ 
            { id: "juris", value: "juris", label: "Jurisdictions" },         
            { id: "mat", value: "mat", label: "Master Address Table" },
            { id: "bldg", value: "bldg", label: "Building Footprints" },
            { id: "soi", value: "soi", label: "Sphere of Influence" },
            { id: "boe", value: "boe", label: "Voter Precincts" },
            { id: "zone", value: "zone", label: "Zoning" },
            { id: "zip", value: "zip", label: "Zipcodes" },
            { id: "femafldp", value: "femafldp", label: "FEMA Floodplain" },
            { id: "commufldp", value: "commufldp", label: "Community Floodplain" },
            { id: "postconstdist", value: "postconstdist", label: "Post Construction Districts" },
            { id: "postconstbuf", value: "postconstbuf", label: "Post Construction Buffers" },
            { id: "wtrshd", value: "wtrshd", label: "Stream Watersheds" },
            { id: "wtrshddrnk", value: "wtrshddrnk", label: "Regulated Drinking Watersheds" },
            { id: "wtrqualbuf", value: "wtrqualbuf", label: "Water Quality Buffers" },
            { id: "censustract", value: "censustract", label: "Census Tracts" },
            { id: "censusblock", value: "censusblock", label: "Census Block Groups" },
            { id: "enggrid", value: "enggrid", label: "Engineering Grid" }, 
            { id: "prelimplan", value: "prelimplan", label: "Engineering Preliminary Plans" },
            { id: "monument", value: "monument", label: "NC Geodetic Monuments" },
            { id: "commbldgsinprog", value: "commbldgsinprog", label: "Commercial Bldgs-InProgress(Last 365days)" },
            { id: "commbldgscmplt", value: "commbldgscmplt", label: "Commercial Bldgs-Completed(Last 365days)" },
            { id: "sfbldgsinprog", value: "sfbldgsinprog", label: "Single-Family Bldgs-InProgress(Last 365days)" },
            { id: "sfbldgscmplt", value: "sfbldgscmplt", label: "Single-Family Bldgs-Completed(Last 365days)" },
            { id: "mfbldgsinprog", value: "mfbldgsinprog", label: "Multi-Family Bldgs-InProgress(Last 365days)" },
            { id: "mfbldgscmplt", value: "mfbldgscmplt", label: "Multi-Family Bldgs-Completed(Last 365days)" },
            { id: "mpl", value: "mpl", label: "County MPL Contaminate Sites" },
            { id: "brownfields", value: "brownfields", label: "NCDEQ Brownfields" },
            
        ],
        selected = items.findIndex( item => item.id === data.dataset ),
        infos = [ ]

    const handle = {
            hit: event => {
                messenger.set( [ { type: "id_lyr", layer: event.detail.value } ] )
                goto( `/identify/${data.x},${data.y}/${event.detail.value}` )

            },

            title_change: the_title => {
				title.set( the_title )
				
			}

        }

    dual.subscribe( value => { _dual = value } )
    mobile.subscribe( value => { _mobile = value } )
    
    //reactives
    $: if( data ){
        infos = [ 
            { label: "XY Coord", value: `${data.x}, ${data.y}` },
            { label: "Lat Lon", value: `${data.lat}, ${data.lng}` },
            { label: "USNG", value: data.usng }
            
        ]

        _title = data.title

        messenger.set( [ 
                { type: "clear_all_graphics" }, 
                { type: "add_identify_graphic", x: data.x, y: data.y },
                { type: "id_lyr", layer: data.dataset }

            ] )

        

    }
        
</script>