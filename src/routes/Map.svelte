<div class="h-screen" use:InitMap>

</div>

<script>
    import Map from "@arcgis/core/Map"
    import MapView from "@arcgis/core/views/MapView"
	import TileLayer from "@arcgis/core/layers/TileLayer"
	import Extent from "@arcgis/core/geometry/Extent"

	let map = null,
		view = null,
		last_basemap = 0
		
	const tile_lyrs = {
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
	
	},
	InitMap = ( domNode ) => {
		map = new Map( {
			layers: [ ...basemaps[ last_basemap ].map( basemap => tile_lyrs[ basemap ] ) ]

		} )

		// Create the mapView from the map
		view = new MapView( {
			container: domNode,
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
		view.ui.move( "zoom", "bottom-left" )
	
	}

</script>

<style>
    @import "@arcgis/core/assets/esri/themes/light/main.css";


</style>
