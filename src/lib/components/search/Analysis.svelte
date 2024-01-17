<div
    in:fly="{_mobile ? { y: -180, duration: 1200 } : { x: -180, duration: 1200 }}" out:fly="{_mobile ? { y: 180, duration: 1200 } : { x: -180, duration: 1200 }}"
    class="absolute z-20 left-0 md:left-[50px] top-0 h-full w-full md:w-[408px] bg-luz md:border-l overflow-auto scrollbar"
>
    <div class="flex flex-row items-center p-2 bg-primero text-lienzo">
        <div class="grow text-md font-bold">
            {heading}
        </div>
        <div class="flex">
            <button 
                class="p-1 transition-colors duration-150 focus:shadow-outline rounded-full hover:text-primero hover:bg-lienzo"
                on:click="{(event)=>{dispatch( "close", { close: false } )}}"
            >
                {@html icon( "close", 24, 24 )}
            </button>
            
        </div>
        
    </div>


    {#if show}
        <form class="p-2" 
            on:submit|preventDefault={validate}
            on:reset|preventDefault={clear}
        >
            <!-- Property Use -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="prop_use">
                    Property Use
                </label>

                <Selecto 
                    on:hit={event=>handleHit( event, "prop_use" )}  
                    bind:items={fields.prop_use.items} 
                    bind:selected={fields.prop_use.selected} 

                />

            </div>

            <!-- Narrow Search By -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="narrow">
                    Narrow Search By
                </label>

                <Selecto 
                    on:hit={event=>handleHit( event, "narrow" )} 
                    bind:items={fields.narrow.items} 
                    bind:selected={fields.narrow.selected} 

                />

            </div>

            <!-- Jurisidiction -->
            {#if fields.narrow.selected === 0}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="juris">
                        Jurisdiction
                    </label>

                    <Selecto
                        on:hit={event=>handleHit( event, "juris" )} 
                        bind:items={fields.juris.items} 
                        bind:selected={fields.juris.selected} 
                    />

                </div>

            <!-- Neighborhood Code -->
            {:else if fields.narrow.selected === 1}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="neigh_code">
                        Appraisal Neighborhood Code
                    </label>

                    <Selecto
                        on:hit={event=>handleHit( event, "neigh_code" )} 
                        bind:items={fields.neigh_code.items} 
                        bind:selected={fields.neigh_code.selected} 
                    />

                </div>

            <!-- Streename -->
            {:else if fields.narrow.selected === 2}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="street_name">
                        Street Name
                    </label>

                    <div class="w-full bg-lienzo border {fields.stcode.error ? 'border-pop' : 'border-todo' } rounded" id="street_name">
                        <!--<AutoComplete 
                            placeholder="Required" 
                            minchar={fields.stcode.minchar} spinner={fields.stcode.spinner}
                            go={false} nomatch={fields.stcode.nomatch} 
                            items={fields.stcode.items}
                            value={fields.stcode.val} 
                            padding="pl-3 pr-2 py-2" buttonsize="8" 
                            on:hit={event=>{handleHit( event, "stcode" )}}
                            on:query={event =>{handleQuery( event, "stcode" )}}

                            />-->

                        <AutoComplete 
                            placeholder="Required" 
                            minchar={stcode_minchar} spinner={stcode_spinner} go={false} nomatch={stcode_nomatch} items={stcode_items} hide_items={false} is_open={false}
                            value={fields.stcode.value}
                            padding="pl-3 pr-2 py-2" buttonsize="8"
                            on:hit={event=>{handleHit( event, "stcode" )}}
                            on:query={event =>{handleQuery( event, "stcode" )}}

                        />
                    </div>
                    <p class="{fields.stcode.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.stcode.error}</p>
                </div>

            <!-- Buffer Size -->
            {:else if fields.narrow.selected === 3}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="buffer">
                        Buffer Size
                    </label>

                    <input 
                        type="text" 
                        class="w-full px-3 py-3.5 border {fields.buffer.error ? 'border-pop' : 'border-primero' } focus:outline-segundo text-sm rounded block" 
                        placeholder="Buffer Size (0 - 5280) ft." 
                        bind:value="{fields.buffer.val}"
                    />
                    <p class="{fields.buffer.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.buffer.error}</p>

                </div>

            {/if}

            <!-- Parcels with Acreage -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="parcel_acreage">
                    Parcels with Acreage <br/>
                    <span class="text-oro font-normal">(Not all parcels are assessed by acres)</span>
                </label>

                <Selecto
                    on:hit={event=>handleHit( event, "parcel_acreage" )} 
                    bind:items={fields.parcel_acreage.items} 
                    bind:selected={fields.parcel_acreage.selected} 
                />

            </div>

            <!-- Land Size -->
            {#if fields.parcel_acreage.val === 1}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="market_value">
                        Land Size
                        <span class="text-oro font-normal">(By Acres)</span>
                    </label>

                    <div class="flex flex-row mb-2">
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full px-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Min (&gt;={formatCommas(fields.land_size_acreage.absolute_min)})"
                                bind:value="{fields.land_size_acreage.min}"
                                
                            />
                            
                        </div>
                        <div class="flex grow justify-center items-center px-2">-</div>
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full px-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Max (&lt;={formatCommas(fields.land_size_acreage.absolute_max)})"
                                bind:value="{fields.land_size_acreage.max}"
                                
                            />
                        </div>
                        
                    </div>
                
                    <p class="{fields.land_size_acreage.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.land_size_acreage.error}</p>

                </div>

            {:else if fields.parcel_acreage.val === 0}
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="market_value">
                        Land Size
                        <span class="text-oro font-normal">(By Count)</span>
                    </label>

                    <div class="flex flex-row mb-2">
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full px-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Min (&gt;={formatCommas(fields.land_size_no_acreage.absolute_min)})"
                                bind:value="{fields.land_size_no_acreage.min}"
                                
                            />
                            
                        </div>
                        <div class="flex grow justify-center items-center px-2">-</div>
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full px-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Max (&lt;={formatCommas(fields.land_size_no_acreage.absolute_max)})"
                                bind:value="{fields.land_size_no_acreage.max}"
                                
                            />
                            
                        </div>
                        
                    </div>
                
                    <p class="{fields.land_size_no_acreage.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.land_size_no_acreage.error}</p>

                </div>
            
            {/if}

            <!-- Market Value -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="market_value">
                    Market Value
                </label>

                <div class="flex flex-row mb-2">
                    <div class="relative w-1/2">
                        <input 
                            type="text" 
                            class="w-full pl-6 pr-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            placeholder="Min (&gt;={formatCommas(fields.market_value.absolute_min)})"
                            bind:value="{fields.market_value.min}"
                            
                        />
                        <span class="absolute top-0 py-2 fill-suave">
                            {@html icon( "money", 28, 28 )}
                        </span>
                    </div>
                    <div class="flex grow justify-center items-center px-2">-</div>
                    <div class="relative w-1/2">
                        <input 
                            type="text" 
                            class="w-full pl-6 pr-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            placeholder="Max (&lt;={formatCommas(fields.market_value.absolute_max)})"
                            bind:value="{fields.market_value.max}"
                            
                        />
                        <span class="absolute top-0 py-2 fill-suave">
                            {@html icon( "money", 28, 28 )}
                        </span>
                    </div>
                    
                </div>
            
                <p class="{fields.market_value.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.market_value.error}</p>

            </div>

            <!-- Sale Price -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="sale_price">
                    Sale Price
                </label>

                <div class="flex flex-row mb-2">
                    <div class="relative w-1/2">
                        <input 
                            type="text" 
                            class="w-full pl-6 pr-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            placeholder="Min (&gt;={formatCommas(fields.sale_price.absolute_min)})"
                            bind:value="{fields.sale_price.min}"
                            
                        />
                        <span class="absolute top-0 py-2 fill-suave">
                            {@html icon( "money", 28, 28 )}
                        </span>
                    </div>
                    <div class="flex grow justify-center items-center px-2">-</div>
                    <div class="relative w-1/2">
                        <input 
                            type="text" 
                            class="w-full pl-6 pr-3 py-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            placeholder="Max (&lt;={formatCommas(fields.sale_price.absolute_max)})"
                            bind:value="{fields.sale_price.max}"
                            
                        />
                        <span class="absolute top-0 py-2 fill-suave">
                            {@html icon( "money", 28, 28 )}
                        </span>
                    </div>
                    
                </div>
            
                <p class="{fields.sale_price.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.sale_price.error}</p>

            </div>

            <!-- Sale Date -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2" for="sale_date">
                    Sale Date
                </label>

                <div class="flex flex-row mb-2">
                    <div class="relative w-1/2">
                        <input 
                            type="date" 
                            class="w-full p-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            min="{fields.sale_date.absolute_min}"
                            max="{( fields.sale_date.max ? fields.sale_date.max : fields.sale_date.absolute_max )}"
                            bind:value="{fields.sale_date.min}"
                            
                        />
                    </div>
                    <div class="flex grow justify-center items-center px-2">-</div>
                    <div class="relative w-1/2">
                        <input 
                            type="date" 
                            min="{( fields.sale_date.min ? fields.sale_date.min : fields.sale_date.absolute_min )}"
                            max="{fields.sale_date.absolute_max}"
                            class="w-full p-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            bind:value="{fields.sale_date.max}"
                            
                        />
                    </div>
                    
                </div>
            
                <p class="{fields.sale_date.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.sale_date.error}</p>

            </div>
            
            {#if bldg_info}
                <!-- Year Built -->
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="year_built">
                        Year Built
                    </label>

                    <div class="mb-8">
                        <DoubleRangeSlider 
                            bind:min={fields.year_built.min} 
                            bind:max={fields.year_built.max}
                            bind:absolute_min={fields.year_built.absolute_min} 
                            bind:absolute_max={fields.year_built.absolute_max}
                            decimal_places={fields.year_built.decimal_places}
                            format={fields.year_built.format}
                        />

                    </div>

                </div>

                <!-- Square Feet -->
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="market_value">
                        Square Feet
                    </label>

                    <div class="flex flex-row mb-2">
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full p-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Min (&gt;={formatCommas( fields.sq_ft.absolute_min ) + " sqft"})"
                                bind:value="{fields.sq_ft.min}"
                                
                            />
                        
                        </div>
                        <div class="flex grow justify-center items-center px-2">-</div>
                        <div class="relative w-1/2">
                            <input 
                                type="text" 
                                class="w-full p-3 border border-primero focus:outline-segundo text-sm rounded block" 
                                placeholder="Max (&lt;={formatCommas( fields.sq_ft.absolute_max ) + " sqft"})"
                                bind:value="{fields.sq_ft.max}"
                                
                            />
                            
                        </div>
                        
                    </div>
                
                    <p class="{fields.sq_ft.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.sq_ft.error}</p>

                </div>

                {#if bed_bath_info}
                    <!-- Bedrooms -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="bedroom">
                            Bedrooms
                        </label>

                        <Selecto
                            on:hit={event=>handleHit( event, "bedroom" )} 
                            bind:items={fields.bedroom.items} 
                            bind:selected={fields.bedroom.selected} 
                        />

                    </div>

                    <!-- Fullbaths -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="fullbath">
                            Full Baths
                        </label>

                        <Selecto
                            on:hit={event=>handleHit( event, "fullbath" )} 
                            bind:items={fields.fullbath.items} 
                            bind:selected={fields.fullbath.selected} 
                        />

                    </div>

                    <!-- Exterior Frame -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="exterior_frame">
                            Exterior Frame
                        </label>

                        <Selecto
                            on:hit={event=>handleHit( event, "exterior_frame" )} 
                            bind:items={fields.exterior_frame.items} 
                            bind:selected={fields.exterior_frame.selected} 
                        />

                    </div>

                    <!-- Story Type -->
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="exterior_frame">
                            Story Type
                        </label>

                        <Selecto
                            on:hit={event=>handleHit( event, "exterior_frame" )} 
                            bind:items={fields.story_type.items} 
                            bind:selected={fields.story_type.selected} 
                        />

                    </div>

                {/if}

            {/if}

            <div class="mb-4 flex flex-row justify-end gap-2">
                <button class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
                    type="reset"
                >
                    Clear
                </button>

                <button 
                    class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" 
                    type="submit" 
                >
                    Analyze
                </button>

            </div>

        </form>

    {:else}
        <div class="flex items-center p-2 gap-2 text-pop">
            {@html icon( "alert", 48, 48 )}
            <h1>Unavailable</h1>
        </div>
    
    {/if}
    
</div>

<script>
    //Svelte Libraries
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import {onMount} from "svelte"
    import {goto} from "$app/navigation"

    //Store
    import {mobile} from "$lib/store"

    //Custom Libraries
    import {getAPIURL} from "$lib/api"
    import {formatCommas} from "$lib/format"
    import {getAnlyzFieldsInit} from "$lib/formhelp"
    import {icon, json2URL, filterObj} from "$lib/utils"
    import {validateForm} from "$lib/validate"
    import AutoComplete from "$lib/components/AutoComplete.svelte"
    import DoubleRangeSlider from "$lib/components/DoubleRangeSlider.svelte"
    import Selecto from "$lib/components/Selecto.svelte"

    export let heading = ""
    export let fields = null
    export let list = null 
    export let gisid = null
    export let neigh_code = null

    //Store Variables
	let _mobile
			
    // Other Variables
    let show = true,
        bldg_info = true,
        bed_bath_info = true

    //STCODE Autocomplete
    let stcode_items = [ ],
        stcode_nomatch = false,
        stcode_spinner = false
    
    const dispatch = createEventDispatcher( ),
        stcode_minchar = 3,
    
        handleQuery = async ( event, field ) => { // fetch matches
            const srch_str = event.detail.trim( )

            if( srch_str.length >= stcode_minchar ){
                // Fetch Results
                stcode_spinner = true

                const response = await fetch( `${getAPIURL( field, srch_str )}` )
                    
                stcode_items = ( response.ok ? await response.json( ) : [ ] )
                
            }else
                stcode_items.length = 0

            stcode_nomatch = ( stcode_items.length === 0 )
            stcode_spinner = false

        }, 
        
        handleHit = ( event, field ) => { 
            switch( field ){
                case "narrow":
                    const arr = [ "juris", "neigh_code", "stcode", "buffer" ]

                    arr.forEach( fld => { 
                        if( fields.hasOwnProperty( fld ) )
                            fields[ fld ].use = ( event.detail.value === fld ) 
                        
                    } )
                    break

                case "stcode":
                    fields[ field ].val = event.detail.srch_key
                    fields[ field ].value = event.detail.value
                    break

                case "parcel_acreage":
                    fields.land_size_acreage.use = ( event.detail.value === 1 )
                    fields.land_size_no_acreage.use = ( event.detail.value === 0 )
                    break

                case "prop_use":
                    const dwellings = [ "Single-Family", "Multi-Family", "Manufactured", "Condo/Townhome" ],
                        bldg_fields = [ "year_built", "sq_ft", "bedroom", "fullbath", "exterior_frame", "story_type" ],
                        bed_bath_fields = [ "bedroom", "fullbath" ]

                    //bldg
                    bldg_info = ( fields.prop_use.items[ fields.prop_use.selected ].value !== "Vacant Land" )
                    bldg_fields.forEach( field => { fields[ field ].use = bldg_info } )

                    //bed bath
                    bed_bath_info = dwellings.includes( fields.prop_use.items[ fields.prop_use.selected ].value )
                    bed_bath_fields.forEach( field => { fields[ field ].use = bed_bath_info } )
                    
                    break

            }
                
            if( fields[ field ].select_ctrl )
                fields[ field ].val = event.detail.value

        },

        parseVals = ( ) => {
            const keys = [ "buffer" ]

            keys.forEach( field => {
                if( fields[ field ].val )
                    fields[ field ].value = `${gisid}|${fields[ field ].val}`

            } )

        },
        
        validate = ( ) => {
            const check_fields = Object.entries( fields )
                                    .filter( ( [ key, value] ) => value.hasOwnProperty( "rules" ) && value.use )
                                    .map( elem => elem[ 0 ] ),
                verdict = validateForm( filterObj( fields, check_fields ) )

            fields = { ...fields, ...verdict.fields }

            if( verdict.valid ){
                let query_params = { }

                parseVals( )

                Object.keys( fields ).forEach( field => {
                    if( fields[ field ].use ){
                        if( fields[ field ].hasOwnProperty( "val" ) && fields[ field ].val )
                            query_params[ field ] = fields[ field ].val

                        else if( fields[ field ].hasOwnProperty( "min" ) && fields[ field ].hasOwnProperty( "max" ) && fields[ field ].min && fields[ field ].max ){
                            if( parseInt(fields[ field ].min) !== parseInt(fields[ field ].absolute_min) || parseInt(fields[ field ].max) !== parseInt(fields[ field ].absolute_max) )
                                query_params[ field ] =  `${fields[ field ].min}|${fields[ field ].max}`

                        }
                        
                    }
            
                } )

                dispatch( "close", { close: false, fields: fields } )
                goto( `/analysis/params?${json2URL( query_params )}` )

            }

        },

        clear = ( ) => {
            fields = getAnlyzFieldsInit( list, gisid, neigh_code )

        }

    mobile.subscribe( value => { _mobile = value } )
 
    onMount( ( ) => {
        //show = !Object.values( list ).filter( val => val.length === 0 ).length


    } )

</script>