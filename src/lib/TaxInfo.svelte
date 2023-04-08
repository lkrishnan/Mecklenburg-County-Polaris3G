<div class="px-4 pt-2 pb-4 text-sm bg-surface">
    <div class="flex pb-2">
        <div class="flex-none w-8">
            <calcite-icon icon="organization" scale="m" class="w-6 h-6 stroke-title"></calcite-icon>
        </div>
        <div class="grow font-bold text-lg text-title">
            Tax Information
        </div>
    </div>

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

</div>

<script>
    // component props
    export let pid = null
    export let legal = null

    let links = [ ]

    //reactives
    $: if( pid && legal ){
        links = [  
            //Tax Values & Building Information
            { label: "Tax Values & Building Information", url: `https://property.spatialest.com/nc/mecklenburg/#/property/${legal[ 0 ].account_no}` },
            
            //Tax Bill Information
            { label: "Tax Bill Information", url: `https://taxbill.co.mecklenburg.nc.us/publicwebaccess/BillSearchResults.aspx?ParcelNum=${pid}` },

            //Tax Foreclosure Properties
            { label: "Tax Foreclosure Properties", url: `https://www.mecknc.gov/TaxCollections/Pages/Tax-Foreclosure-Properties.aspx` },

        ]

    }


    

    

</script>