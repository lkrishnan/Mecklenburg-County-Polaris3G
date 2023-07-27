<div class="px-2 text-sm font-semibold text-center text-primero border-b border-edge dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap">
        {#each tabs as tab}
            <li class="mr-2">
                <button type="button" class="border border-primero rounded-t-md p-2 text-center inline-flex items-center {tab.route === $page.url.pathname ? 'bg-primero text-lienzo' : 'text-primero border-b border-b-lienzo hover:bg-luz hover:text-primero' } font-semibold focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    on:click="{()=>{ goto( tab.route ) } }" >
                    {tab.text}
                </button>

            </li>

        {/each}
        
    </ul>

</div>
    
<main>
    <slot />
</main>
    
<script>
    import { page } from "$app/stores"
    import { goto } from "$app/navigation"
    
    const tabs = [
            { idx: 0, text: "Owner", route: "/othersearch/owner" },
            { idx: 1, text: "Situs", route: "/othersearch/situs" },
            { idx: 2, text: "Prelim Plan", route: "/othersearch/prelimplan" },
            { idx: 3, text: "Engr. Grid", route: "/othersearch/enggrid" },

        ]

</script>