<svelte:head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2WXBXS5TJP" />
    <script>
        window.dataLayer = window.dataLayer || [ ]

        function gtag( ){
        	dataLayer.push(arguments)

    	}

    	gtag( "js", new Date( ) )
		//gtag( 'set', {cookie_flags: 'SameSite=None;Secure'} )
    	gtag( "config", "MEASUREMENT_ID", { cookie_flags: 'SameSite=None;Secure' } )

  </script>

</svelte:head>

<script>
    import {page} from "$app/stores"
  
    $: {
      	if (typeof gtag !== 'undefined') {
        	gtag('config', 'MEASUREMENT_ID', {
          		page_title: document.title,
          		page_path: $page.url.pathname,
				cookie_flags: "SameSite=None;Secure"

        	} )

      	}

    }

</script>