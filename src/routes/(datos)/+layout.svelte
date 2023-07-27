<svelte:window bind:innerWidth={screen_size} />
{#if datosdrawer }

    <div
        transition:slide="{{duration: 500, axis: 'x'}}" 
        class="absolute z-5 left-0 top-0 w-full md:w-[430px] h-full bg-lienzo md:border-r md:border-primero shadow-lg pt-[67px] md:pt-[112px] overflow-auto scrollbar" 
    >
		<main>
			<slot/>
		</main>

    </div>

    <button 
		transition:slide="{{duration: 500, axis: 'x'}}"
		class="absolute z-6 left-0 top-[50%] bg-lienzo border-y border-r border-primero text-primero hover:text-segundo hover:bg-luz rounded-r ml-[430px] shadow-lg invisible md:visible"
		alt="Collapse side panel"
		on:click="{(event)=>{datosdrawer = false}}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>

	</button>

{:else}

    <button 
		transition:slide="{{delay: 500, axis: 'x'}}"
		class="absolute z-5 left-0 top-[50%] bg-lienzo border-y border-r border-primero text-primero hover:text-segundo hover:bg-luz rounded-r shadow-lg"
		alt="Collapse side panel"
		on:click="{(event)=>{datosdrawer = true}}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>

{/if}

<script>
    import { slide } from 'svelte/transition'
	import { offset } from "$lib/store"
	import { page } from "$app/stores"

    let datosdrawer = true, screen_size, _offset

	offset.subscribe( value => { 
		_offset = value

	} )

	$: offset.set( $page.route.id.match( /(datos)/ig ) && screen_size > 768 && datosdrawer ? 430 : 0 )

	/*datosdrawer.subscribe( value => { 
		_datosdrawer = value

	} )*/
	
</script>