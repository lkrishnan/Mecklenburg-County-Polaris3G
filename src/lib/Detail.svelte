<PropertyKey pid={pid} gisid={gisid} matid={matid} address={address} lat={lat} lng={lng} x={x} y={y} />
<AssociateInfo legal={legal_rows} landuse={landuse_rows} sqft={sqft} />
<TaxInfo pid={pid} legal={legal_rows} />

<script>
    import { selection } from "$lib/store.js"    
    import PropertyKey from "$lib/PropertyKey.svelte"
    import AssociateInfo from "$lib/AssociateInfo.svelte"
    import TaxInfo from "$lib/TaxInfo.svelte"

    let pid, gisid,
        matid, address,
        sqft,
        lat, lng, x, y,
        legal_rows,
        landuse_rows
       
    selection.subscribe( async _selection => { 
        pid = _selection.pid ?? null
        gisid = _selection.gisid ?? null
        matid = _selection.matid ?? null
        address = _selection.address ?? null
        sqft = _selection.sqft ?? null
        lat = _selection.lat ?? centroid_lat
        lng = _selection.lng ?? centroid_lng
        x = _selection.x ?? centroid_x
        y = _selection.y ?? centroid_y

        const urls = [
                //legal
                { url: ( _selection.pid ? `/api/parcel/legal?pid=${_selection.pid}` : null ), tag: "legal" },

                //landuse
                { url: ( _selection.pid ? `/api/parcel/landuse?pid=${_selection.pid}` : null ), tag: "landuse" },
            
            ],
            jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
            tags = urls.filter( item => item.url ).map( item => item.tag )
        
        legal_rows = ( tags.includes( "legal" ) ? jsons[ tags.indexOf( "legal" ) ] : [ ] )
        landuse_rows = ( tags.includes( "landuse" ) ? jsons[ tags.indexOf( "landuse" ) ] : [ ] )
        
    } )

</script>