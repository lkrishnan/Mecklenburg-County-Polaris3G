<div class="text-sm font-medium text-center text-primary border-b border-edge dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
        {#each tabs as tab}
            <li class="mr-2">
                <button type="button" class="inline-flex p-4 {activetab === tab.idx ? 'border-b-2 border-signify text-signify' : '' } hover:text-secondary hover:border-secondary dark:hover:text-secondary"
                    on:click="{()=>{ activetab = tab.idx; }}" >
                    {tab.text}
                </button>
            </li>
        {/each}
        
    </ul>
</div>

<div class="p-2">
    <form class="p-2">
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="lastname">
                Last Name / Business Name
            </label>
            <input class="border border-edge rounded w-full py-2 px-3 text-inputtxt leading-tight focus:outline-none focus:shadow-outline placeholder:text-edge" id="lastname" type="text" placeholder="Required">
            <p class="mt-2 ml-2 text-red-500 text-xs italic">Please choose a password.</p>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="firstname">
                First Name
            </label>
            <input class="border border-edge rounded w-full py-2 px-3 text-inputtxt leading-tight focus:outline-none focus:shadow-outline placeholder:text-edge" id="firstname" type="text" placeholder="Optional">
            <p class="mt-2 ml-2 text-red-500 text-xs italic">Please choose a password.</p>
        </div>
        <div>
            <button class="bg-primary text-secondary hover:bg-secondary hover:text-primary  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Go
            </button>
        </div>
    </form>
           
</div>

<script>
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
            { idx: 0, text: "Owner" },
            { idx: 1, text: "Situs" },
            { idx: 2, text: "Prelim Plan" },
            { idx: 3, text: "Engr. Grid" },

        ],
        handleTabChange = ( idx ) => {
            activetab = idx

        }

</script>
