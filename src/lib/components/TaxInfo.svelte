<div class="mb-4 border border-primero bg-luz  rounded shadow-lg">
    <Heading title="Tax Information" iconname="payment" />
    <LinkList links={links} />
    
</div>

<script>
    import Heading from "$lib/components/Heading.svelte";
	import LinkList from "$lib/components/LinkList.svelte"

    // component props
    export let pid = null
    export let main = null

    let links = [ ]

    //reactives
    $: if( pid && main ){
        links = [  
            { label: "Tax Values & Building Information", url: `https://property.spatialest.com/nc/mecklenburg/#/property/${main[ 0 ].account_no}` },
            { label: "Tax Bill Information", url: `https://taxbill.co.mecklenburg.nc.us/publicwebaccess/BillSearchResults.aspx?ParcelNum=${pid}` },
            { label: "Tax Foreclosure Properties", url: `https://tax.mecknc.gov/services/tax-foreclosure-properties` },

        ]

    }

</script>