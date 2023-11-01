<div class="w-full h-[20px] select-none whitespace-nowrap box-border cursor-grabbing px-2">
	<div class="slider" bind:this={slider}>
		<div
			class="body bg-segundo"
			bind:this={body}
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlesFromBody}"
			style="left: {100 * start}%; right: {100 * (1 - end)}%;"
		/>

		<div
			class="handle"
			bind:this={leftHandle}
			data-which="start"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('start')}"
			style="left: {100 * start}%"
		/>

		<div
			class="handle"
			data-which="end"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('end')}"
			style="left: {100 * end}%"
		/>

	</div>

	

</div>
<div class="w-full select-none px-2">
	<div class="float-left text-sm">{format( min )}</div>
	<div class="float-right text-sm">{format( max )}</div>
	
</div>

<!--<div class="flex flex-row p-2">
	<input 
		type="text" 
		class="w-1/2 px-3 py-3.5 border focus:outline-segundo text-sm rounded block" 
		placeholder="Min"
		bind:value="{min}"
		on:input="{(event)=>onChange(event)}"
	/>
	<div class="flex grow justify-center items-center px-2">-</div>
	<input 
		type="text" 
		class="w-1/2 px-3 py-3.5 border focus:outline-segundo text-sm rounded block" 
		placeholder="Max"
		bind:value="{max}"
		on:input="{(event)=>onChange(event)}"
	/>
</div>-->

<script>
	import { formatDecimal } from "$lib/format"
	import { onMount} from "svelte"

	export let min = 0
	export let max = 1
	export let absolute_min = 0
	export let absolute_max = 1
	export let decimal_places = 2
	export let format = val => val
    
	let leftHandle, 
		body, 
		slider,
		start = 0,
		end = 1

	const draggable = node => {
		let x, y

		const handleMousedown = event => {
			if( event.type === "touchstart" )
				event = event.touches[ 0 ]
			
			x = event.clientX
			y = event.clientY

			node.dispatchEvent( new CustomEvent( "dragstart", { detail: { x, y } } ) )
			window.addEventListener( "mousemove", handleMousemove )
			window.addEventListener( "mouseup", handleMouseup )
			window.addEventListener( "touchmove", handleMousemove )
			window.addEventListener( "touchend", handleMouseup )

		},
        
        handleMousemove = event => {
			if( event.type === 'touchmove' )
				event = event.changedTouches[ 0 ]
			
			const dx = event.clientX - x
			const dy = event.clientY - y
			x = event.clientX
			y = event.clientY

			node.dispatchEvent( new CustomEvent( 'dragmove', { detail: { x, y, dx, dy } } ) )

		},
        
        handleMouseup = event => {
			x = event.clientX
			y = event.clientY
			node.dispatchEvent( new CustomEvent( 'dragend', { detail: { x, y } } ) )
			window.removeEventListener( 'mousemove', handleMousemove )
			window.removeEventListener( 'mouseup', handleMouseup )
			window.removeEventListener( 'touchmove', handleMousemove )
			window.removeEventListener( 'touchend', handleMouseup )

		}


		node.addEventListener( 'mousedown', handleMousedown )
		node.addEventListener( 'touchstart', handleMousedown )

		return {
			destroy( ){
				node.removeEventListener( 'mousedown', handleMousedown )
				node.removeEventListener( 'touchstart', handleMousedown )

			}

		}

	},

	setHandlePosition = which => {
		return evt => {
			const { left, right } = slider.getBoundingClientRect( )
			const parentWidth = right - left
			const p = Math.min( Math.max( ( evt.detail.x - left ) / parentWidth, 0 ), 1 )
			if( which === "start" ){
				start = p
				end = Math.max( end, p )
			}else{
				start = Math.min( p, start )
				end = p

			}

			min = calc( "min" )
			max = calc( "max" )

		}

	},

    clamp = ( num, min, max ) => {
	    return num < min ? min : num > max ? max : num

    },

	setHandlesFromBody = evt => {
		const { width } = body.getBoundingClientRect( )
		const { left, right } = slider.getBoundingClientRect( )
		const parentWidth = right - left
		const leftHandleLeft = leftHandle.getBoundingClientRect( ).left
		const pxStart = clamp( ( leftHandleLeft + evt.detail.dx ) - left, 0, parentWidth - width )
		const pxEnd = clamp( pxStart + width, width, parentWidth )
		const pStart = pxStart / parentWidth
		const pEnd = pxEnd / parentWidth
		start = pStart
		end = pEnd
				

	},

	/*onChange = async event => { // handle input change
		if( max > absolute_max )
			max = absolute_max
		else if( max < min ) 
			max = min

		if( min < absolute_min )
			min = absolute_min
		else if( min > max ) 
			min = max

		start = calc( "start" )
		end = calc( "end" )

	},*/

	calc = ( what ) => {
		let absolute_range = absolute_max - absolute_min

		switch( what ){
			case "start":
				return ( min - absolute_min ) / absolute_range

			case "end":
				return ( max - min ) / absolute_range

			case "min":
				return formatDecimal( absolute_min + (absolute_range * start), decimal_places )

			case "max":
				//return formatDecimal( absolute_max * end, decimal_places )
				return formatDecimal( absolute_min + (absolute_range * end), decimal_places )

		}
	}

	onMount( async ( ) => {
		// calc start and end based on min and max
		//absolute_range = absolute_max - absolute_min
		//start = ( min - absolute_min ) / absolute_range
		//end = max / absolute_range
		start = calc( "start" )
		end = calc( "end" )

	} )

</script>

<style>
	.slider {
		position: relative;
		width: 100%;
		height: 6px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: #e2e2e2;
		box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0px 0px #9c9c9c;
		border-radius: 5px;
	}
	.handle {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
	}
	.handle:after {
		content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		background-color: #fdfdfd;
		border: 1px solid #7b7b7b;
		transform: translate(-50%, -50%)
	}
	
	.handle:active:after {
		background-color: #ddd;
		z-index: 9;
	}

	.body {
		top: 0;
		position: absolute;
		/*background-color: #34a1ff;*/
		bottom: 0;
	}
</style>