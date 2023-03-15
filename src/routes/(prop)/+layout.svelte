<main>
    <slot/>
</main>

{#if show.results }
    <div>Results</div>

{/if}

{#if show.details }
    <PropertyKey />

{/if}

<script>
    import { selection, results } from "$lib/store.js"    
    import PropertyKey from "$lib/PropertyKey.svelte"
    
    let _selection, 
        _results,
        show = { results: false, details: false }

    selection.subscribe( value => { 
        _selection = value
        show = { results: false, details: ( Object.keys( _selection ).length > 0 ? true : false ) }
        console.log( "selection")
    } )

    results.subscribe( value => { 
        _results = value
        show = { results: ( _results.length > 0 ? true : false ), details: false }
        console.log( "results")
        
    } )

</script>