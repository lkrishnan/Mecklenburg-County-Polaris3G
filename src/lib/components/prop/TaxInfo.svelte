<div class="mb-4 border border-primero bg-luz  rounded shadow-lg">
    <Heading title="Tax Information" iconname="payment" />
    <LinkList links={links} />
    
</div>

<script>
    import { onMount } from "svelte"
    import Heading from "$lib/components/Heading.svelte"
	import LinkList from "$lib/components/LinkList.svelte"

    // component props
    export let pid = null
    export let assessproid = null

    let links = [ ],
        mounted = false

    const handleInfoChange = ( _pid, _assessproid, _mounted ) => {
            if( _mounted ){
                links = [  
                    { label: "Tax Values & Building Information", url: `https://property.spatialest.com/nc/mecklenburg/#/property/${_assessproid}` },
                    { label: "Tax Bill Information", url: `https://taxbill.co.mecklenburg.nc.us/publicwebaccess/BillSearchResults.aspx?ParcelNum=${_pid}` },
                    { label: "Tax Foreclosure Properties", url: `https://tax.mecknc.gov/services/tax-foreclosure-properties` },

                ]

            }
            
        }

    onMount( ( ) => {
        mounted = true
        
    } )

    //reactives
    $: { handleInfoChange( pid, assessproid, mounted ) }

</script>