<div class="p-2">
    <form class="p-2" on:submit|preventDefault={handleGo}>
        <div class="mb-4">
            <label class="block text-sm font-bold mb-2" for="situs_addr">
                Preliminary Plans
            </label>
            <Selecto on:hit={handleHit} items={items} selected={selected}/>
            
        </div>
        
        <div>
            <button class="bg-pop border-2 border-pop text-lienzo hover:text-pop font-semibold hover:bg-lienzo py-1.5 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                Go
            </button>
        </div>
    </form>
           
</div>
    
<script>
    import { onMount} from "svelte"
    import { json2URL } from "$lib/utils"
    import { messenger, searchdrawer } from "$lib/store"

    import overlays_data from "$lib/data/overlays"
    import Selecto from "$lib/components/Selecto.svelte"

    let items= [ ],
        selected = 0,
        hit

    onMount( async () => {
        const params = {
                table: "preliminary_plans_ln",
                columns: "projname, projname as value, projname as label",
                group: "projname",
                sort: "projname",
                filter: "projname is not NULL",

            },
            response = await fetch( `/api/query/gis?${json2URL( params )}` )
        
        items = await response.json( )

        if( items.length > 0 )
            hit = items[ selected ]
					
    } )

    const handleHit = event => {
            hit =  event.detail

        },
        handleGo = async event => {
            const params = {
                    table: "preliminary_plans_ln",
                    columns: "ST_XMin(ST_Extent(shape)) as xmin, ST_YMin(ST_Extent(shape)) as ymin, ST_XMax(ST_Extent(shape)) as xmax, ST_YMax(ST_Extent(shape)) as ymax",
                    filter: `projname = '${hit.value}'`,

                },
                response = await fetch( `/api/query/gis?${json2URL( params )}` ),
                rows = await response.json( )

            if( rows.length > 0 ){
                const group_idx = overlays_data.findIndex( item => item.id === "lnddvlpmnt" ),
                    lyr_idx = overlays_data[ group_idx ].children.findIndex( item => item.id === "prelimplans" )


                //set checkboxes in overlay list
                overlays_data[ group_idx ].children[ lyr_idx ].checked = true
                overlays_data[ group_idx ].checked = ( overlays_data[ group_idx ].children.filter(item => item.checked).length === overlays_data[ group_idx ].children.length )

                messenger.set( [
                    { type: "zoom_to_extent", extent: rows[ 0 ] },
                    { type: "toggle_layer", layers: [ { group_idx: group_idx, lyr_idx: lyr_idx, visible: true } ] }

                ] )

            }

            searchdrawer.set( false )

        }

</script>