<div class="mb-2 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Environmental Information" iconname="flood" />
    <InfoTable infos={infos} />
    <LinkList links={links} />

</div>

<script>
    import { formatUCWords } from "$lib/format"
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

    let infos = [ ],
        links = [ ]
        
    const getFEMAPanel = item => {
        let panel_date = new Date( item.eff_date )

        panel_date.setDate( panel_date.getDate( ) + 1 )

        const filename = item.panel_id + panel_date.getFullYear( ) + String( panel_date.getMonth( ) + 1 ).padStart( 2, "0" ) + String( panel_date.getDate() ).padStart( 2, "0" ) + ".pdf" 
        
        return `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='https://mecklenburgcounty.exavault.com/p/stormwater/Floodplain%20Mapping/Effective%20Data/FIRM%20Panels/${filename}' target='_blank' rel='noreferrer'>${item.panel_id}</a>`

    },
    getFEMADate = item => {
        let panel_date = new Date( item.eff_date )
        
        panel_date.setDate( panel_date.getDate( ) + 1 )

        return String( panel_date.getMonth( ) + 1 ).padStart( 2, "0" ) + "/" + String( panel_date.getDate() ).padStart( 2, "0" ) + "/" + panel_date.getFullYear( )

    },
    getPaveInfo = juris => {
        let link

        switch( juris ){
            case "CHAR":
                link = "https://www.charlottenc.gov/files/sharedassets/city/services/stormwater/documents/regulations/1charlotte-stormwater-pollution-control-ordinance-final-adopted-05-26-2020.pdf"
                break
            
            case "MATT":
                link = "https://www.charlottenc.gov/files/sharedassets/city/services/stormwater/documents/regulations/chapter-52a-surface-water-pollution-control.pdf"
						break
					
			case "CORN": case "HUNT": case "MINT": case "PINE": case "MECK":
				link = "https://www.charlottenc.gov/files/sharedassets/city/services/stormwater/documents/regulations/meck-co-swpco-final-sealed-version.pdf"
				break
						
			case "DAVI":
				link = "https://library.municode.com/nc/davidson/codes/code_of_ordinances?nodeId=COOR_CH30EN_ARTVISUWAPOCO"
				break

        }

        return ( link ? `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='${link}' target='_blank' rel='noreferrer'>Yes</a>` : 'No' )

    },
    setInfo = async ( ) => {
        const urls = [
            //water quality buffer
            { url: `/api/overlay/feature/gis/?table_from=parcels_py&table_to=waterquality_buffers_py&columns=waterquality_buffers_py.objectid&filter=parcels_py.pid='${gisid}'`, tag: "water_qual" },

            //fema floodplain
            { url: `/api/overlay/feature/gis/?table_from=parcels_py&table_to=fema_floodplain_changes_py&columns=fema_floodplain_changes_py.objectid&filter=parcels_py.pid='${gisid}'`, tag: "fema_fldp" },

            //community floodplain
            { url: `/api/overlay/feature/gis/?table_from=parcels_py&table_to=community_floodplain_changes_py&columns=community_floodplain_changes_py.objectid&filter=parcels_py.pid='${gisid}'`, tag: "comm_fldp" },

            //fema panel
            { url: `https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/layers/MapServer/44/query?where=&text=&objectIds=&time=&geometry=${x},${y}&geometryType=esriGeometryPoint&inSR=2264&spatialRel=esriSpatialRelIntersects&distance=1&units=esriSRUnit_Foot&relationParam=&outFields=EFF_DATE%2C+panel_id&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`, tag: "fema_panel" },

            //post construction district
            { url: `/api/overlay/point/gis/?x=${x}&y=${y}&table=PostConst_Districts_py&columns=PostConst_Districts_py.district`, tag: "post_const" },

            //stream watershed
            { url: `/api/overlay/point/gis/?x=${x}&y=${y}&table=Watershed_Stormwater_py&columns=Watershed_Stormwater_py.name`, tag: "strm_wtrshd" },

            //drinking water watershed
            { url: `/api/overlay/point/gis/?x=${x}&y=${y}&table=Watershed_DrinkingWater_py&columns=Watershed_DrinkingWater_py.name,Watershed_DrinkingWater_py.subarea`, tag: "drnk_wtrshd" },

            //jurisdiction
            { url: `/api/overlay/point/gis/?x=${x}&y=${y}&table=Jurisdiction_py&columns=Jurisdiction_py.nme_juris`, tag: "juris" },

        ],
        jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
        tags = Object.fromEntries( urls.filter( item => item.url ).map( (item, idx) => { return [ item.tag, idx ] } ) )

        infos = [ 
            { label: "Inside Water Quality Buffer", value: ( jsons[ tags[ "water_qual" ] ].length > 0 ? "Yes" : "No" ) },
            { 
                label: "Inside FEMA Flood Zone", 
                value: ( jsons[ tags.fema_fldp ].length > 0 ? `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${pid}' target='_blank' rel='noreferrer'>Yes</a>` : `No` )

            }, { 
                label: "Inside Community Flood Zone", 
                value: ( jsons[ tags.comm_fldp ].length > 0 ? `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${pid}' target='_blank' rel='noreferrer'>Yes</a>` : `No` ) 
            
            }, {
                label: "FEMA Panel No", 
                value: ( jsons[ tags.fema_panel ].features.length > 0 ? getFEMAPanel( jsons[ tags.fema_panel ].features[ 0 ].attributes ) : `NA` )
            },

            //fema panel date
            ...( jsons[ tags.fema_panel ].features.length > 0 ? [ { label: "FEMA Panel Date", value: getFEMADate( jsons[ tags.fema_panel ].features[ 0 ].attributes ) } ] : [ ] ),

            {
                label: "Post Construction District", 
                value: ( jsons[ tags.post_const ].length > 0 ? formatUCWords( jsons[ tags.post_const ][ 0 ].district.toLowerCase( ) ) : `NA` )

            }, {
                label: "Stream Watershed Name", 
                value: ( jsons[ tags.strm_wtrshd ].length > 0 ? formatUCWords( jsons[ tags.strm_wtrshd ][ 0 ].name.toLowerCase( ) ) : `NA` )

            },

            //drinking watershed name
            ...( jsons[ tags.drnk_wtrshd ].length > 0 ? [ { label: "Drinking Watershed", value: formatUCWords( jsons[ tags.drnk_wtrshd ][ 0 ].name.toLowerCase( ) ) + " (" + jsons[ tags.drnk_wtrshd ][ 0 ].subarea + ")" } ] : [ ] ),

            //pavement restriction
            ...( jsons[ tags.juris ].length > 0 ? [ { label: "Pavement Product Restriction", value: getPaveInfo( jsons[ tags.juris ][ 0 ].nme_juris ) } ] : [ ] ),

        ]

        links = [ 
            { label: "Flood Zone Information", url: `http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${pid}` }, 
            { label: "Surface Water Improvement and Management (SWIM) Ordinances", url: `http://charmeck.org/stormwater/regulations/Pages/SWIMOrdinances.aspx` },
            { label: "Post-Construction Storm Water Ordinances", url: `http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx` },
            { label: "Soil Type Descriptions", url: `https://www.mecknc.gov/LUESA/WaterandLandResources/Conservation/documents/indextomapunits.pdf` },
            { label: "Check for Address Holds, Occupancy Holds and Expired Permits", url: `https://webpermit.mecklenburgcountync.gov/Default.aspx?PossePresentation=SearchParcelNumber&ParcelNumber=${pid}` },
            { label: "Geoportal - Environmental Information", url: `https://mcmap.org/geoportal/#${lng},${lat}/environment` }

        ]   
                 
    }

    //reactives
    $: if( x && y ){
        setInfo( )
        
    }

</script>