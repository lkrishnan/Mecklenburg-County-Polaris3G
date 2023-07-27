<div class="pt-2 text-sm">
    <Heading title="Point of Interest: Light Rail" iconname="pushpin" />
    <InfoTable infos={infos} />
    <div class="p-2 border-y border-primero">
        <QuickButtons btns={btns} on:click={handleClick}/>
    </div>
    
</div>

<script>
	import { poi, last_hit } from "$lib/store.js"   
    import {formatAddr} from "$lib/format"
    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"
    import { goto } from "$app/navigation"
    import { srchstr2qrystr } from "$lib/utils"
    
    let infos = [ ],
        btns = [ ],
        _poi

    const handleClick = event => {
        if( event.detail.icon === "nearby" ){
            const hit = { value: `${_poi.x},${_poi.y}`, type: "NEARBY", nearby: `${_poi.x},${_poi.y}` }
			
            last_hit.set( hit )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

    }

    poi.subscribe( async value => {
        if( Object.keys( value ).length > 0 ){
            _poi = value
            
            infos = [ 
                { label: "Name", value: value.name  }, 
                { label: "Address", value: formatAddr( { address: value.address, city: value.city, state: value.state } ) }, 
                { label: "XY Coord", value: `${value.x}, ${value.y}` },
                { label: "Lat Lon", value: `${value.lat}, ${value.lng}` },
                { label: "USNG", value: value.usng }
            ]

            btns = [ 
                { label: "CATS Website", icon: "link", link: `https://www.charlottenc.gov/CATS/Rail` },
                { label: "Nearby Prop", icon: "nearby" },

            ]
            
        }

    } )

</script>