<div class="mb-4 border border-primero bg-luz  rounded shadow-lg">
    <Heading title="Deed and Sale Price" iconname="realestateagent" />

    {#if sale.length > 0}
        <table class="w-full text-left text-primary mb-2">
            <thead>
                <tr class="border-b border-primary">
                    <th class="px-4 py-2">
                        Deed
                    </th>
                    <th class="px-4 py-2">
                        Sale Date
                    </th>
                    <th class="px-4 py-2">
                        Sale Price
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each infos as info}
                <tr>
                    <td class="px-4 py-2">
                        {@html info.deed}
                    </td>
                    <td class="px-4 py-2">
                        {info.sale_date }
                    </td>
                    <td class="px-4 py-2">
                        {info.sale_price }
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    {/if}
    
    <!-- Link To -->
    <LinkList links={links} />

</div>

<script>
    import { onMount } from "svelte"
    import { formatDeed, formatMoney, formatDate } from "$lib/format"
    import LinkList from "$lib/components/LinkList.svelte"
    import Heading from "$lib/components/Heading.svelte"
        
    // component props
    export let sale = [ ]

    let links = [ ],
        infos = [ ],
        mounted = false

    const handleInfoChange = ( _sale, _mounted ) => {
            if( _mounted ){
                infos = _sale.map( item => ( { 
                    "deed": formatDeed( item.legal_reference, item.sale_date ),
                    "sale_date":  formatDate( item.sale_date ),
                    "sale_price": formatMoney( item.sale_price ) 

                } ) )

                links = [  
                    { label: "Recorded Deeds and Maps (03/01/1990 to Current)", url: `http://meckrod.manatron.com` },
                    { label: "Recorded Deeds and Maps (02/28/1990 and Prior)", url: `http://meckrodhistorical.com` },

                ]

            }
            
        }

    onMount( ( ) => {
        mounted = true
        
    } )

    //reactives
    $: { handleInfoChange( sale, mounted ) }

</script>