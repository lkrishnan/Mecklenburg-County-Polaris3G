<div 
    class="grid grid-cols-12 gap-x-3 gap-y-0 bg-surface border-b last:border-b-0 border-edge p-4 hover:bg-secondary hover:cursor-pointer"
    role="button"
    tabindex=-1
    on:click="{()=>handleHit( info.pid, info.gisid )}" 
    on:keydown="{event=>handleKeyDown(event, info.pid, info.gisid)}"
    
>
    <div class="col-span-1 row-span-6">
        {idx+1}.
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Parcel ID &#x2022;</span> {info.pid}
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Ownership</span>
            {@html formatOwnersAsHTML( [ 
                formatFullName( info.owner1_lastname, info.owner1_firstname, false ),
                formatFullName( info.owner2_lastname, info.owner2_firstname, false ),
                formatFullName( info.owner3_lastname, info.owner3_firstname, false ),

            ] )}
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Mailing Address</span>
        <div class="truncate">
            {concatArr( [ concatArr( [ info.owner_address_1, info.owner_address_2 ] ), concatArr( [ info.owner_city, info.owner_state, info.owner_zipcode ] ) ] )}
        </div>
        
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Land Area &#x2022;</span> {( info.sqft ? ( formatLandArea( info.land_size, info.land_unit, ( info.sqft / 43650 ) ) ) : null )}
        
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Legal Desc &#x2022;</span> { info.legal_description }
        
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Deed &#x2022;</span> { info.legal_description }
        
    </div>
    
</div>

<script>
	import { formatMoney, formatLandArea, formatFullName, formatOwnersAsHTML, concatArr, formatLegalDesc } from "$lib/format"
    import { srchstr2qrystr, sortArrayofObjs } from "$lib/utils"
    import { last_hit } from '$lib/store'
    import { goto } from "$app/navigation"
    import { onMount } from "svelte"
    import PocoCard from "$lib/components/PocoCard.svelte"
    import { slide } from "svelte/transition"
    
    // component props
	export let info = {}
    export let idx = {}

    const handleKeyDown = ( event, pid, gisid ) => {
            if( event.key === "Enter" ){
                event.preventDefault( )
                handleHit( pid, gisid )

            }

        },
        
        handleHit = ( pid, gisid ) => { 
            const hit = { value: pid, type: `PICK`, pid: pid, gisid: gisid }
            last_hit.set( hit )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

</script>