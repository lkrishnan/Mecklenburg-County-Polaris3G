<div class="text-sm font-medium text-center text-primary border-b border-edge dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
        {#each tabs as tab}
            <li class="mr-2">
                <button type="button" class="inline-flex p-4 {tab.route === $page.url.pathname ? 'border-b-2 border-signify text-signify' : '' } hover:text-secondary hover:border-secondary dark:hover:text-secondary"
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

    let activetab = 0,
        rules = {
            lastname: [
                { 
                    test: v => { v.trim( ).length > 0 },
                    error: "Last Name is required", 

                }

            ]

        }

    const tabs = [
            { idx: 0, text: "Owner", route: "/othersearch/owner" },
            { idx: 1, text: "Situs", route: "/othersearch/situs" },
            { idx: 2, text: "Prelim Plan", route: "/othersearch/prelimplan" },
            { idx: 3, text: "Engr. Grid", route: "/othersearch/enggrid" },

        ]

</script>
