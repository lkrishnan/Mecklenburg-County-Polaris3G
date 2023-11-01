<div class="m-2">
    <form class="p-2" on:submit|preventDefault={validate}>
        <!-- Property Use -->
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="prop_use">
                Property Use
            </label>

            <Seleccionar
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

            <Seleccionar 
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

                <Seleccionar
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

            <Seleccionar
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

            <div class="w-full bg-lienzo border {fields.street_name.error ? 'border-pop' : 'border-todo' } rounded" id="street_name">
                <AutoComplete placeholder="Required" minchar={fields.street_name.minchar} go={false}
                    bind:spinner={fields.street_name.spinner}  bind:nomatch={fields.street_name.nomatch} 
                    bind:items={fields.street_name.items} bind:str={fields.street_name.val}
                    padding="pl-3 pr-2 py-2" buttonsize="8" 
                    on:query={event => { handleQuery( event, "street_name" ) }}
                    on:hit={event=>{handleHit( event, "street_name" )}}/>
            </div>
            <p class="{fields.street_name.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.street_name.error}</p>
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

            <Seleccionar
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
                            placeholder="Min (&gt;={formatCommas( fields.square_feet.absolute_min ) + " sqft"})"
                            bind:value="{fields.square_feet.min}"
                            
                        />
                    
                    </div>
                    <div class="flex grow justify-center items-center px-2">-</div>
                    <div class="relative w-1/2">
                        <input 
                            type="text" 
                            class="w-full p-3 border border-primero focus:outline-segundo text-sm rounded block" 
                            placeholder="Max (&lt;={formatCommas( fields.square_feet.absolute_max ) + " sqft"})"
                            bind:value="{fields.square_feet.max}"
                            
                        />
                        
                    </div>
                    
                </div>
            
                <p class="{fields.square_feet.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-sm italic">{fields.square_feet.error}</p>

            </div>

            {#if bed_bath_info}
                <!-- Bedrooms -->
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="bedroom">
                        Bedrooms
                    </label>

                    <Seleccionar
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

                    <Seleccionar
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

                    <Seleccionar
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

                    <Seleccionar
                        on:hit={event=>handleHit( event, "exterior_frame" )} 
                        bind:items={fields.story_type.items} 
                        bind:selected={fields.story_type.selected} 
                    />

                </div>

            {/if}

        {/if}

        <div class="mb-4 flex flex-row justify-end gap-2">
            <button class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                Clear
            </button>

            <button class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                Analyze
            </button>

        </div>

    </form>
</div>

<script>
    import { onMount} from "svelte"
    import { goto } from "$app/navigation"
    import { last_hit, searchdrawer, rsltados, messenger } from "$lib/store"
    import Seleccionar from "$lib/components/Seleccionar.svelte"
    import AutoComplete from "$lib/components/search/AutoComplete.svelte"
    import { icon, json2URL, filterObj, sortArrayofObjs } from "$lib/utils"
    import { formatCommas } from "$lib/format"
    import { validateForm, validateNumeric } from "$lib/validate"
    import DoubleRangeSlider from "$lib/components/DoubleRangeSlider.svelte"
        
    let fields = {
            prop_use: {
                val: null,
                items: [ ],
                selected: 0,
                select_ctrl: true,
                use: true

            },

            narrow: {
                val: null,
                items: [ 
                    { value: "juris", label: "JURISDICTION" }, 
                    { value: "neigh_code", label: "APPRAISAL NEIGHBORHOOD CODE" }, 
                    { value: "street_name", label: "STREET NAME" }  

                ],
                selected: 0,
                select_ctrl: true,

            },

            juris: {
                val: "CHARLOTTE",
                items: [ 
                    { label: "CHARLOTTE", value: "CHARLOTTE" },    
                    { label: "CORNELIUS", value: "CORNELIUS" },
                    { label: "DAVIDSON", value: "DAVIDSON" },
                    { label: "HUNTERSVILLE", value: "HUNTERSVILLE" },
                    { label: "MATTHEWS", value: "MATTHEWS" },
                    { label: "MINT HILL", value: "MINT HILL" },
                    { label: "PINEVILLE", value: "PINEVILLE" },
                    { label: "STALLINGS", value: "STALLINGS" },
                    { label: "UNINC-MECKLENBURG", value: "MECKLENBURG COUNTY-UNINCORPORATED" },

                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            neigh_code: {
                val: null,
                items: [ ],
                selected: null,
                select_ctrl: true,
                use: false,

            },

            street_name: {
                val: null,
                rules: [
                    v => ( v ? null : "Street Name is required" ),
                    v => ( v.trim( ).length > 0 && v.trim( ).length < 76 ? null : "Street Name must be within 75 characters" ),
                ], 
                minchar: 2,
                items: [ ],
                nomatch: false,
                spinner: false,
                select_ctrl: false,
                use: false,

            },

            buffer: {
                val: null,
                rules: [
                    v => ( v ? null : "Buffer is required" ),
                    v => ( validateNumeric( v ) && parseInt( v ) > -1 && parseInt( v ) <= 5280 ? null : "Buffer should be a number between 0 - 5280 ft." ),
                ],
                select_ctrl: false,
                use: false,

            },

            parcel_acreage: {
                val: null,
                items: [ 
                    { label: "BOTH", value: null },
                    { label: "WITH ACREAGE", value: 1 },
                    { label: "WITHOUT ACREAGE", value: 0 },

                ],
                selected: 0,
                select_ctrl: true,
                use: true,

            },

            land_size_acreage: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Land Size should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),
                ],
                use: false,

            },

            land_size_no_acreage: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Land Size should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: false,

            },

            //No Acreage - POINT LOT, SUBMERGED, TOWNHOME CORNER LOT, WATERVIEW, WATERFRONT, LOT, GOLF COURSE, CONDO UNIT, MED CONDO
            //With Acreage - ACRE, CALC AREA, SMALL ACRE   /  SQUARE FEET

            market_value: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Market Value should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            sale_price: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Sale Price should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            sale_date: {
                min: null,
                max: null,
                absolute_min: "1900-03-06",
                absolute_max: new Date().toISOString().split("T")[0],
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Sale Date should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                ],
                use: true,
                
            },

            year_built: {
                min: 1696,
                max: new Date().getFullYear( ),
                absolute_min: 1696,
                absolute_max: new Date().getFullYear( ),
                decimal_places: 0,
                format: num => num,
                use: true,
                
            },

            square_feet: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Square Feet should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            bedroom: {
                val: null,
                items: [ 
                    { label: "ANY", value: null },    
                    { label: "1 BEDROOM", value: "1" },
                    { label: "2 BEDROOMS", value: "2" },
                    { label: "3 BEDROOMS", value: "3" },
                    { label: "4 BEDROOMS", value: "4" },
                    { label: "5+ BEDROOMS", value: "5" },
                    
                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            fullbath: {
                val: null,
                items: [ 
                    { label: "ANY", value: null },    
                    { label: "1 FULL BATH", value: "1" },
                    { label: "2 FULL BATHS", value: "2" },
                    { label: "3 FULL BATHS", value: "3" },
                    { label: "4 FULL BATHS", value: "4" },
                    { label: "5+ FULL BATHS", value: "5" },
                    
                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            exterior_frame: {
                val: null,
                items: [ { label: "ANY", value: null }, ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            story_type: {
                val: null,
                items: [ { label: "ANY", value: null }, ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

        },
        initial_state,
        _rsltados,
        bldg_info = true,
        bed_bath_info = true

    const handleQuery = async ( event, field ) => { // fetch matches
            // Fetch Results
            fields[ field ].spinner = true

            const srch_str = event.detail.trim( ),
                getArgs = ( field ) => {
                    const args = { 
                        street_name: { name: fields[ field ].val },
                    
                    }

                    return args[ field ]

                },
                getAPIURL = ( field ) => {
                    const urls = {
                        street_name: `/api/validate/road`,

                    }

                    return urls[ field ]
                    
                },
                response = await fetch( `${getAPIURL( field )}?${json2URL( getArgs( field ) )}` ), 
                json = ( response.ok ? await response.json( ) : [ ] )

                fields[ field ] = { ...fields[ field ], items:json, spinner: false, nomatch: false }

            if( fields[ field ].items.length === 0 ) 
                fields[ field ].nomatch = true


        }, 
        
        handleHit = ( event, field ) => { 
            switch( field ){
                case "narrow":
                    const arr = [ "juris", "neigh_code", "street_name" ]

                    arr.forEach( fld => { 
                        if( fields.hasOwnProperty( fld ) ){
                            
                            fields[ fld ].use = ( event.detail.value === fld ) 

                        }
                        
                    } )
                    break

                case "parcel_acreage":
                    fields.land_size_acreage.use = ( event.detail.value === 1 )
                    fields.land_size_no_acreage.use = ( event.detail.value === 0 )
                    break

                case "prop_use":
                    const dwellings = [ "Single-Family", "Multi-Family", "Manufactured", "Condo/Townhome" ],
                        bldg_fields = [ "year_built", "square_feet", "bedroom", "fullbath", "exterior_frame", "story_type" ],
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
        
        validate = ( ) => {
            const check_fields = Object.entries( fields )
                                    .filter( ( [ key, value] ) => value.hasOwnProperty( "rules" ) && value.use )
                                    .map( elem => elem[ 0 ] ),
                verdict = validateForm( filterObj( fields, check_fields ) )

            fields = { ...fields, ...verdict.fields }

            if( verdict.valid ){
                let query_params = { }

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

                last_hit.set( { type: "ANALYSIS", ...query_params, page: 1, view: "property" } )
                searchdrawer.set( false )

                console.log( query_params )

                goto( `/analysis/params?${json2URL( query_params )}` )

            }

        },

        reset = ( ) => {
            fields = initial_state

        }
 
    onMount( async ( ) => {
        let jsons

        const api_args = {
            prop_use: {
                table: "dbo.Polaris_Buildings as bldgs",
                columns: "bldgs.BuildingCategoryDescription as value, UPPER(bldgs.BuildingCategoryDescription) as label",
                filter: "LEN(LTRIM(RTRIM(bldgs.BuildingCategoryDescription))) > 0",
                group: "bldgs.BuildingCategoryDescription"

            },
            neigh_code: {
                table: "dbo.Polaris_AllParceldata as parcels",
                columns: "parcels.Neighborhood as value, parcels.Neighborhood as label",
                group: "parcels.Neighborhood",
                sort: "parcels.Neighborhood",

            },
            land_size_acreage: {
                table: "(SELECT parcels.LandSize FROM dbo.Polaris_AllParceldata as parcels WHERE parcels.LandUnitDescription in ( 'ACRE', 'CALC AREA', 'SMALL ACRE' ) UNION SELECT parcels.LandSize/43560 FROM dbo.Polaris_AllParceldata as parcels WHERE parcels.LandUnitDescription in ( 'SQUARE FEET' )) as np",
                columns: "min(np.LandSize) as land_size_min, max(np.LandSize) as land_size_max",

            },
            land_size_no_acreage: {
                table: "dbo.Polaris_AllParceldata as parcels",
                columns: "min(parcels.LandSize) as land_size_min, max(parcels.LandSize) as land_size_max",
                filter: "parcels.LandUnitDescription in ( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' )",

            },
            market_value: {
                table: "dbo.Polaris_AllParceldata as parcels",
                columns: "min(parcels.TotalMarketValue) as market_value_min, max(parcels.TotalMarketValue) as market_value_max",

            },
            sales_price: {
                table: "dbo.Polaris_AllParceldata as parcels",
                columns: "min(parcels.SalePrice) as sale_price_min, max(parcels.SalePrice) as sale_price_max",

            },
            square_feet: {
                table: "dbo.Polaris_Buildings",
                columns: "min(totalarea) as square_feet_min, max(totalarea) as square_feet_max",
                filter: "totalarea is NOT NULL",

            },
            exterior_frame: {
                table: "dbo.Polaris_Buildings",
                columns: "extwall as value, extwall as label",
                filter: "LEN(extwall) > 0",
                group: "extwall",
            },
            story_height: {
                table: "dbo.Polaris_Buildings",
                columns: "storyheight as value, storyheight as label",
                filter: "LEN(storyheight) > 0",
                group: "storyheight",
            }

        },
        urls = [
            //prop_use
            `/api/query/cama?${json2URL( api_args.prop_use )}`,
            //neigh_code
            `/api/query/cama?${json2URL( api_args.neigh_code )}`,
            //land_size_acreage
            `/api/query/cama?${json2URL( api_args.land_size_acreage )}`,
            //land_size_no_acreage
            `/api/query/cama?${json2URL( api_args.land_size_no_acreage )}`,
            //market_value
            `/api/query/cama?${json2URL( api_args.market_value )}`,
            //sales_price
            `/api/query/cama?${json2URL( api_args.sales_price )}`,
            //square_feet
            `/api/query/cama?${json2URL( api_args.square_feet )}`,
            //exterior_frame
            `/api/query/cama?${json2URL( api_args.exterior_frame )}`,
            //story_height
            `/api/query/cama?${json2URL( api_args.story_height )}`,
                    
        ]

        // Fetch Results
        jsons = await Promise.all( urls.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
       
        //prop_use
        fields.prop_use.items = sortArrayofObjs( [ { label: "VACANT LAND", "value": "Vacant Land" }, ...jsons[ 0 ] ], "value" )
        fields.prop_use.selected = fields.prop_use.items.findIndex( item => item.value == "Single-Family" )
        fields.prop_use.val = fields.prop_use.items[ fields.prop_use.selected ].value

        //neigh_code
        fields.neigh_code.items = sortArrayofObjs( jsons[ 1 ], "value" )
        fields.neigh_code.selected = 0
        fields.neigh_code.val = fields.neigh_code.items[ fields.neigh_code.selected ].value

        //land_size
        fields.land_size_acreage = {
            ...fields.land_size_acreage,
            absolute_min: jsons[ 2 ][ 0 ].land_size_min, 
            absolute_max: jsons[ 2 ][ 0 ].land_size_max, 
        }
        fields.land_size_no_acreage = {
            ...fields.land_size_no_acreage,
            absolute_min: jsons[ 3 ][ 0 ].land_size_min, 
            absolute_max: jsons[ 3 ][ 0 ].land_size_max, 
        }
        
        //market_value
        fields.market_value = { 
            ...fields.market_value, 
            absolute_min: jsons[ 4 ][ 0 ].market_value_min, 
            absolute_max: jsons[ 4 ][ 0 ].market_value_max, 

        }

        //sales_price
        fields.sale_price = { 
            ...fields.sale_price, 
            absolute_min: jsons[ 5 ][ 0 ].sale_price_min, 
            absolute_max: jsons[ 5 ][ 0 ].sale_price_max, 

        }

        //square_feet
        fields.square_feet = { 
            ...fields.square_feet, 
            absolute_min: jsons[ 6 ][ 0 ].square_feet_min, 
            absolute_max: jsons[ 6 ][ 0 ].square_feet_max, 

        }

        //exterior frame
        fields.exterior_frame.items = [ ...fields.exterior_frame.items, ...sortArrayofObjs( jsons[ 7 ], "value" ) ]
        fields.exterior_frame.selected = fields.exterior_frame.items.findIndex( item => item.value == null )
        fields.exterior_frame.val = fields.exterior_frame.items[ fields.exterior_frame.selected ].value

        //story type
        fields.story_type.items = [ ...fields.story_type.items, ...sortArrayofObjs( jsons[ 8 ], "value" ) ]
        fields.story_type.selected = fields.story_type.items.findIndex( item => item.value == null )
        fields.story_type.val = fields.story_type.items[ fields.story_type.selected ].value

        initial_state = fields

        messenger.subscribe( async msgs => { 
            const idx =  msgs.findIndex( msg => msg.type === "set_neigh_code" )

            if( idx > -1 )
                fields.neigh_code.selected = fields.neigh_code.items.findIndex( item => item.value == msgs[ idx ].neigh_code )

        } )

        rsltados.subscribe( async value => { 
            _rsltados = value

            if( _rsltados.length > 0 ){
                const geom = _rsltados[ 0 ].geom ?? null 

                if( geom && fields.narrow.items.length === 3 )
                    fields.narrow.items.push( { value: "buffer", label: "BUFFER SELECTED PROPERTY" } )

            }
            

        } )
        
    } )
    
</script>