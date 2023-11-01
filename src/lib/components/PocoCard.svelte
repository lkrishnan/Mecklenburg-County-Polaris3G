<div class="p-1 border border-primero rounded w-[120px]">
    <div class="flex flex-row items-center gap-2">
        <div class="flex-none">
            {@html icon( iconname, 24, 24 )}
            
        </div>
        <div class="grow">
            {title}
        </div>

    </div>
    
    <div class="flex justify-center text-lg">
        {content}
    </div>
</div>


<script>
    import {icon} from "$lib/utils"

    export let title= ""
    export let iconname= "information"
    export let content = ""

</script>