<div class="pt-2 text-sm">
    <Heading title="Point of Interest: Park" iconname="pushpin" />
    <InfoTable infos={infos} />
    <div class="p-2 border-y border-primero">
        <QuickButtons btns={btns} on:click={handleClick}/>
    </div>
    
</div>

<script>
	import { poi } from "$lib/store.js"   
    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"
    
    let infos = [ ],
        btns = [ ]

    const handleClick = event => {
        if( event.detail.icon === "nearby" ){
            const hit = { value: `${_poi.x},${_poi.y}`, type: "NEARBY", nearby: `${_poi.x},${_poi.y}` }
			
            last_hit.set( hit )
			goto( `/${hit.type.toLowerCase( )}/${srchstr2qrystr( hit.value ) }` )

        }

    }

    poi.subscribe( async value => {
        if( Object.keys( value ).length > 0 ){
            
            infos = [ 
                { label: "Name", value: value.name  }, 
                { label: "Address", value: value.address  }, 
                { label: "Type", value: value.prktype },
                { label: "XY Coord", value: `${value.x}, ${value.y}` },
                { label: "Lat Lon", value: `${value.lat}, ${value.lng}` },
                { label: "USNG", value: value.usng }
            ]

            btns = [ 
                { label: "Parks Nearby", icon: "park", link: `https://mcmap.org/geoportal/#${value.lng},${value.lat}/parks` },
                { label: "Park Explorer", icon: "link", link: `https://maps.mecklenburgcountync.gov/MecklenburgCountyParkExplorer` },
                { label: "Nearby Prop", icon: "nearby" },
            ]

        }

    } )

</script>