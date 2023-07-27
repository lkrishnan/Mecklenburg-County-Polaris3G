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
    import { null2empty } from "$lib/utils"
    import { formatDeed, formatMoney } from "$lib/format"
    import LinkList from "$lib/components/LinkList.svelte"
    import Heading from "$lib/components/Heading.svelte"
        
    // component props
    export let pid = null
    export let sale = [ ]

    let links = [ ],
        infos = [ ]

    //reactives
    $: if( pid && sale.length > 0 ){

        let _infos = [ ]

        for( let i = sale.length-1; i >= 0; i-- ){ //descending order
			//const deed =  null2empty( sale[ i ].deed_book ).replace( /  +/g, " " ).split( " " )

            //console.log( sale[ i ] )
										
            _infos.push( { 
                //"deed": formatDeed( ( deed.length === 2 ? deed[ 0 ] : "" ), ( deed.length === 2 ? deed[ 1 ] : "" ), sale[ i ].sale_date ), 
                "deed": formatDeed( sale[ i ]. legal_reference, sale[ i ].sale_date ),
                "sale_date":  sale[ i ].sale_date,
                "sale_price": formatMoney( sale[ i ].sale_price ) 

            } )
			
        }

        infos = _infos

        links = [  
            { label: "Recorded Deeds and Maps (03/01/1990 to Current)", url: `http://meckrod.manatron.com` },
            { label: "Recorded Deeds and Maps (02/28/1990 and Prior)", url: `http://meckrodhistorical.com` },

        ]

    }

</script>