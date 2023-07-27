<div class="bg-primero border-2 border-primero p-0 rounded flex flex-col gap-0.5">
    {#each btns as btn, i}
        <button 
            class="p-1 border {active === i ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-lienzo'} rounded group relative hover:bg-segundo hover:border-segundo hover:text-lienzo"
            on:click="{(event)=>{handleClick(btn.tool, i)}}"
        >
            {@html icon( btn.icon, 24, 24 )}
            {#if !open}
                <span
                    class="bg-primero text-lienzo py-1 px-2 rounded-xl pointer-events-none absolute top-[4px] right-11 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm"
                >
                    {btn.tooltip}
                </span>
            {/if}
        </button>
    {/each}

    {#if open}
        <div
            in:fly="{{ y: 180, duration: 2000 }}" out:fade
            class="absolute right-9 top-0 border-2 border-primero p-1 min-w-[150px] rounded-l bg-lienzo"
        >
            <div class="flex flex-row items-center gap-2">
                <button 
                    class="p-1 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-luz hover:text-segundo"
                    on:click="{(event)=>{open=false;active = -1;}}"
                >
                    {@html icon( "close", 20, 20 )}
                </button>
                <div class="grow text font-bold">{btns[active].tooltip}</div>
                
            </div>

            <div class="p-2 flex gap-3">
                {#if btns[active].tool === "measure"}
                    {#each measure_btns as btn, i}
                        <button 
                            class="p-1 border {measure_active === i ? 'bg-segundo border-segundo text-lienzo' : 'bg-lienzo border-suave'} rounded group relative hover:bg-segundo hover:text-lienzo hover:border-segundo"
                            on:click="{(event)=>{measure_active=i;dispatch("click", {tool:btn.tool});}}"
                        >
                            {@html icon( btn.icon, 24, 24 )}
                            
                        </button>
                    {/each}

                {/if}

            </div>
            
        </div>

    {/if}
    
</div>



<script>
	import { createEventDispatcher } from "svelte"
    import { fade, fly } from "svelte/transition"
    import { icon } from "$lib/utils"

    export let map_tool

    const dispatch = createEventDispatcher( ),
        btns = [ 
            { icon: "overlays", tool: "overlays", tooltip: "Overlays" },
            { icon: "selectsrch", tool: "select_srch", tooltip: "Select Search" },
            { icon: "id", tool: "identify", tooltip: "Identify Layer" },
            { icon: "tape", tool: "measure", tooltip: "Measure" },
            { icon: "print", tool: "print", tooltip: "Print" },
        ],
        measure_btns = [
            { icon: "ruler", tool: "dist_measure", tooltip: "Distance Measure" },
            { icon: "setsquare", tool: "area_measure", tooltip: "Area Measure" },
        ]

    let open = false,
        active = btns.findIndex( item => item.tool === map_tool ),
        measure_active = 0

    console.log( active )

    const handleClick = ( tool, idx ) => {
            active = idx

            switch( tool ){
                case "select_srch": 
                    open = false
                    dispatch("click", { tool: tool })
                    break

                case "measure":
                    open= true    
                    dispatch("click", { tool: measure_btns[ measure_active ].tool })
                    break
                
                default:
                    open= true
                    dispatch("click", { tool: tool })
                    break

            }

            

        }

    

</script>