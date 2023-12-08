<div class="mb-4 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Associate Information" iconname="moreinfo" />
    <InfoTable infos={infos} />

</div>

<script>
    import { onMount } from "svelte"
    import { formatLandArea, formatLegalDesc, formatUCWords } from "$lib/format"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Heading from "$lib/components/Heading.svelte"

    // component props
    export let legal_description = null
    export let sqft = null
    export let land_size = null
    export let land_unit = null
    export let fire_district = null
    export let special_district = null
    export let account_type = null
    export let municipality = null
    export let land_use_desc = null
    
    let mounted = false,
        infos = [ ]

    const handleInfoChange = ( _legal_description, _sqft, _land_size, _land_unit, _fire_district, _special_district, _account_type, _municipality, _land_use_desc, _mounted ) => {
            if( _mounted ){
                infos = [ 
                    { label: "Legal Desc", value: ( _legal_description ? formatLegalDesc( _legal_description ) : "NA" ) }, 
                    { label: "Land Area", value: formatLandArea( _land_size, _land_unit, _sqft ) },
                    { label: "Fire District", value: ( _fire_district ? formatUCWords( _fire_district.toLowerCase( ) ) : "NA" ) },
                    { label: "Special District", value: ( _special_district ? formatUCWords( _special_district.toLowerCase( ) ) : "NA" ) },
                    { label: "Account Type", value: ( _account_type ? formatUCWords( _account_type.toLowerCase( ) ) : "NA" ) },
                    { label: "Municipality", value: ( _municipality ? formatUCWords( _municipality.toLowerCase( ) ) : "NA" ) },
                    { label: "Land Use", value: ( _land_use_desc ? formatUCWords( _land_use_desc.toLowerCase( ) ) : "NA" ) },
                
                ]

            }
            
        }

    onMount( ( ) => {
        mounted = true
        
    } )

    //reactives
    $: { handleInfoChange( legal_description, sqft, land_size, land_unit, fire_district, special_district, account_type, municipality, land_use_desc, mounted ) }
            
</script>