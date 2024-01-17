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
            {#each situs as addr, i}
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
    import { onMount } from "svelte"
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
        qol_code = null,
        mounted = false

    const handleInfoChange = async ( _pid, _gisid, _x, _y, _lat, _lng, _address, _situs, _mounted ) => {
        if( _mounted ){
            const urls = [
                    //neighborhood code to link to quality of life app
                    { url: ( _x && _y ? `/api/overlay/point/gis?x=${_x}&y=${_y}&table=qol_npa_py&columns=id::int as code` : null), tag: "qol" },

                    //sphere of influence
                    { url: ( _x && _y ? `/api/query/gis?table=sphereofinfluence_py&columns=name&filter=ST_Within(ST_GeomFromText( 'POINT(${_x} ${_y})', 2264 ) , shape)` : null), tag: "soi" },

                    //charlotte historic district
                    { url: ( _x && _y ? `/api/query/gis?table=historic_districts_py&columns=objectid&filter=ST_Within(ST_GeomFromText( 'POINT(${_x} ${_y})', 2264 ) , shape)` : null), tag: "hist_dist" },
                    
                    //davidson historic district
                    { url: ( _x && _y ? `/api/query/gis?table=davidsonlocalhistoricdistrict_py&columns=objectid&filter=ST_Within(ST_GeomFromText( 'POINT(${_x} ${_y})', 2264 ) , shape)` : null), tag: "dhist_dist" },

                    //census tract
                    { url: ( _x && _y ? `/api/query/gis?table=census_tracts_2020_py&columns=name20 as tract&filter=ST_Within(ST_GeomFromText( 'POINT(${_x} ${_y})', 2264 ) , shape)` : null), tag: "census" },

                    //bip opportunity area
                    { url: ( _gisid ? `/api/overlay/feature/tax?table_from=parcels_py&table_to=commercial_70_buffer_py&columns=commercial_70_buffer_py.objectid&filter=parcels_py.pid='${_gisid}'` : null ), tag: "bip" },
                
                ],
                jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
                tags = Object.fromEntries( urls.filter( item => item.url ).map( (item, idx) => { return [ item.tag, idx ] } ) )

            if( tags.hasOwnProperty( "qol" ) ){
                if( jsons[ tags.qol ].length > 0 )
                    qol_code = jsons[ tags.qol ][ 0 ].code

            }

            infos = [ 
                ...( tags?.soi ? [{ label: "ETJ Area", value: ( jsons[ tags.soi ].length > 0 ? jsons[ tags.soi ][ 0 ].name : "NA" ) }] : [ ] ),
                ...( tags?.hist_dist && tags?.dhist_dist ? [{ label: "Historic District", value: ( jsons[ tags.hist_dist ].length > 0 || jsons[ tags.dhist_dist ].length > 0 ? "Yes" : "No" ) }] : [ ] ),
                ...( tags?.census ? [{ label: "Census Tract No", value: ( jsons[ tags.census ].length > 0 ? jsons[ tags.census ][ 0 ].tract : "NA" ) }] : [ ] ),
                ...( tags?.bip ? [{ label: "Inside BIP Opportunity Area", value: ( jsons[ tags.bip ].length > 0 ? "Yes" : "No" ) }] : [ ] ),

            ]
        
            links = [ 
                ...( _lat && _lng ? [ { label: "School Assignment", url: `https://mcmap.org/geoportal/#${_lng},${_lat}/schools` } ] : [ ] ),
                ...( _lat && _lng ? [ { label: "Voting Location", url: `https://mcmap.org/geoportal/#${_lng},${_lat}/voting` } ] : [ ] ),
                ...( _lat && _lng ? [ { label: "Parks Nearby", url: `https://mcmap.org/geoportal/#${_lng},${_lat}/parks` } ] : [ ] ),
                ...( qol_code ? [ { label: "Quality of Life Dashboard", url: `https://mcmap.org/qol/#1/${qol_code}` } ] : [ ] ),
                { label: "Demographic Analyzer", url: `http://maps.co.mecklenburg.nc.us/meckdemo/?pid=${_pid}` },
                ...( _address ? [ { label: "Google Directions", url: `http://maps.google.com/maps?daddr=${_address}&saddr=+` } ] : [ ] ),
                { label: "Zoning Designations PDF", url: `/pdf/ZoningDesignations.pdf` }

            ]

        }
        
    }

    onMount( ( ) => { mounted = true } )

    //reactives
    $: { handleInfoChange( pid, gisid, x, y, lat, lng, address, situs, mounted ) }
    
</script>