<main>
	<slot/>
</main>

<script>
	//Sveltkit Libraries
	import {page} from "$app/stores"

	//Store
	import {title} from "$lib/store.js"    

	let _title

	const handleTitleChange = the_title => {
			title.set( the_title )
			
		}

	//Reactives
	$: if( $page ){
		_title = $page.data.title
	
	}

	$: handleTitleChange( _title )

</script>