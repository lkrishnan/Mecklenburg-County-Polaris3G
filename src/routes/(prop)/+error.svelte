<div class="flex items-center bg-luz p-2 gap-2 text-pop">
    {@html icon( "alert", 48, 48 )}
    <h1>{@html $page.error.message}</h1>
</div>
  
<script>
  import { page } from "$app/stores"
  import { icon } from "$lib/utils"
</script>