<div class="flex p-2 bg-primero text-lienzo fill-lienzo items-center">
    <div class="flex-none">
        {@html icon( iconname, 28, 28 )}
        
    </div>
    <div class="grow font-medium text-lg pl-2 ">
        {title}
    </div>
</div>

<script>
    import {icon} from "$lib/utils"

    export let title= ""
    export let iconname= "information"

</script>