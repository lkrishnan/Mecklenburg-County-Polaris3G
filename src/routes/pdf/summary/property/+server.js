import PDFDocument from "pdfkit-table"
import {getStreamAsBuffer} from "get-stream"
import {genError, getInvalidParams} from "$lib/api"
import {formatDate, formatLandArea, formatFullName2, formatDeed, formatMoney} from "$lib/format"
import {getAnlyzAllowedParams} from "$lib/formhelp"
import {json2URL, arrHasAllElems} from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( {url, locals, fetch } ) => {
	let response, options = { status: 200 }

	try{
        const allowed = getAnlyzAllowedParams( ),
            params = { limit: 1800, ...Object.fromEntries( url.searchParams ) }
        
        if( !arrHasAllElems( allowed, Object.keys( params ) ) )
            throw new Error( `invalid paramater(s) sent: ${ getInvalidParams( params, allowed ).join( ', ' ) }` )

         //Get CAMA data
        const bolt_resp = await fetch( `/api/bolt/cama?${json2URL(params)}` )

        if( !bolt_resp.ok )
             throw new Error( "No CAMA data available" )
 
         const rows = await bolt_resp.json( )
 
        if( rows.length === 0 )
             throw new Error( "No CAMA data available" )

        const margin = 30,
            header_height = 38,
            footer_height = 38,
            doc = new PDFDocument( { // Create a document 
                size: "LETTER",
                margins: {
                    top: margin*2,
                    bottom: margin*3,
                    left: margin,
                    right: margin,

                },
                bufferPages: true

            } ),
            page_width = doc.page.width - margin*2 - 6,
            col_cnt = 7

        doc.table( {
            title: "", headers : [ 
                { label: "No", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Parcel ID", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Property Address", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Land Area", headerColor:"#ffffff", headerAlign:"center" },
                { label: "Sale Price", headerColor:"#ffffff", headerAlign:"center" },
                { label: "Market Value", headerColor:"#ffffff", headerAlign:"center" },
                { label: "Building", headerColor:"#ffffff", headerAlign:"center" },
                                
            ],
            rows: rows.map( ( row, idx ) => {
                return [ 
                        `${idx + 1}.`, 
                        row.pid, 
                        ( row?.mat ? row.mat.splice( 0, 3 ).map( mat => mat.address ).reduce( ( acc, curr ) => `${acc}\n${curr}` ) : "NA" ),
                        formatLandArea( row.land_size, row.land_unit, row.sqft ),
                        ( row.sale.length > 0 ? `${formatMoney( row.sale[ 0 ].sale_price, {  minimumFractionDigits: 0, } )} (${formatDate( row.sale[ 0 ].sale_date )})` : "NA" ),
                        ( row.market_value ? formatMoney( row.market_value, {  minimumFractionDigits: 0, } ) : "NA" ),
                        ( row?.bldg ? `Sq. Ft      : ${row.bldg[ 0 ].total_sqft} \nYr Built    : ${row.bldg[ 0 ].year_built} \nBedroom : ${row.bldg[ 0 ].bedrooms} \nFull Bath : ${row.bldg[ 0 ].full_baths}` : "NA" ),
                        
                        

                ]
                } )

            }, {
            columnsSize: [ page_width*0.45/col_cnt, page_width*0.75/col_cnt, page_width*1.8/col_cnt, page_width*1.2/col_cnt, page_width*0.9/col_cnt, page_width/col_cnt, page_width*1.2/col_cnt ],
            divider: {
                header: { disabled: true, width: 1, opacity: 0 },
                horizontal: { disabled: false, width: 1, opacity: 1 },
            },
            padding: 5,
            prepareHeader: ( ) => doc.font( "Helvetica-Bold" ).fontSize( 9 ),
            prepareRow: ( row, indexColumn, indexRow, rectRow, rectCell ) => {
                const {x, y, width, height} = rectCell

                doc
                    .lineWidth( .5 )
                    .moveTo( x + width, y )
                    .lineTo( x, y )
                    .stroke( )
                
                
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
                    .stroke()

                doc.font("Helvetica").fontSize( 9 )

            }

        } )
        
        //Add Header and Footer 
        const range = doc.bufferedPageRange( )

        for( let i = range.start;i<(range.start + range.count);i++ ){
            doc.switchToPage( i )
            
            doc
                .fontSize( 10 )
                .font( "Helvetica-Bold" )
                .text( "POLARIS 3G PROPERTY SUMMARY REPORT", margin, margin, { height : header_height, align: "center" } )
                .fontSize( 9 )
                .font( "Helvetica" )
                .text( `Date Printed: ${formatDate( new Date( ) )}`, { align: "center" } )
                .fontSize( 8 )
                .font( "Helvetica-Oblique" )
                .text( "This map or report is prepared for the inventory of real property within Mecklenburg County and is compiled from recorded deeds, plats, tax maps, surveys, planimetric maps, and other public records and data. Users of this map or report are hereby notified that the aforementioned public primary information sources should be consulted for verification. Mecklenburg County and its mapping contractors assume no legal responsibility for the information contained herein.", margin, doc.page.height - margin - footer_height, { height : footer_height } )
                .font( "Helvetica" )
                .text(`Page ${i + 1} of ${range.count}`, doc.page.width - margin -  100, doc.page.height - 25, { height: 25, width: 100, align: "right" } )


        }

        // Finalize PDF file
        doc.end( )

        response = Buffer.from( await getStreamAsBuffer( doc ) )
        options = { ...options, headers: { "Content-Type": "application/pdf" } }

    }catch( err ){
		response =  JSON.stringify( genError( { "message": err.message, "code": err.code } ) )
        options.status = 500

    }finally{
        return new Response( response, options )

    }

}