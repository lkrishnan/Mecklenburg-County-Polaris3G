<div class="mb-4 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Associate Information" iconname="moreinfo" />
    <InfoTable infos={infos} />

</div>

<script>
    import { arrayToNumList, formatLandArea, formatLegalDesc, formatUCWords } from "$lib/format"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Heading from "$lib/components/Heading.svelte"

    // component props
    export let main = null
    export let sqft = null
    
    let infos = [ ]

    //reactives
    $: if( main ){
        infos = [ 
            { label: "Legal Desc", value: formatLegalDesc( main[ 0 ].legal_description ) }, 
            { label: "Land Area", value: ( sqft ? ( formatLandArea( main[ 0 ].land_size, main[ 0 ].land_unit, ( sqft / 43650 ) ) ) : null ) },
            { label: "Fire District", value: formatUCWords( main[ 0 ].fire_district.toLowerCase( ) ) },
            { label: "Special District", value: ( main[ 0 ].special_district === "NA" ? main[ 0 ].special_district : formatUCWords( main[ 0 ].special_district.toLowerCase( ) ) ) },
            { label: "Account Type", value: formatUCWords( main[ 0 ].account_type.toLowerCase( ) ) },
            { label: "Municipality", value: formatUCWords( main[ 0 ].municipality.toLowerCase( ) ) },
            { label: "Land Use", value: formatUCWords( arrayToNumList( [ ...new Set( main.map( item => item.land_use_desc ) ) ] ).toLowerCase( ) ) }
        
        ]

    }
            
</script>