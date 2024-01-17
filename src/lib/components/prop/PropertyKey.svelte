<div class="mb-4 border border-primero bg-luz rounded shadow-lg">
    <Heading title="Property Key" iconname="key"  />

    {#if _mobile && _dual }
        <div class="absolute top-0 right-0 mx-3 my-1">
            <button 
                class="p-1.5 fill-lienzo rounded-full group hover:bg-lienzo hover:text-primero hover:fill-primero"
                on:click="{dual.set( !_dual )}"
            >
                {@html icon( "expandless", 24, 24 )}
                    
            </button>

            <button 
                class="p-1.5 fill-lienzo rounded-full group hover:bg-lienzo hover:text-primero hover:fill-primero"
                on:click="{datadrawer.set( !_datadrawer )}"
            >
                {@html icon( "expandmore", 24, 24 )}
                    
            </button>
            
        </div>
    
    {/if}
    
    <!-- PID and GISID -->
    <table class="w-full text-left mb-2">
        <thead>
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Parcel ID
                </th>
                <th class="px-4 py-2">
                    GIS ID
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="px-4 py-2">
                    {pid}
                </td>
                <td class="px-4 py-2">
                    {gisid}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Address -->
    <table class="w-full text-left  mb-2">
        <thead class="text-sm font-normal">
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Address located on Property (Postal City)
                </th>
            </tr>
        </thead>
        <tbody>
            {#if mats.length > 1}
                <tr>
                    <td class="px-4 py-2">
                        <Selecto on:hit={handleHit} items={mats.map( row => ( { ...row, value: row.address, label: row.address } ) )} selected={mats.findIndex( row => row.matid === matid )} />
                        
                    </td>
                </tr>
            {:else}
                <tr>
                    <td class="px-4 py-2">
                        {( address ? address : "NA" )}
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>

    <!-- Ownership -->
    <table class="w-full text-left mb-2">
        <thead class="text-sm font-normal">
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Ownership
                </th>
            </tr>
        </thead>
        <tbody>
            {#if owners.length > 0}
                {#each owners as owner, i}
                    <tr>
                        <td class="px-4 py-2 align-top">
                            {i+1}. {owner}
                        </td>
                        
                    </tr>
                    
                {/each}
            {:else}
                <tr>
                    <td class="px-4 py-2 align-top">
                        NA
                    </td>
                    
                </tr>
            {/if}
            
        </tbody>
    </table>

    
    <!-- Mailing Address -->
    <table class="w-full text-left  mb-2">
        <thead class="text-sm font-normal">
            <tr class="border-b border-primary">
                <th class="px-4 py-2">
                    Tax Billing Address
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="px-4 py-2">
                    {@html ( mailing_addr ? mailing_addr : "NA" ) }
                </td>
            </tr>
        </tbody>
    </table>

     <!-- Buttons -->
     <div class="mb-4 border-y border-primero">
        <div class="p-2">
            <QuickButtons btns={btns} justify="center" on:click={handleClick}/>
        </div>
        
        {#if show}
            <div in:fly="{{ y: -50, duration: 750 }}" out:fly="{{ y: -50, duration: 750 }}">
                {#if last_quick_btn === "circle"}
                    <form class="p-2" 
                        on:submit|preventDefault={handleBuffer}
                    >
                        <div class="flex flex-row gap-4">
                            <input 
                                type="text" 
                                class="border {fields.buffer.error ? 'border-pop' : 'border-primero' } text-sm rounded block w-full p-2.5" placeholder="Buffer Size (0 - 5280) ft." 
                                bind:value="{fields.buffer.val}"
                            />
                            <button class="bg-pop border border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Go
                            </button>

                        </div>
                        
                        <p class="{fields.buffer.error ? '' : 'hidden' } mt-2 ml-2 text-pop text-xs italic">{fields.buffer.error}</p>
                    </form>
                {:else if last_quick_btn === "agent"}
                    <!-- Issues -->
                    <LinkList links={issues} title="Report Issues" />

                {/if}

            </div>
            
        {/if}

    </div>

    <!-- Building Photo -->
    <BuildingPhoto photo_url={photo.photo_url} photo_date={photo.photo_date} />

    <!-- Links -->
    <LinkList links={links} />
            
</div>

<script>
    import {onMount} from "svelte"
    import {goto} from "$app/navigation"
    import {fly} from "svelte/transition"
    import {messenger, mobile, dual, datadrawer} from "$lib/store.js"    
    import {srchstr2qrystr, icon} from "$lib/utils"
    import {validateForm, validateNumeric} from "$lib/validate"
    import BuildingPhoto from "$lib/components/BuildingPhoto.svelte"
    import Heading from "$lib/components/Heading.svelte"
    import LinkList from "$lib/components/LinkList.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"
    import Selecto from "$lib/components/Selecto.svelte"
	

    // component props
    export let pid = null
    export let gisid = null
    export let matid = null
    export let address = null
    export let mats = [ ]
    export let lat = null
    export let lng = null
    export let x = null
    export let y = null
    export let mailing_addr = null
    export let owners = [ ]

    //Store Variables
    let _mobile,
        _dual,
        _datadrawer

    //Other Variables
    let photo = { photo_url: null, photo_date: null, },
        links = [ ],
        issues = [ 
            { label: "Wrong Property Information or Map", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/d024bf6c-b9b0-4cf5-a7d9-7ac376f0370c" },    
            { label: "Wrong Mailing Address", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/0314aa67-0083-4905-9b29-a571be01717e" },
            { label: "Address or Road Issues", url: "https://meckgov.maps.arcgis.com/apps/webappviewer/index.html?id=0068439ff27f430abe04082770d2bfea" },
            { label: "Other Website Issues", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/7e935f44-bba6-4a6c-9887-de89bae68c8c" }

        ],
        btns = [ ],
        last_quick_btn = null,
        fields = {
            buffer: { 
                val: null,
                rules: [
                    v => ( !v ? "Buffer is required" : null ),
                    v => ( validateNumeric( v ) && parseInt( v ) > -1 && parseInt( v ) <= 5280 ? null : "Buffer should be a number between 0 - 5280 ft." ),

                ]

            },

        },
        mounted = false,
        show = false
        
        

        const handleHit = event => {
            goto( `/address/${srchstr2qrystr( event.detail.matid )}` )

        },

        handleClick = event => {
            switch( event.detail.icon ){
                case "zoomin":
                    messenger.set( [ { type: "zoom_to_parcel_graphic" } ] )    
                    break

                case "uncheck":
                    goto( `/` )    
                    break

                case "circle": case "agent":
                    show = true
                    break
                
            }

            last_quick_btn = event.detail.icon
                            
        },
        
        handleBuffer = ( ) => {
            const verdict = validateForm( fields )
            fields = verdict.fields

            if( verdict.valid ){
                const hit = { value: `${gisid}|${fields.buffer.val}`, type: "BUFFER", buffer: `${gisid}|${fields.buffer.val}`, page:1, view: "deed" }

                goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

            }

        },

        handleInfoChange = async ( _pid, _gisid, _matid, _address, _mats, _lat, _lng, _x, _y, _mailing_addr, _owners , _mounted ) => {
            if( _mounted ){
                btns = [ 
                        { label: "Property Report", icon: "pdf", link: `/pdf/detail?pid=${_pid + (_matid ? "&matid="+_matid : "" )}`, width: "48px" },
                        { label: "Report Issues", icon: "agent", width: "48px" },
                        { label: "Unselect Prop", icon: "uncheck", width: "48px" },
                        ...( _gisid ? [ { label: "Buffer Search", icon: "circle", width: "48px" }, { label: "ZoomTo Prop", icon: "zoomin", width: "48px" } ] : [ ] ),
                     
                    ]

                links = [ 
                    //Google Street View
                    ...( _lat && _lng ? [ { label: "Google Street View <span class='text-pop'>(Use for recent building photos)</span>", url: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${_lat},${_lng}` } ] : [ ] ),
           
                    //Meckscope
                    ...( _lat && _lng ? [ { label: "Birdseye View maintained by Mecklenburg County", url: `http://maps.co.mecklenburg.nc.us/meckscope/?lat=${_lat}&lon=${_lng}` } ] : [ ] ),

                    { label: "Download Map Layers", url : "http://maps.co.mecklenburg.nc.us/openmapping/" }
            
                ]

                if( _gisid ){
                    const response = await fetch( `/api/query/tax/photo?gisid=${gisid}` ),
                        rows = await response.json( )

                    photo = ( rows.length > 0 ? rows[ 0 ] : { photo_url: null, photo_date: null, } )

                }else
                    photo = { photo_url: null, photo_date: null, }

                show = false

                //ootha.scrollIntoView();

            }
            
        }

    onMount( async ( ) => {
        mounted = true
        
    } )

    dual.subscribe( value => { _dual = value })
    mobile.subscribe( value => { _mobile = value })
    datadrawer.subscribe( value => { _datadrawer = value } )

    //reactives
    $: { handleInfoChange( pid, gisid, matid, address, mats, lat, lng, x, y, mailing_addr, owners, mounted ) }

</script>