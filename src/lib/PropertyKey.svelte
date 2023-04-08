{#if pid}
    <div class="px-4 pt-2 pb-4 text-sm">
        <div class="flex pb-2">
            <div class="flex-none w-8">
                <calcite-icon icon="key" scale="m" class="w-6 h-6 stroke-title"></calcite-icon>
            </div>
            <div class="grow font-bold text-lg text-title">
                Property Key
            </div>
        </div>

        <!-- PID and GISID -->
        <table class="w-full text-left text-primary mb-2">
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
        <table class="w-full text-left text-primary mb-2">
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
                            <Selecto on:hit={handleHit} items={grndaddrs} selected={grndaddrs.findIndex( row => row.matid === matid )}/>
                            
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
        <table class="w-full text-left text-primary mb-2">
            <thead class="text-sm font-normal">
                <tr class="border-b border-primary">
                    <th class="px-4 py-2">
                        Owner Name
                    </th>
                    <th class="px-4 py-2">
                        Mailing Address
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each owners as owner}
                    <tr>
                        <td class="px-4 py-2">
                            {concatArr( [ owner.first_name, owner.last_name ] ) }
                        </td>
                        <td class="px-4 py-2">
                            {@html concatArr( [ concatArr( [ owner.address_1, owner.address_2 ] ), concatArr( [ owner.city, owner.state, owner.zipcode ] ) ], "<br/>" )}
                        </td>
                    </tr>
                    
                {/each}
            </tbody>
        </table>

        <!-- Buttons -->
        <div class="w-full mb-2 flex justify-center p-2 gap-2">
            {#if matid && pid && gisid && x && y} 
                <a
                    href='https://polaris3g.mecklenburgcountync.gov/ws/php/v1/report_prop.php?mat={matid}&xcoord=${x}&ycoord=${y}&pid=${pid}&gisid=${gisid}'
                    class="bg-signify text-signifytxt rounded p-2.5 hover:shadow-lg hover:bg-sky-600"
                    target='_blank'
                    rel='noreferrer'
                >
                    Prop Report
                </a>
            {/if}
            
            <button 
                type="button"
                class="bg-signify text-signifytxt rounded p-2.5 hover:shadow-lg hover:bg-sky-600"
            >
                Buffer
            </button>
            
            <button 
                type="button"
                class="bg-signify text-signifytxt rounded p-2.5 hover:shadow-lg hover:bg-sky-600"
            >
                Zoom To
            </button>
    
            <button 
                type="button"
                class="bg-signify text-signifytxt rounded p-2.5 hover:shadow-lg hover:bg-sky-600"
            >
                Unselect Prop
            </button>
        </div>

        <!-- Building Photo -->
        <BuildingPhoto photo_url={photo.photo_url} photo_date={photo.photo_date} />

        <!-- Links -->
        <table class="w-full text-left text-primary mb-2">
            <thead class="text-sm font-normal">
                <tr class="border-b border-primary">
                    <th class="px-4 py-2">
                        Link To
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each links as link}
                    <tr>
                        <td class="px-4 py-2">
                            <a 
                                class="text-signify underline underline-offset-4 hover:text-sky-600" 
                                href='{link.url}' 
                                target='_blank' 
                                rel='noreferrer'
                            >
                                {@html link.label}
                                
                            </a>
                        </td>
                    </tr>
                    
                {/each}
            </tbody>
        </table>
    
        <!-- Issues -->
        <table class="w-full text-left text-primary mb-2">
            <thead class="text-sm font-normal">
                <tr class="border-b border-primary">
                    <th class="px-4 py-2">
                        Report Issues
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each issues as issue}
                    <tr>
                        <td class="px-4 py-2">
                            <a 
                                class="text-error underline underline-offset-4 hover:text-signify" 
                                href='{issue.url}' 
                                target='_blank' 
                                rel='noreferrer'
                            >
                                {issue.label}
                                
                            </a>
                        </td>
                    </tr>
                    
                {/each}

            </tbody>

        </table>
    
    </div>
{/if}
<script>
    import { last_hit } from "$lib/store.js"    
    import { goto } from "$app/navigation"
    import { concatArr } from "$lib/formatStr"
    import { srchstr2qrystr } from "$lib/utils"
    import Selecto from "$lib/Selecto.svelte"
    import BuildingPhoto from "$lib/BuildingPhoto.svelte"

    // component props
    export let pid = null
    export let gisid = null
    export let matid = null
    export let address = null
    export let lat = null
    export let lng = null
    export let x = null
    export let y = null
    export let owners = [ ]

    let grndaddrs = [ ],
        photo = { photo_url: null, photo_date: null, },
        links = [ ],
        issues = [ 
            { label: "Wrong Ownership or Parcel", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/d024bf6c-b9b0-4cf5-a7d9-7ac376f0370c" },
            { label: "Wrong Mailing Address", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/0314aa67-0083-4905-9b29-a571be01717e" },
            { label: "Other Website Issues", url: "https://mecklenburgcountync-563955.workflowcloud.com/forms/7e935f44-bba6-4a6c-9887-de89bae68c8c" }

        ]

    const handleHit = event => {
            last_hit.set( { ...event.detail, type: "ADDRESS", value: event.detail.address } )
            goto( `/address/${srchstr2qrystr( event.detail.address )}` )

        },

        setGrndAddrs = async ( ) => {
            grndaddrs.length = 0
            
            const response = await fetch( `/api/address?gisid=${gisid}` ),
                rows = await response.json( )

            grndaddrs = rows.map( row => { return { 
                matid: row.matid, 
                matpid: row.matpid, 
                address: row.address, 
                lat: row.lat, 
                lng: row.lng, 
                x: row.x, 
                y: row.y 

            } } )
        
        },

        setOwners = async ( ) => {
            const response = await fetch( `/api/parcel/owner?pid=${pid}&get=info` ),
                rows = await response.json( )

            owners =  rows.sort( ( r1, r2 ) => ( r1.owner_number > r2.owner_number) ? 1 : (r1.owner_number < r2.owner_number) ? -1 : 0 )   

        },

        setPhoto = async ( ) => {
            const response = await fetch( `/api/parcel/building/photo?gisid=${gisid}` ),
                rows = await response.json( )

            //photo = { photo_url: "https://finslive.mecklenburgcountync.gov/api/v1/creekcam/9", photo_date: "20170205" }

            if( rows.length > 0 )
                photo = rows[ 0 ]
            else
                photo = { photo_url: null, photo_date: null, }

            console.log( photo )
            
        },
        setLinks = ( ) => {
            links = [ 
                    //Google Street View
                    ...( lat && lng ? [ { label: "Google Street View <span class='text-alert'>(Use for recent building photos)</span>", url: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}` } ] : [ ] ),
                
                    //Meckscope
                    ...( lat && lng ? [ { label: "Birdseye View maintained by Mecklenburg County", url: `http://maps.co.mecklenburg.nc.us/meckscope/?lat=${lat}&lon=${lng}` } ] : [ ] ),

                    { label: "Download Map Layers", url : "http://maps.co.mecklenburg.nc.us/openmapping/" }
                
                ]

        }

    //reactives

    $: if( pid )
        setOwners( )

    $: if( matid && ( gisid === pid ) )
        setGrndAddrs( )

    $: if ( gisid )
        setPhoto( )

    $: if( lat && lng )
        setLinks( )
        
</script>

