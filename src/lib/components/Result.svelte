<div class="grid grid-cols-12 gap-x-3 gap-y-0 bg-surface border-b border-edge p-4 hover:bg-secondary hover:cursor-pointer" 
    on:click="{()=>handleHit( info.pid, info.gisid )}" on:keydown="{event=>handleKeyDown(event, info.pid, info.gisid)}"
>
    <div class="row-span-3">
        {idx+1}.
    </div>
    
    <div class="col-span-11 font-semibold truncate grow">
        {info.situs_address}
    </div>
    
    <div class="col-span-11">
        Parcel ID: {info.pid}
    </div>

    <div class="col-span-11">
        Ownership: {@html formatOwnersAsHTML( [ info.owner_1, info.owner_2, info.owner_3 ] )}
    </div>
    
</div>

<script>
	import { formatOwnersAsHTML } from "$lib/format"
    import { srchstr2qrystr } from "$lib/utils"
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
            const hit = { value: pid, type: `PID`, pid: pid, gisid: gisid }
            last_hit.set( hit )
            console.log( "here" )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

</script>