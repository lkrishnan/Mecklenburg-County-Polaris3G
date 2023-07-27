<div class="mb-4 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Associate Information" iconname="moreinfo" />
    <InfoTable infos={infos} />

</div>

<script>
    import { arrayToNumList, formatLandArea, formatLegalDesc, formatUCWords } from "$lib/format"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Heading from "$lib/components/Heading.svelte"

    // component props
    export let legal = null
    export let landuse = null
    export let sqft = null
    
    let infos = [ ]

    //reactives
    $: if( legal ){
        infos = [ 
            { label: "Legal Desc", value: formatLegalDesc( legal[ 0 ].legal_description ) }, 
            { label: "Land Area", value: ( sqft ? ( formatLandArea( legal[ 0 ].total_acres, legal[ 0 ].land_unit_type, legal[ 0 ].land_unit_desc, ( sqft / 43650 ) ) ) : null ) },
            { label: "Fire District", value: formatUCWords( legal[ 0 ].fire_district.toLowerCase( ) ) },
            { label: "Special District", value: ( legal[ 0 ].special_district === "NA" ? legal[ 0 ].special_district : formatUCWords( legal[ 0 ].special_district.toLowerCase( ) ) ) },
            { label: "Account Type", value: formatUCWords( legal[ 0 ].account_type.toLowerCase( ) ) },
            { label: "Municipality", value: formatUCWords( legal[ 0 ].municipality.toLowerCase( ) ) },
            { label: "Land Use", value: formatUCWords( arrayToNumList( [ ...new Set( landuse.map( item => item.land_use ) ) ] ).toLowerCase( ) ) }
        
        ]

    }
            
</script>