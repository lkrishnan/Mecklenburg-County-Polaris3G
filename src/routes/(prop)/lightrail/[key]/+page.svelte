<div class="px-2 text-sm">
    <div class="mb-4 border border-primero bg-luz rounded">
        <Heading title="Point of Interest: {data.hit.type.toUpperCase( )}" iconname="pushpin" />

        {#if _mobile && _dual }
            <div class="absolute top-0 right-0 mx-3 my-1">
                <button 
                    class="p-1.5 fill-lienzo rounded-full group hover:bg-lienzo hover:text-primero hover:fill-primero"
                    on:click="{dual.set( !_dual )}"
                >
                    {@html icon( "expandless", 24, 24 )}
                        
                </button>

                <button 
                    class="p-1.5 fill-lienzo rounded-full group hover:bg-lienzo hover:text-primero hover:fill-primero"
                    on:click="{datadrawer.set( !_datadrawer )}"
                >
                    {@html icon( "expandmore", 24, 24 )}
                        
                </button>
                
            </div>
        
        {/if}
        
        <InfoTable infos={infos} />
        <div class="p-2 border-t border-primero">
            <QuickButtons btns={btns} on:click={handleClick}/>

        </div>
        
    </div>
    
</div>

<script>
    /** @type {import('./$types').PageData} */
    import {goto} from "$app/navigation"
    import {mobile, dual, datadrawer} from "$lib/store.js"    
    import {formatAddr, formatDecimal} from "$lib/format"
    import {icon,srchstr2qrystr} from "$lib/utils"

    import Heading from "$lib/components/Heading.svelte"
    import InfoTable from "$lib/components/InfoTable.svelte"
    import QuickButtons from "$lib/components/QuickButtons.svelte"

    export let data;
    
    //Store Variables
    let _mobile,
        _dual,
        _datadrawer
    
    //Other Variables
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
                { label: "Address", value: formatAddr( { address: _poi.address, city: _poi.city, state: _poi.state } ) }, 
                { label: "XY Coord", value: `${_poi.x}, ${_poi.y}` },
                ...( _poi.lat && _poi.lng ? [ { label: "Lat Lon", value: `${formatDecimal( _poi.lat )}, ${ formatDecimal( _poi.lng )}` } ]: [ ] ),
                ...( _poi.usng ? [ { label: "USNG", value: `${_poi.usng}` } ] : [ ] ),
            
            ]

            btns = [ 
                { label: "CATS Website", icon: "link", link: `https://www.charlottenc.gov/CATS/Rail` },
                { label: "Nearby Prop", icon: "nearby" },

            ]

        }

    dual.subscribe( value => { _dual = value })
    mobile.subscribe( value => { _mobile = value })
    datadrawer.subscribe( value => { _datadrawer = value } )

    //reactives
	$: if( data.poi )
        handleLocChange( data.poi )

</script>