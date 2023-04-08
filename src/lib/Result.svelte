<!--<div class="bg-surface border-b border-edge p-4 grid grid-rows-3 grid-cols-6 grid-flow-col gap-0 auto-cols-max">
    <div class="font-semibold row-span-3">
        {idx+1}.
    </div>
    <div class="font-semibold col-span-1 truncate">
        {formatAddr( info )}
    </div>
    <div class="col-span-1">
        Parcel ID: {info.pid}
    </div>
    <div class="col-span-1">
        Ownership: {@html formatOwnersAsHTML( info.owner_names )}
    </div>
    
</div>-->

<div class="bg-surface border-b border-edge p-4 flex hover:bg-secondary hover:cursor-pointer">
    <div class="flex-none w-10 h-10">
        {idx+1}.
    </div>
    <div class="grow">
        <div class="font-semibold truncate">
            {formatAddr( info )}
        </div>
        
        <div>
            Parcel ID: {info.pid}
        </div>

        <div>
            Ownership: {@html formatOwnersAsHTML( info.owner_names )}
        </div>

    </div>
    
  </div>



<script>
	import { formatAddr, formatOwnersAsHTML } from "$lib/formatStr"

    // component props
	export let info = {}
    export let idx = {}
    
</script>