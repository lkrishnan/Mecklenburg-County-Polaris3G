<table class="w-full text-left mb-2">
    <thead>
        <tr class="border-b border-primero">
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
            <td class="px-4 py-2 break-all">
                {@html info.value }
            </td>
        </tr>
        {/each}
    </tbody>
</table>

<script>
	export let infos = [ ]

</script>