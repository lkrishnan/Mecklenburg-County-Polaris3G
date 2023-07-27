<div class="relative bg-lienzo my-1 flex flex-col gap-0">
    
        <input 
            id={entry.id} 
            type="checkbox" 
            value=""
            bind:checked={entry.checked} 
            class="absolute left-2 top-2.5 w-4 h-4 rounded checked:bg-primero text-primero bg-primero"
            on:change={handleGroupChange}            
        />
        <button 
            class="text-primero bg-luz p-2 rounded text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full" 
            type="button"
            on:click={handleToggle} 
            aria-expanded={entry.open}
        >
            <div class="flex">
                <span class="flex grow justify-start ml-6">{entry.name}</span>    
                <svg class="w-4 h-4 flex-none" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                
            </div>
            
        </button>

    {#if entry.open}
        <ul 
            transition:slide={{ duration: 300 }}
            class="px-4 pt-2 pb-1 rounded"
        >
            {#each entry.children as item}
                <li>
                    <div class="flex pl-2 gap-2">
                        <div class="flex {item.name.length > 30 ? 'items-start pt-[2px]' : 'items-center'}">
                            <input 
                                id={item.id} 
                                type="checkbox" 
                                value=""
                                bind:checked={item.checked} 
                                class="w-4 h-4 rounded checked:bg-primero text-primero bg-primero"
                                on:change={handleChange}
                            />
                        </div>
                        <div class="flex items-center">
                            <label for={item.id} class="text-sm font-medium text-todo">{item.name}</label>
                        </div>
                                                
                    </div>
                </li>
            {/each}
        </ul>
    {/if}

</div>

<script>
	import { slide } from "svelte/transition"
    import { createEventDispatcher } from "svelte"

	export let entry

    const dispatch = createEventDispatcher( ),
        handleToggle = ( ) => {
            entry.open = !entry.open

            if( entry.open )
                dispatch( "active_tab_change", { tab: entry.id } )
            
        },
        handleGroupChange = event => {
            for( let i = 0 ; i< entry.children.length; i++ )
                entry.children[ i ].checked = entry.checked

            dispatch( "overlay_toggle", { lyr_idx: -1, checked: entry.checked } )
            
        },
        handleChange = event => {
            let lyr_idx = -1,
                checked = 0

            entry.children.forEach( ( child, i ) => {
                if( child.id === event.target.id )
                    lyr_idx = i

                checked += ( child.checked ? 1 : 0 )

            } )

            entry.checked = ( checked < entry.children.length ? false: true )

            if( lyr_idx > -1 )
                dispatch( "overlay_toggle", { lyr_idx: lyr_idx, checked: entry.children[ lyr_idx ].checked } )

        }

</script>

<style>
	svg { 
        transition: transform 0.2s ease-in;
        transform: rotate(0.25turn);
    }
    [aria-expanded=true] svg { transform: rotate(0.75turn); }
</style>