import PDFDocument from "pdfkit-table"
import {getStreamAsBuffer} from "get-stream"
import {getErrorMsg, genError, getInvalidParams} from "$lib/api"
import {formatDate,formatAcres} from "$lib/format"
import {getAssociateData, getWaterQualData, getFloodplainData, getOwnershipData, getMailingAddrData, getSaleData, getLocData, getPostConstDistData, getStrmWtrshdData, getDrnkWtrshdData, getPropImage, getLandAnlyzData} from "$lib/report"
import {json2URL, arrHasAllElems} from "$lib/utils"
import {validateTaxPID} from "$lib/validate" 

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( {url, locals, fetch} ) => {
	let response, status = 200

	try{
        const pid = url.searchParams.get( "pid" ) ?? null,
			matid = url.searchParams.get( "matid" ) ?? null
                        
        if( !pid )
			throw new Error( getErrorMsg( url.searchParams, [ "pid" ] ) )

		if( !validateTaxPID( pid ) )
			throw new Error( "Polaris 3G can't find anything. Enter a valid Tax PID." )

		//Get CAMA data
		const resp = await fetch( `/api/bolt/cama?pid=${pid}` )

		if( !resp.ok )
			throw new Error( "No CAMA data available" )

		const raw_rows = await resp.json( )

		if( raw_rows.length === 0 )
			throw new Error( "No CAMA data available" )

		const rows = raw_rows.map( r => ( { 
				...r, 
				...( r?.mat ? r.mat[ ( matid ? r.mat.findIndex( m => m.matid === matid ) : 0 ) ] : { } )
			} ) ),
			cama_data = rows[ 0 ],
			x = cama_data.x ?? ( cama_data.centroid_x ?? null ), 
			y = cama_data.y ?? ( cama_data.centroid_y ?? null ),
			lat = cama_data.lat ?? ( cama_data.centroid_lat ?? null ), 
			lng = cama_data.lng ?? ( cama_data.centroid_lng ?? null ),
			photo_lat = ( cama_data.photo_lat ?? null ),
			photo_lng = ( cama_data.photo_lng ?? null ),
			photo_view = ( cama_data.photo_view ?? null )

		const margin = 30,
			doc = new PDFDocument( { // Create a document 
				size: "LETTER",
				margins: {
					top: margin,
					bottom: margin,
					left: margin,
					right: margin,

				}

			} ),
			half = doc.page.width/2,
			gap = 6,
			colwidth = half - margin - gap,
			table_options = {
				hideHeader: true,
				columnsSize: [ colwidth/2, colwidth/2 ],
				divider: {
					header: { disabled: true, width: 0.7, opacity: 1 },
					horizontal: { disabled: false, width: 1, opacity: 1 }
				},
				padding: 5,
				prepareHeader: ( ) => doc.font( "Helvetica" ).fontSize( 9 ),
				prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
					const {x, y, width, height} = rectCell;

					if( indexRow === 0 ){
						doc
							.lineWidth(.5)
							.moveTo(x+width, y)
							.lineTo(x, y)
							.stroke();
					}
						

      				// first line 
					if(indexColumn === 0){
						doc
							.lineWidth(.5)
							.moveTo(x, y)
							.lineTo(x, y + height)
							.stroke();
					}

      				doc
      					.lineWidth(.5)
      					.moveTo(x + width, y)
      					.lineTo(x + width, y + height)
      					.stroke();

					doc.font("Helvetica").fontSize( 9 )
				}
			},

			tables = { 
				property_key : {
					title: "", headers : [ { label:"Parcel ID" }, { label:"GIS ID" }, ],
					rows: [ [ cama_data.pid, ( cama_data.gisid ? cama_data.gisid : "NA" ) ] ]

				},

				mat: {
					title: "", headers : [ { label:"Info" }, ],
					rows: ( cama_data?.address ? [ [ cama_data.address ] ] : [ ] )

				},

				associate : {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: [ 
						...getAssociateData( cama_data.legal_description, cama_data.sqft, cama_data.land_size, cama_data.land_unit, 
							cama_data.fire_district, cama_data.special_district, cama_data.account_type, cama_data.municipality, cama_data.land_use_desc ),
						[ "GIS Acres", formatAcres( cama_data.sqft ) ]
					]

				},

				situs: {
					title: "", headers : [  { label:"Info" }, ],
					rows: cama_data.situs.slice( 0, 1 ).map( row => [ row ] )

				},

				zoning: {
					title: "", headers : [ { label:"Info" }, ],
					rows: [ [ "Contact appropriate Planning Department or see Map" ], ],

				},

				owners: {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: getOwnershipData( cama_data.owner ?? [ ] ),

				},

				mailaddr: {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: getMailingAddrData( [ cama_data.mailing_address ] ),

				},

				sale: { 
					title: "", headers : [ { label:"Deed"}, { label:"Sale Date" }, { label:"Sale Date" }, ], 
					rows: getSaleData( cama_data.sale ?? [ ] ), 

				},

				loc: { 
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ], 
					rows: await getLocData( cama_data.gisid, x, y ,fetch ), 

				},

				environmental: {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: [ ...await getFloodplainData( cama_data.gisid, x, y, fetch ),
						...await getWaterQualData( cama_data.gisid, fetch ),
						...await getPostConstDistData( x, y ,fetch ),
						...await getStrmWtrshdData( x, y ,fetch ),
						...await getDrnkWtrshdData( x, y ,fetch ),

					 ],

				},

				landanlyzjuris: {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: await getLandAnlyzData( cama_data.gisid, cama_data.sqft, [ "juris" ], fetch )

				},

				landanlyzzoning: {
					title: "", headers : [ { label:"Info" }, { label:"Value" }, ],
					rows: await getLandAnlyzData( cama_data.gisid, cama_data.sqft, [ "zoning" ], fetch )

				},

				landanlyzother: {
					title: "", headers : [ { label:"Layer"}, { label:"IN" }, { label:"OUT" }  ], 
					rows: await getLandAnlyzData( cama_data.gisid, cama_data.sqft, [ "utilrow", "railrow", "fldp", "postconst", "swim" ], fetch )

				}
				
			},

			photo = await getPropImage( photo_lat, photo_lng, photo_view, fetch )

		//Heading
		doc
			.fontSize( 10 )
  			.font( "Helvetica-Bold" )
			.text( "MECKLENBURG COUNTY, North Carolina", {
	  			align: "center"
  			} )
  			.text( "POLARIS 3G PARCEL OWNERSHIP AND GIS SUMMARY", {
	  			align: "center"
  			} )

		doc
			.font( "Helvetica" )
			.text( `Date Printed: ${formatDate( new Date( ) )}`, {
				align: "center"
			} )
			.moveDown( )

		//store top y
		const top_y = doc.y

		//Column 1	
		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Identity", { lineGap: 2 } )
			.table( {...tables.property_key, rows: [ [ "Parcel ID", "GIS ID" ], ...tables.property_key.rows ] }, table_options )

		if( tables.mat.rows.length > 0 )
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( `Postal Address on property${cama_data.mat.length > 1 ? " (Only 1 shown)" : ""}`, { lineGap: 2 } )
				.table( tables.mat, { ...table_options, columnsSize: [ colwidth ] } )
		
		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Property Characteristics", { lineGap: 2 } )
			.table( tables.associate, table_options )

		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Land Analysis - Jurisdiction", { lineGap: 2 } )
			.table( tables.landanlyzjuris, table_options )

		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Land Analysis - Zoning", { lineGap: 2 } )
			.table( tables.landanlyzzoning, table_options )

		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Land Analysis - Other", { lineGap: 2 } )
			.table( 
				{ ...tables.landanlyzother, rows: [ [ "Layer", "IN", "OUT" ], ...tables.landanlyzother.rows ] }, 
				{ ...table_options, columnsSize: [ colwidth/3, colwidth/3, colwidth/3 ] } 
			)

		if( tables.loc.rows.length > 0 )
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( "Site Location", { lineGap: 2 } )
				.table( tables.loc, { ...table_options, columnsSize: [ colwidth*2/3, colwidth/3 ] } )

		//Column 2
		doc.x = half + gap
		doc.y = top_y

		if( tables.owners.rows.length > 0 )
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( "Ownership", { lineGap: 2 } )
				.table( tables.owners, { ...table_options, columnsSize: [ gap*3, colwidth - gap*3 ] } )

		if( tables.mailaddr.rows.length > 0 )
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( "Tax Billing Address", { lineGap: 2 } )
				.table( tables.mailaddr, { ...table_options, columnsSize: [ colwidth ] } )

		if( tables.sale.rows.length > 0 )
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( `Deed Reference(s) and Sale Price ${cama_data?.sale ? ( cama_data.sale.length > 3 ? "(Last 3 shown)" : "") : ""}`, { lineGap: 2 } )
				.table( { ...tables.sale, rows: [ [ "Deed", "Sale Date", "Sale Price" ], ...tables.sale.rows ] }, { ...table_options, columnsSize: [ colwidth/3, colwidth/3, colwidth/3 ] } )

		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( `Situs Addresses tied to Parcel ${cama_data?.situs ? ( cama_data.situs.length > 1 ? "(Only 1 shown)" : "") : ""}`, { lineGap: 2 } )
			.table( tables.situs, { ...table_options, columnsSize: [ colwidth ] } )

		doc
			.fontSize( 10 )
			.font( "Helvetica-Bold" )
			.text( "Zoning", { lineGap: 2 } )
			.table( tables.zoning, { ...table_options, columnsSize: [ colwidth ] } )

			if( tables.environmental.rows.length > 0 )				
			doc
				.fontSize( 10 )
				.font( "Helvetica-Bold" )
				.text( "Environmental Information (View map to verify)", { lineGap: 2 } )
				//.table( tables.environmental, { ...table_options, columnsSize: [ colwidth/3, colwidth*2/3 ] } )
				.table( tables.environmental, { ...table_options, columnsSize: [ colwidth/2, colwidth/2 ] } )

		if( photo.strm ){
			const img_info = { x: doc.x, y: doc.y, height: 200 }

			doc
				.image( await photo.strm, img_info.x, img_info.y, { width: colwidth, height: img_info.height } )
				.rect( img_info.x, img_info.y, colwidth, 200)
				.stroke( )
				.moveUp( 1.0 )
				.fillColor( "yellow" )
				.font( "Helvetica-Bold" )
				.text( (photo.txt ? photo.txt : "" ), {align: "right"})

		}

		//Footer - Disclaimer
		doc.x = margin
		doc.y = doc.page.height - 67

		doc
			.fontSize( 8 )
			.fillColor( "black" )
			.font( "Helvetica-Oblique" )
			.text( "This map or report is prepared for the inventory of real property within Mecklenburg County and is compiled from recorded deeds, plats, tax maps, surveys, planimetric maps, and other public records and data. Users of this map or report are hereby notified that the aforementioned public primary information sources should be consulted for verification. Mecklenburg County and its mapping contractors assume no legal responsibility for the information contained herein." )


		
		
		// Finalize PDF file
		doc.end( )

		const b64 = Buffer.from( await getStreamAsBuffer( doc ) )

		return new Response( b64, { status: 500, headers: { 'Content-Type': 'application/pdf' } } )

    }catch( err ){
		response = genError( { "message": err.message, "code": err.code } )
        status = 500
		return new Response( JSON.stringify( response ), { status: status } )

    }

}