<table class="w-full text-left mb-2">
    <thead class="text-sm font-normal">
        <tr class="border-b border-primero">
            <th class="px-4 py-2">
                {title}
            </th>
        </tr>
    </thead>
    <tbody>
        {#each links as link}
            <tr>
                <td class="px-4 py-2">
                    <a 
                        class="text-{color} underline underline-offset-4 hover:text-primero" 
                        href='{link.url}' 
                        target='_blank' 
                        rel='noreferrer'
                    >
                        {@html link.label}
                        
                    </a>
                </td>
            </tr>
            
        {/each}
    </tbody>
</table>

<script>
    export let links = [ ]
    export let title = "Link To"
    export let color = "segundo"

</script>