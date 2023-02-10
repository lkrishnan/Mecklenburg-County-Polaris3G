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
    const rules = {
            lastname: [
                { 
                    test: v => { v.trim( ).length > 0 },
                    error: "Last Name is required", 

                }

            ]

        }
</script>