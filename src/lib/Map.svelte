<div class="h-screen" id="viewDiv">

</div>

<script>
    import { onMount } from "svelte"

	onMount(async () => {
		const Map = ( await import( "@arcgis/core/Map" ) ).default,
			MapView = ( await import( "@arcgis/core/views/MapView" ) ).default,
			TileLayer = ( await import( "@arcgis/core/layers/TileLayer" ) ).default,
			Extent = ( await import( "@arcgis/core/geometry/Extent" ) ).default,

			tile_lyrs = {
				streets: new TileLayer( { 
					id: "streets",
					url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/basemap/MapServer"
				} ),

				hollow: new TileLayer( { 
					id: "hollow",
					url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/basemap_aerial/MapServer"
				} ),

				topo: new TileLayer( { 
					id: "topo",
					url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/topohillshade/MapServer"
				} ),

				aerial_2021: new TileLayer( { 
					id: "aerial_2021",
					url: "https://polaris3g.mecklenburgcountync.gov/polarisv/rest/services/aerial2021/MapServer"
				} ),

			},
			basemaps = {
				0: [ "streets" ],
				1: [ "aerial_2021" ],
				2: [ "aerial_2021", "hollow" ],
				3: [ "topo", "hollow" ]
			
			}

		let last_basemap = 0,
			map = new Map( {
				layers: [ ...basemaps[ last_basemap ].map( basemap => tile_lyrs[ basemap ] ) ]

			} ),
			view = new MapView( {
				container: 'viewDiv',
				map: map,
				extent: new Extent( {
					xmin: 1384251.24585599,
					ymin: 460978.995855999,
					xmax: 1537013.50075424,
					ymax: 660946.333333335,
					spatialReference: { wkid: 2264 }
				} )

			} )
			
		view.ui.remove( [ "attribution" ] )
		view.ui.move( "zoom", "bottom-right" )

	} )


</script>

<style>
    @import "@arcgis/core/assets/esri/themes/light/main.css";


</style>
