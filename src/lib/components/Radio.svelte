<div role="radiogroup" class="flex flex-row" id={`group-${unique_id}`}>
    {#each options as { value, label }}
        <div class="inline-flex items-center pr-2">
            <label
                class="relative flex cursor-pointer items-center rounded-full p-3"
                for="{slugify( label )}"
            >
                <input
                    id={slugify( label )}
                    name="ripple"
                    type="radio"
                    class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-primero text-segundo transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-segundo checked:before:bg-segundo hover:before:opacity-10"
                    bind:group={val}
                    value={value} 
                    on:change="{event=>onChange(event)}"
                />
                    <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-segundo opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>

                        </svg>

                    </div>

            </label>

            <label
                class="mt-px cursor-pointer select-none font-light"
                for="{slugify( label )}"
            >
                {label} 
            </label>

        </div>

  {/each}

</div>

<script>
    import { createEventDispatcher } from "svelte"

    // based on suggestions from:
    // Sami Keijonen https://webdesign.tutsplus.com/tutorials/how-to-make-custom-accessible-checkboxes-and-radio-buttons--cms-32074
    // and Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
  
    export let options
    export let val = options[ 0 ].value
          
    const dispatch = createEventDispatcher( ),
        unique_id = Math.floor( Math.random( ) * 100 ),
        slugify = ( str = "" ) => str.toLowerCase( ).replace( / /g, "-").replace( /\./g, "" ),
        onChange = event => { // handle input change
            dispatch( "change", val )


	    }

  </script>
  