<div class="w-full mb-2 px-4">
    {#if loaded}
        <img {src} alt="BuildingPhoto" />
        <div class="flex justify-center">
            Photo Date:  {photo_date.substring( 4, 6 )}/{photo_date.substring( 6, 8 )}/{photo_date.substring( 0, 4 )}
        </div>
        <div class="flex justify-center">
            <a 
                class="text-error underline underline-offset-4 hover:text-signify" 
                href='https://polaris3g.mecklenburgcountync.gov/data/buildingphotomoreinfo.pdf' 
                target='_blank' 
                rel='noreferrer'
            >
                Outdated photos cannot be changed at this time.
            </a>
        </div>
           
    {/if}
    
</div>


<script>
	export let photo_url
    export let photo_date

	let loaded = false,
        src = null

    // reactives
    $: if( photo_url ){ // Check if image is valid
        const img = new Image( )
		
        img.src = photo_url

		img.onload = ( ) => {
            loaded = true
            src = photo_url
		}
		
        img.onerror = ( ) => {
			loaded = false
            src = null
        
        }

    }else{
        loaded = false
        src = null
    }
	
</script>