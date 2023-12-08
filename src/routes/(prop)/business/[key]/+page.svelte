<div class="px-2 text-sm">
    <div class="mb-4 border border-primero bg-luz rounded">
        <Heading title="Point of Interest: {data.hit.type.toUpperCase( )}" iconname="pushpin" />
        <InfoTable infos={infos} />
        <div class="p-2 border-t border-primero">
            <QuickButtons btns={btns} on:click={handleClick}/>

        </div>
        
    </div>
    
</div>

<script>
    /** @type {import('./$types').PageData} */
    import {goto} from "$app/navigation"
    import {formatDecimal, formatAddr} from "$lib/format"
    import {srchstr2qrystr} from "$lib/utils"
    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"

    export let data
        
    let infos = [ ],
        btns = [ ],
        _poi

    const handleClick = event => {
            if( event.detail.icon === "nearby" )
			    goto( `/nearby/${srchstr2qrystr( `${_poi.x},${_poi.y}` ) }` )

        },

        handleLocChange = poi => {
            _poi = poi

            infos = [ 
                { label: "Name", value: _poi.name  }, 
                { label: "Address", value: formatAddr( { address: _poi.address, city: _poi.city, state: _poi.state } )  }, 
                { label: "XY Coord", value: `${_poi.x}, ${_poi.y}` },
                ...( _poi.lat && _poi.lng ? [ { label: "Lat Lon", value: `${formatDecimal( _poi.lat )}, ${ formatDecimal( _poi.lng )}` } ]: [ ] ),
                ...( _poi.usng ? [ { label: "USNG", value: `${_poi.usng}` } ] : [ ] ),
            
            ]

            btns = [ 
                { label: "Nearby Prop", icon: "nearby" },

            ]

        }

    //reactives
	$: if( data.poi )
        handleLocChange( data.poi )

</script>