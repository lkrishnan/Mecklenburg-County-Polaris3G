<div class="max-w-[240px]">
    <canvas bind:this={chart_canvas} />
</div>


<script>
    import { onMount } from "svelte"
    import Chart from "chart.js/auto"
    import ChartDataLabels from "chartjs-plugin-datalabels"
    
    export let labels = [ ]
    export let datasets = [ ]
    
    let chart,
        chart_canvas,
        mounted = false

    // Register the plugin to all charts:
    Chart.register( ChartDataLabels )

    const handleInfoChange = ( _labels, _datasets, _mounted ) => {
        if( _mounted ){
            chart.data.labels = _labels
            chart.data.datasets = _datasets
            chart.update( )

        }

    }

    onMount( ( ) => { 
        chart = new Chart( chart_canvas.getContext( "2d" ), {
            type: "pie",
            data: {
                labels: [ ],
                datasets: [ ]

            },
            options: {
                plugins: {
                    datalabels: {
                        color: "#211746",
                        font: {
                            size: 14,
                            weight: "bold"
                        },
                        formatter: value => ( value/43650 ).toFixed( 2 ) + " AC"

                    },
                    tooltip: {
                        callbacks: {
                            label: context => ( context.parsed/43650 ).toFixed( 2 ) + " AC",
                                                    
                        }
                    }

                }

            }

        } )

        mounted = true 

    } )
        
    //reactives
    $: { handleInfoChange( labels, datasets, mounted ) }
	
</script>