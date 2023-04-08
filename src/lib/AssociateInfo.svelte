<div class="px-4 pt-2 pb-4 text-sm bg-surface">
    <div class="flex pb-2">
        <div class="flex-none w-8">
            <calcite-icon icon="miscellaneous-collection" scale="m" class="w-6 h-6 stroke-title"></calcite-icon>
        </div>
        <div class="grow font-bold text-lg text-title">
            Associate Information
        </div>
    </div>

    <table class="w-full text-left text-primary mb-2">
        <thead>
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Info
                </th>
                <th class="px-4 py-2">
                    Value
                </th>
            </tr>
        </thead>
        <tbody>
            {#each infos as info}
            <tr>
                <td class="px-4 py-2">
                    {info.label}
                </td>
                <td class="px-4 py-2">
                    {@html info.value }
                </td>
            </tr>
            {/each}
        </tbody>
    </table>

</div>

<script>
    import { arrayToNumList, formatLandArea, formatLegalDesc, formatUCWords } from "$lib/formatStr"

    // component props
    export let legal = null
    export let landuse = null
    export let sqft = null
    
   let infos = [ ]

   const setInfo = ( ) => {
        infos = [ 
            { label: "Legal Desc", value: formatLegalDesc( legal[ 0 ].legal_description ) }, 
            { label: "Land Area", value: ( sqft ? ( formatLandArea( legal[ 0 ].total_acres, legal[ 0 ].land_unit_type, ( sqft / 43650 ) ) ) : null ) },
            { label: "Fire District", value: formatUCWords( legal[ 0 ].fire_district.toLowerCase( ) ) },
            { label: "Special District", value: ( legal[ 0 ].special_district ? formatUCWords( legal[ 0 ].special_district.toLowerCase( ) ) : "NA" ) },
            { label: "Account Type", value: formatUCWords( legal[ 0 ].account_type.toLowerCase( ) ) },
            { label: "Municipality", value: formatUCWords( legal[ 0 ].municipality.toLowerCase( ) ) },
        
        ]

        if( landuse.length > 0 ){
            let unique_landuse = [ ]

            landuse.forEach( function( item, i ){ 
                if( i === 0 || ( item.land_use != landuseArr[ 0 ] ) )
                    unique_landuse.push( item.land_use ) 	
                
            } )

            infos.push( { label: "Land Use", value: formatUCWords( arrayToNumList( unique_landuse ).toLowerCase( ) ) } )

        }

    }

    //reactives
    $: if( legal )
        setInfo( )
    
</script>