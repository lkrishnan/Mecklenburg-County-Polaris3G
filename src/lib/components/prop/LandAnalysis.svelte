<div class="mb-4 border border-primero bg-luz  rounded shadow-lg">
    <Heading title="Land Analysis" iconname="piechart" />
    
    <div class="p-2 flex flex-col max-w-md">
        <Selecto on:hit={handleHit} items={items} selected={selected} />
        <div class="pt-2">
            {#if datasets.length > 0 }
                <PieChart labels={labels} datasets={datasets} />

            {:else}
                <div class="flex items-center gap-2 text-pop text-lg">
                    {@html icon( "alert", 48, 48 )}
                    <h1>Unavailable</h1>
                </div>

            {/if}

        </div>
                        
    </div>
    
</div>

<script>
    import {onMount} from "svelte"
    import {formatPercentage} from "$lib/format"
    import {icon} from "$lib/utils"
    import Heading from "$lib/components/Heading.svelte"
    import PieChart from "$lib/components/PieChart.svelte"
    import Selecto from "$lib/components/Selecto.svelte"
	
    // component props
    export let gisid = null
    export let sqft = null

    let items= [ 
            { 
                value: "juris", 
                label: "Jurisdiction",
                getURLs: gisid => [ 
                    `/api/query/gis?table=parcels_py as s,jurisdiction_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'` 
                
                ],
                 
            }, { 
                value: "utilrow", 
                label: "Utility Right of Way",
                getURLs: gisid => [ 
                    `/api/query/tax?table=parcels_py as s,utility_rightofway_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.utility_name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'` 
                
                ],
                
            }, { 
                value: "railrow", 
                label: "Railroad Right of Way",
                getURLs: gisid => [ 
                    `/api/query/tax?table=parcels_py as s,railroad_rightofway_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.rr_name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'` 
                
                ], 
            
            }, { 
                value: "fldp", 
                label: "FEMA Floodplain",
                getURLs: gisid => [ 
                    `/api/query/gis?table=parcels_py as s,fema_floodplain_changes_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.fld_zone as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'` 
                
                ], 


            }, { 
                value: "postconst", 
                label: "Post Construction Buffers",
                getURLs: gisid => [ 
                    `/api/query/gis?table=parcels_py as s,WaterQuality_Buffers_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.legend as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}' AND t.legend in('30 ft PC','35 ft PC','50 ft PC','100 ft PC','50 ft PC Undisturbed','100 ft PC Undisturbed','200 ft PC Undisturbed')` 
                
                ],  
                
            }, { 
                value: "swim", 
                label: "SWIM Buffers",
                getURLs: gisid => [ 
                    `/api/query/gis?table=parcels_py as s,WaterQuality_Buffers_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.legend as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}' AND t.legend in('100 ft SW','100 ft WS','35 ft SW','40 ft WS','50 ft SW','50 ft WS','30 ft PIPED','35 ft PIPED','100 ft PIPED')` 
                
                ],   
            
            }, { 
                value: "zoning", 
                label: "Zoning",
                getURLs: gisid => [ 
                    `/api/query/gis?table=parcels_py as s,zoning_cityofcharlotte_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.zonedes as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`,
                    `/api/query/tax?table=parcels_py as s,county_towns_zoning_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.zone_des as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'` 

                ],   
            
            },
            
        ],
        selected = 0,
        labels = [ ],
        datasets = [ ],
        mounted = false

    const magic_sqft = 440,
        juris_color = {
            "Charlotte": "#ffffff", 
            "Cornelius": "#ffff94", 
            "Davidson": "#ffd37f",
            "Huntersville": "#74d6d6",
            "Matthews": "#e8d9ff",
            "Mecklenburg": "#f0cf6e",
            "Mint Hill": "#ffc9d1",
            "Pineville": "#e67750",
            "Stallings": "#d6b4cc",

        },
        zoning_color = [ "#ECC713", "#BF28D7", "#1C8EE3", "#72C738", "#3F1AE5" ],
    
    handleHit = event => {
        selected = items.findIndex( item => item.value === event.detail.value )
                      
    },

    getInfo = ( _rows, _sqft, _intersect_sqft, type ) => {
        switch( type ){
            case "juris":
                return {
                    values: [ 
                        ..._rows.map( row => row.sqft ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ _sqft - _intersect_sqft ] : [ ] ) 
            
                    ],
                    labels: [ 
                        ..._rows.map( row => `${row.label} (${formatPercentage( row.sqft, sqft )})` ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= 5 ? [ `Other (${formatPercentage( _sqft - _intersect_sqft, sqft )})` ] : [ ] ) 
            
                    ],
                    background: [
                        ..._rows.map( row => juris_color[ row.label ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "#f0e3af" ] : [ ] ) 

                    ],
                    border: [
                        ..._rows.map( row => "#9ca3af" ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "#9ca3af" ] : [ ] ) 

                    ]

                }

            case "zoning":
                return {
                    values: [ 
                        ..._rows.map( row => row.sqft ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ _sqft - _intersect_sqft ] : [ ] ) 
            
                    ],
                    labels: [ 
                        ..._rows.map( row => `${row.label} (${formatPercentage( row.sqft, sqft )})` ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= 5 ? [ `Unknown (${formatPercentage( _sqft - _intersect_sqft, sqft )})` ] : [ ] ) 
            
                    ],
                    background: [
                        ..._rows.map( ( row, i ) => zoning_color[ i ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "#cbd5e1" ] : [ ] ) 

                    ],
                    border: [
                        ..._rows.map( row => "White" ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "White" ] : [ ] ) 

                    ]

                }

            default:
                return {
                    values: [ 
                        ...( _intersect_sqft >= magic_sqft ? [ _intersect_sqft ] : [ ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ _sqft - _intersect_sqft ] : [ ] ) 
                    
                    ],
                    labels: [ 
                        ...( _intersect_sqft >= magic_sqft ? [ `Inside (${formatPercentage( _intersect_sqft, sqft )})` ] : [ ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ `Outside (${formatPercentage( _sqft - _intersect_sqft, sqft )})` ] : [ ] ) 
                
                    ],
                    background: [
                        ...( _intersect_sqft >= magic_sqft ? [ "Red" ] : [ ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "Green" ] : [ ] ) 

                    ],
                    border: [
                        ...( _intersect_sqft >= magic_sqft ? [ "White" ] : [ ] ), 
                        ...( parseInt( Math.abs( _sqft - _intersect_sqft ) ) >= magic_sqft ? [ "White" ] : [ ] ) 
                    ],

                }

        }

    },
    
    handleInfoChange = async ( _gisid, _sqft, _selected, _mounted ) => {
        if( _mounted ){
            const urls = items[ _selected ].getURLs( gisid ),
                jsons = await Promise.all( urls.map( item => fetch( item ).then( resp => resp.json( ) ) ) ),
                rows = jsons.flat( ),
                intersect_sqft = rows.reduce( ( accumulator, row ) => accumulator + row.sqft, 0 ),
                info = getInfo( rows.filter( row => row.sqft >= magic_sqft ), sqft, intersect_sqft, items[ _selected ].value )

            labels = info.labels,
            datasets = [ {
                label: items[ _selected ].label, 
                data: info.values, 
                hoverOffset: 4,
                backgroundColor: info.background,
                borderColor: info.border,

            } ]
 
        }
    
    }

    onMount( ( ) => { mounted = true } )

    //reactives
    $: { handleInfoChange( gisid, sqft, selected, mounted ) }
	
</script>