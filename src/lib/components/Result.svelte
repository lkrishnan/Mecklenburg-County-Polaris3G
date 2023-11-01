<div 
    class="grid grid-cols-12 gap-x-3 gap-y-0 bg-surface border-b last:border-b-0 border-edge p-4 hover:bg-secondary hover:cursor-pointer"
    role="button"
    tabindex=-1
    on:click="{()=>handleHit( info.pid, info.gisid )}" 
    on:keydown="{event=>handleKeyDown(event, info.pid, info.gisid)}"
    
>
    <div class="row-span-3">
        {idx+1}.
    </div>

    <div class="col-span-11">
        <span class="text-segundo font-semibold">Parcel ID &#x2022;</span> {info.pid}
    </div>
    
    <div class="col-span-11 truncate grow {(info.situs_address.length > 0 ? '' : 'hidden')}">
        {#if info.situs_address.length > 1}
            <span class="text-segundo font-semibold">Tax Situs Addresses:</span> {@html formatArrAsHTML( info.situs_address )}
        {:else}
            <span class="font-semibold">{info.situs_address}</span>
        {/if}
    </div>
    
    <div class="col-span-11">
        <span class="text-segundo font-semibold">Ownership</span>
            {@html formatOwnersAsHTML( [ 
                formatFullName( info.owner1_lastname, info.owner1_firstname, false ),
                formatFullName( info.owner2_lastname, info.owner2_firstname, false ),
                formatFullName( info.owner3_lastname, info.owner3_firstname, false ),

            ] )}
    </div>
    
</div>

<script>
	import { formatOwnersAsHTML, formatArrAsHTML, formatFullName } from "$lib/format"
    import { srchstr2qrystr, sortArrayofObjs } from "$lib/utils"
    import { last_hit } from '$lib/store'
    import { goto } from "$app/navigation"
    
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