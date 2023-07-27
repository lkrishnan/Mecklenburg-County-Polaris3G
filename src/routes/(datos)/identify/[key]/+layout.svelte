<div class="pt-2 text-sm">
    <Heading title="Identify Location" iconname="pushpin" />
    <InfoTable infos={infos} />
    
    <Heading title="Layer List" iconname="maplegend" />
    <div class="mb-4 p-2">
        <div class="mb-2">Choose a layer from the dropdown to see field values.</div>
        <Selecto on:hit={handleHit} items={items} selected={selected}/>
    </div>
    
    <Heading title="Layer Attributes" iconname="maplegend" />
    
</div>

<main class="px-2">
	<slot/>
</main>

<script>
	/** @type {import('./$types').LayoutData} */
    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import Selecto from "$lib/components/Selecto.svelte"
    import { goto } from "$app/navigation"

    export let data

    console.log( data )

    let items= [ 
            { id: "juris", value: "Jurisdictions" },         
            { id: "mat", value: "Master Address Table" },
            
        ],
        selected = items.findIndex( item => item.id === data.dataset )

    const infos = [ 
        { label: "XY Coord", value: `${data.x}, ${data.y}` },
        { label: "Lat Lon", value: `${data.lat}, ${data.lng}` },
        { label: "USNG", value: data.usng }
    ],

    handleHit = event => {
        goto( `/identify/${data.x},${data.y}/${event.detail.id}` )

    }
        

    

</script>
