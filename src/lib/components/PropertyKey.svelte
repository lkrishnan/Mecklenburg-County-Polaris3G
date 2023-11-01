{#if pid}
    <div class="mb-4 border border-primero bg-luz rounded shadow-lg">
        <Heading title="Property Key" iconname="key" />

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
                {#if grndaddrs.length > 1}
                    <tr>
                        <td class="px-4 py-2">
                            <Selecto on:hit={handleHit} items={grndaddrs} selected={grndaddrs.findIndex( row => row.matid === matid )} />
                            
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

         <!-- Address -->
         <table class="w-full text-left  mb-2">
            <thead class="text-sm font-normal">
                <tr class="border-b border-primary">
                    <th class="px-4 py-2">
                        Mailing Address
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
        <div class="p-2 mb-4 border-y border-primero">
            <QuickButtons btns={btns} justify="center" on:click={handleClick}/>
            
            {#if show_buffer_srch}
                <form in:fly="{{ y: -50, duration: 2000 }}" out:fly="{{ y: -50, duration: 2000 }}" 
                    class="p-2" 
                    on:submit|preventDefault={handleBuffer}
                >
                    <!--<label for="minmax-range" class="block mb-2 text-sm font-medium">Buffer Size (0 - 5280) ft.</label>
                    <input 
                        id="minmax-range" 
                        type="range" 
                        min="100" max="5280" bind:value="{buffer_size}" 
                        class="w-full h-2 bg-suave rounded-lg appearance-none cursor-pointer accent-primero dark:bg-gray-700"
                        on:input={event=>{console.log( buffer_size )}}
                    >-->
                    
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

            {/if}

        </div>

        <!-- Building Photo -->
        <BuildingPhoto photo_url={photo.photo_url} photo_date={photo.photo_date} />

        <!-- Links -->
        <LinkList links={links} />
            
        <!-- Issues -->
        <LinkList links={issues} title="Report Issues" color="pop" />
    
    </div>
{/if}

<script>
    import { last_hit } from "$lib/store.js"    
    import { goto } from "$app/navigation"
    import { srchstr2qrystr } from "$lib/utils"
    import Selecto from "$lib/components/Selecto.svelte"
    import BuildingPhoto from "$lib/components/BuildingPhoto.svelte"
    import Heading from "$lib/components/Heading.svelte"
    import LinkList from "$lib/components/LinkList.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"
    import { fly } from "svelte/transition"
    import { validateForm, validateNumeric } from "$lib/validate"

    // component props
    export let pid = null
    export let gisid = null
    export let matid = null
    export let address = null
    export let lat = null
    export let lng = null
    export let x = null
    export let y = null
    export let mailing_addr = null
    export let owners = [ ]

    let grndaddrs = [ ],
        photo = { photo_url: null, photo_date: null, },
        links = [ ],
        issues = [ 
            { label: "Wrong Ownership or Parcel", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/d024bf6c-b9b0-4cf5-a7d9-7ac376f0370c" },
            { label: "Wrong Mailing Address", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/0314aa67-0083-4905-9b29-a571be01717e" },
            { label: "Other Website Issues", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/7e935f44-bba6-4a6c-9887-de89bae68c8c" }

        ],
        btns = [ ],
        show_buffer_srch = false,
        fields = {
            buffer: { 
                val: null,
                rules: [
                    v => ( !v ? "Buffer is required" : null ),
                    v => ( validateNumeric( v ) && parseInt( v ) > -1 && parseInt( v ) <= 5280 ? null : "Buffer should be a number between 0 - 5280 ft." ),

                ]

            },

        }

    const handleHit = event => {
            last_hit.set( { ...event.detail, type: "ADDRESS" } )
            goto( `/address/${srchstr2qrystr( event.detail.address )}` )

        },

        handleClick = event => {
            if( event.detail.icon === "circle" )
                show_buffer_srch = !show_buffer_srch
            
        },

        setGrndAddrs = async ( ) => {
            grndaddrs.length = 0
            
            const response = await fetch( `/api/query/gis/address?gisid=${gisid}` ),
                rows = await response.json( )

            grndaddrs = rows.map( row => { return { 
                value: row.address, 
                label: row.address,
                matid: row.matid, 
                matpid: row.matpid, 
                address: row.address, 
                lat: row.lat, 
                lng: row.lng, 
                x: row.x, 
                y: row.y 

            } } )
        
        },

        setPhoto = async ( ) => {
            const response = await fetch( `/api/query/tax/photo?gisid=${gisid}` ),
                rows = await response.json( )

            //photo = { photo_url: "https://finslive.mecklenburgcountync.gov/api/v1/creekcam/9", photo_date: "20170205" }

            if( rows.length > 0 )
                photo = rows[ 0 ]
            else
                photo = { photo_url: null, photo_date: null, }
            
        },
        setLinks = ( ) => {
            links = [ 
                    //Google Street View
                    ...( lat && lng ? [ { label: "Google Street View <span class='text-pop'>(Use for recent building photos)</span>", url: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}` } ] : [ ] ),
                
                    //Meckscope
                    ...( lat && lng ? [ { label: "Birdseye View maintained by Mecklenburg County", url: `http://maps.co.mecklenburg.nc.us/meckscope/?lat=${lat}&lon=${lng}` } ] : [ ] ),

                    { label: "Download Map Layers", url : "http://maps.co.mecklenburg.nc.us/openmapping/" }
                
                ]

        },

        handleBuffer = ( ) => {
            const verdict = validateForm( fields )
            fields = verdict.fields

            if( verdict.valid ){
                const hit = { value: `${gisid}|${fields.buffer.val}`, type: "BUFFER", buffer: `${gisid}|${fields.buffer.val}`, page:1, view: "deed" }

                last_hit.set( hit )
			    goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

            }

        }

    //reactives
    $: if ( matid && pid && gisid && x && y )
        btns.push( { label: "Prop Report", icon: "pdf", link: `https://polaris3g.mecklenburgcountync.gov/ws/php/v1/report_prop.php?mat={matid}&xcoord=${x}&ycoord=${y}&pid=${pid}&gisid=${gisid}`, width: "48px"  } )

    $: if ( gisid ){
        btns.push( { label: "Buffer Search", icon: "circle", width: "48px" }, { label: "ZoomTo Prop", icon: "zoomin", width: "48px" } )

        setPhoto( )
    }

    $: if( pid )
        btns.push( { label: "Unselect Prop", icon: "uncheck", width: "48px" } )
        

    $: if( matid && ( gisid === pid ) )
        setGrndAddrs( )
    

    $: if( lat && lng )
        setLinks( )
        
</script>

