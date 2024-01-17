import PDFDocument from "pdfkit-table"
import {getStreamAsBuffer} from "get-stream"
import {genError, getInvalidParams} from "$lib/api"
import {formatDate, formatLandArea, formatFullName2, formatDeed} from "$lib/format"
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
            page_width = doc.page.width - margin*2 - 6

        doc.table( {
            title: "", headers : [ 
                { label: "No", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Parcel ID", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Owner Name", renderer: value => value, headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Tax Bill Address", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Legal Desc", headerColor:"#ffffff", headerAlign:"center" }, 
                { label: "Deed", headerColor:"#ffffff", headerAlign:"center" },
                { label: "Land Area", headerColor:"#ffffff", headerAlign:"center" },
            ],
            rows: rows.map( ( row, idx ) => [ 
                        `${idx + 1}.`, 
                        row.pid, 
                        ( row.owner ? row.owner.map( (o, i) => `${i+1}. ${formatFullName2( o, false )}` ).reduce( ( acc, curr ) => `${acc}\n${curr}` ) : "NA" ), 
                        ( row.mailing_address ?? "NA" ), 
                        ( row.legal_description ? row.legal_description : "NA" ), 
                        ( row?.sale ? row.sale.splice( 0, 1 ).map( item => formatDeed( item.legal_reference, item.sale_date, true ) ).reduce( ( acc, curr ) => `${acc}${curr}` ) : "NA" ), 
                        formatLandArea( row.land_size, row.land_unit, row.sqft )

                ] )

            }, {
            columnsSize: [ page_width*0.45/7, page_width*0.75/7, page_width*1.8/7, page_width*1.4/7, page_width*0.9/7, page_width*0.7/7, page_width/7 ],
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
                .text( "POLARIS 3G PROPERTY DEED REPORT", margin, margin, { height : header_height, align: "center" } )
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