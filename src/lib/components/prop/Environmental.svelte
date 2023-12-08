<div class="mb-2 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Environmental Information" iconname="flood" />
    {#if infos.length > 0 }
        <InfoTable infos={infos} />
    {/if}
    <LinkList links={links} />

</div>

<script>
    import { onMount } from "svelte"
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
        links = [ ],
        mounted = false

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

        }, handleInfoChange = async ( _pid, _gisid, _x, _y, _lat, _lng, _mounted ) => {
            if( _mounted ){
                const urls = [
                    //water quality buffer
                    { url: ( _gisid ? `/api/overlay/feature/gis/?table_from=parcels_py&table_to=waterquality_buffers_py&columns=waterquality_buffers_py.objectid&filter=parcels_py.pid='${_gisid}'`: null ), tag: "water_qual" },

                    //fema floodplain
                    { url: ( _gisid ? `/api/overlay/feature/gis/?table_from=parcels_py&table_to=fema_floodplain_changes_py&columns=fema_floodplain_changes_py.objectid&filter=parcels_py.pid='${_gisid}'`: null ), tag: "fema_fldp" },

                    //community floodplain
                    { url: ( _gisid ? `/api/overlay/feature/gis/?table_from=parcels_py&table_to=community_floodplain_changes_py&columns=community_floodplain_changes_py.objectid&filter=parcels_py.pid='${_gisid}'`: null ), tag: "comm_fldp" },

                    //fema panel
                    { url: ( _x && _y ? `https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/layers/MapServer/44/query?where=&text=&objectIds=&time=&geometry=${_x},${_y}&geometryType=esriGeometryPoint&inSR=2264&spatialRel=esriSpatialRelIntersects&distance=1&units=esriSRUnit_Foot&relationParam=&outFields=EFF_DATE%2C+panel_id&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`: null ), tag: "fema_panel" },

                    //post construction district
                    { url: ( _x && _y ? `/api/overlay/point/gis/?x=${_x}&y=${_y}&table=PostConst_Districts_py&columns=PostConst_Districts_py.district`: null ), tag: "post_const" },

                    //stream watershed
                    { url: ( _x && _y ? `/api/overlay/point/gis/?x=${_x}&y=${_y}&table=Watershed_Stormwater_py&columns=Watershed_Stormwater_py.name`: null ), tag: "strm_wtrshd" },

                    //drinking water watershed
                    { url: ( _x && _y ? `/api/overlay/point/gis/?x=${_x}&y=${_y}&table=Watershed_DrinkingWater_py&columns=Watershed_DrinkingWater_py.name,Watershed_DrinkingWater_py.subarea`: null ), tag: "drnk_wtrshd" },

                    //jurisdiction
                    { url: ( _x && _y ? `/api/overlay/point/gis/?x=${_x}&y=${_y}&table=Jurisdiction_py&columns=Jurisdiction_py.nme_juris`: null ), tag: "juris" },

                ],
                jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
                tags = Object.fromEntries( urls.filter( item => item.url ).map( ( item, idx ) => { return [ item.tag, idx ] } ) )

                infos = [ 
                    ...( tags?.water_qual ? [{ label: "Inside Water Quality Buffer", value: ( jsons[ tags[ "water_qual" ] ].length > 0 ? "Yes" : "No" ) }] : [ ] ),

                    ...( tags?.fema_fldp ? [ { 
                            label: "Inside FEMA Flood Zone", 
                            value: ( jsons[ tags.fema_fldp ].length > 0 ? `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${_pid}' target='_blank' rel='noreferrer'>Yes</a>` : `No` )
                        } ] : [ ] ), 
                    
                    ...( tags?.comm_fldp ? [ {                 
                            label: "Inside Community Flood Zone", 
                            value: ( jsons[ tags.comm_fldp ].length > 0 ? `<a class="text-signify underline underline-offset-4 hover:text-sky-600" href='http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${_pid}' target='_blank' rel='noreferrer'>Yes</a>` : `No` ) 
                        } ] : [ ] ), 
                    
                    ...( tags?.fema_panel ? [ {                 
                        label: "FEMA Panel No", 
                        value: ( jsons[ tags.fema_panel ].features.length > 0 ? getFEMAPanel( jsons[ tags.fema_panel ].features[ 0 ].attributes ) : `NA` )
                        } ] : [ ] ), 

                    //fema panel date
                    ...( tags?.fema_panel ? [ {                 
                        label: "FEMA Panel Date", 
                        value: getFEMADate( jsons[ tags.fema_panel ].features[ 0 ].attributes ) 
                        } ] : [ ] ),

                    ...( tags?.post_const ? [ {                 
                        label: "Post Construction District", 
                        value: ( jsons[ tags.post_const ].length > 0 ? formatUCWords( jsons[ tags.post_const ][ 0 ].district.toLowerCase( ) ) : `NA` )
                        } ] : [ ] ),
                    
                    ...( tags?.strm_wtrshd ? [ {                 
                        label: "Stream Watershed Name", 
                        value: ( jsons[ tags.strm_wtrshd ].length > 0 ? formatUCWords( jsons[ tags.strm_wtrshd ][ 0 ].name.toLowerCase( ) ) : `NA` )
                        } ] : [ ] ),

                    //drinking watershed name
                    ...( tags?.drnk_wtrshd ? ( jsons[ tags.drnk_wtrshd ].length > 0 ? [ { 
                            label: "Drinking Watershed",
                            value: formatUCWords( jsons[ tags.drnk_wtrshd ][ 0 ].name.toLowerCase( ) ) + " (" + jsons[ tags.drnk_wtrshd ][ 0 ].subarea + ")"
                        } ] : [ ] ) : [ ] ),

                    //pavement restriction
                    ...( tags?.juris ? ( jsons[ tags.juris ].length > 0 ? [ { 
                            label: "Pavement Product Restriction", 
                            value: getPaveInfo( jsons[ tags.juris ][ 0 ].nme_juris )
                        } ] : [ ] ) : [ ] ), 
                                
                ]

                links = [ 
                    { label: "Flood Zone Information", url: `http://meckmap.mecklenburgcountync.gov/3dfz/#taxpid=${_pid}` }, 
                    { label: "Surface Water Improvement and Management (SWIM) Ordinances", url: `http://charmeck.org/stormwater/regulations/Pages/SWIMOrdinances.aspx` },
                    { label: "Post-Construction Storm Water Ordinances", url: `http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx` },
                    { label: "Soil Type Descriptions", url: `https://www.mecknc.gov/LUESA/WaterandLandResources/Conservation/documents/indextomapunits.pdf` },
                    { label: "Check for Address Holds, Occupancy Holds and Expired Permits", url: `https://webpermit.mecklenburgcountync.gov/Default.aspx?PossePresentation=SearchParcelNumber&ParcelNumber=${_pid}` },
                    ...( _lat && _lng ? [ { label: "Geoportal - Environmental Information", url: `https://mcmap.org/geoportal/#${_lng},${_lat}/environment` } ] : [ ] ),

                ]    
            }
            

        }

    onMount( ( ) => { mounted = true } )

    //reactives
    $: { handleInfoChange( pid, gisid, x, y, lat, lng, mounted ) }
        
</script>