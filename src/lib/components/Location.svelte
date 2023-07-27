<div class="mb-4 border border-primero bg-luz  rounded shadow-lg">
    <Heading title="Location Information" iconname="location" />
    <InfoTable infos={infos} />

    <!-- Situs Address -->
    <table class="w-full text-left text-primary mb-2">
        <thead class="text-sm font-normal">
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Tax Situs Addresses tied to Parcel
                </th>
            </tr>
        </thead>
        <tbody>
            {#each addrs as addr, i}
                <tr>
                    <td class="px-4 py-2">
                        {i + 1}. {addr}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <LinkList links={links} />

</div>

<script>
	import Heading from "$lib/components/Heading.svelte"
    import LinkList from "$lib/components/LinkList.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    
	// component props
    export let pid = null
    export let gisid = null
    export let x = null
    export let y = null
    export let lat = null
    export let lng = null
    export let address = null
    export let situs = [ ]

    let links = [ ],
        infos = [ ],
        addrs = [ ]

    const setInfo = async ( ) => {
        const urls = [
                //neighborhood code to link to quality of life app
                { url: `/api/overlay/point/gis?x=${x}&y=${y}&table=qol_npa_py&columns=id::int as code`, tag: "qol" },

                //sphere of influence
                { url: `/api/query/gis?table=sphereofinfluence_py&columns=name&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)`, tag: "soi" },

                //historic district
                { url: `/api/query/gis?table=historic_districts_py&columns=objectid&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)`, tag: "hist_dist" },

                //census tract
                { url: `/api/query/gis?table=census_tracts_2020_py&columns=name20 as tract&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)`, tag: "census" },

                //bip opportunity area
                { url: ( gisid ? `/api/overlay/feature/tax?table_from=parcels_py&table_to=commercial_70_buffer_py&columns=commercial_70_buffer_py.objectid&filter=parcels_py.pid='${gisid}'` : null ), tag: "bip" },
            
            ],
            jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
            tags = Object.fromEntries( urls.filter( item => item.url ).map( (item, idx) => { return [ item.tag, idx ] } ) )

        infos = [ 
            { label: "ETJ Area", value: ( jsons[ tags.soi ].length > 0 ? jsons[ tags.soi ][ 0 ].name : "NA" ) },
            { label: "Charlotte Historic District", value: ( jsons[ tags.hist_dist ].length > 0 ? "Yes" : "No" ) },
            { label: "Census Tract No", value: ( jsons[ tags.census ].length > 0 ? jsons[ tags.census ][ 0 ].tract : "NA" ) },
            ...( tags.hasOwnProperty( "bip" ) ? [{ label: "Inside BIP Opportunity Area", value: ( jsons[ tags.bip ].length > 0 ? "Yes" : "No" ) }] : [ ] ),

        ]
        
        links = [ 
            { label: "School Assignment", url: `https://mcmap.org/geoportal/#${lng},${lat}/schools` }, 
            { label: "Voting Location", url: `https://mcmap.org/geoportal/#${lng},${lat}/voting` },
            { label: "Parks Nearby", url: `https://mcmap.org/geoportal/#${lng},${lat}/parks` },
            ...( jsons[ tags.qol ].length > 0 ? [ { label: "Quality of Life Dashboard", url: `https://mcmap.org/qol/#1/${jsons[ tags.qol ].code}` } ] : [ ] ),
            { label: "Demographic Analyzer", url: `http://maps.co.mecklenburg.nc.us/meckdemo/?pid=${pid}` },
            ...( address ? [ { label: "Google Directions", url: `http://maps.google.com/maps?daddr=${address}&saddr=+` } ] : [ ] ),
            { label: "Zoning Designations PDF", url: `https://polaris3g.mecklenburgcountync.gov/data/ZoningDesignations.pdf` }

        ]   

        addrs = situs.map( item => item.situs_address )
                            
    }

    //reactives
    $: if( x && y && pid ){
        setInfo( )
        
    }
    
</script>