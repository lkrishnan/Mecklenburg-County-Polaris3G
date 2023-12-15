import PDFDocument from "pdfkit-table"
import SVGtoPDF from "svg-to-pdfkit"
import {getStreamAsBuffer} from "get-stream"
import {getErrorMsg, genError, getInvalidParams} from "$lib/api"
import {formatDate, formatAcres, formatLandArea, formatMoney} from "$lib/format"
import {getAnlyzAllowedParams} from "$lib/formhelp"
import {addHeader, addFooter, getTableOptions} from "$lib/pdf"
import {getPropImage} from "$lib/report"
import {json2URL, arrHasAllElems, filterObj} from "$lib/utils"

/** @type {import('./validate/$types').RequestHandler} */
export const GET = async ( {url, locals, fetch } ) => {
	let response, options = { status: 200 }

	try{
        const allowed = getAnlyzAllowedParams( ),
            limit = {
                page: 50,
                card: 36

            },
            params = { 
                ...( url.searchParams.get( "page" ) ? { limit: limit.card } : { page: 1, limit: limit.card * limit.page } ),  
                ...Object.fromEntries( url.searchParams ),
                
            }
        
        if( !arrHasAllElems( allowed, Object.keys( params ) ) )
            throw new Error( `invalid paramater(s) sent: ${ getInvalidParams( url.searchParams, allowed ).join( ', ' ) }` )

        //Get CAMA data
        const bolt_resp = await fetch( `/api/bolt/cama?${json2URL(params)}` )

        if( !bolt_resp.ok )
            throw new Error( "No CAMA data available" )

        const rows = await bolt_resp.json( )

        if( rows.length === 0 )
            throw new Error( "No CAMA data available" )

        if( rows.length > limit.card ){
            let htmlstr = `<b>Due to the large number of records, the Property Information Report has been divided into ${Math.ceil( rows.length/limit.card )} parts</b><br/><br/>`

            for( let part=0;part<Math.ceil( rows.length/limit.card );part++ )
                htmlstr += `<a href='${url.pathname}?${json2URL({page: part+1, limit: limit.card, ...filterObj(params, ["page", "limit"], false)})}' target='_blank'>Download Part ${part+1}</a><br/><br/>`

            response = htmlstr
            options = { ...options, headers: { "Content-Type": "text/html" } }
            
        }else{
            PDFDocument.prototype.addSVG = function(svg, x, y, options) {
                return SVGtoPDF(this, svg, x, y, options), this;
            }

            const margin = 30,
                gap = 5,
                padding = 4, 
                doc = new PDFDocument( { // Create a document 
                    size: "LETTER",
                    margins: {
                        top: margin,
                        bottom: margin,
                        left: margin,
                        right: margin,

                    }

                } ),
                pages = Math.ceil( rows.length/9 ),
                cards = 9,
                card_width = (doc.page.width / 3) - gap*2 - margin/2,
                card_height = 216,
                photo_height = 102
                
            let factor, photo, cama_data, x, y, temp_y, temp_x

            for( let page=0; page<pages; page++ ){
                //Heading
                addHeader( doc, "POLARIS 3G PROPERTY SUMMARY REPORT" )

                //Property Cards
                for( let card=page*cards; card<(page < pages ? (page*cards)+cards : raw_rows.length); card++ ){
                    if( card < rows.length ){
                        cama_data = rows[ card ]

                        photo = await getPropImage( cama_data.gisid, fetch, true )
                        factor = { width: card % 3, height: (((Math.ceil((card+1)/3)*3) - (page*cards))/3) - 1 }
                        x = doc.x
                        y = doc.y
                        
                        //Property Image
                        if( photo.svg )
                            doc.addSVG( photo.svg, doc.x + (card_width + gap)*(factor.width%3), doc.y + (card_height + gap)*factor.height + 10, { width: card_width, height: photo_height - 20 });
                        
                        else
                            doc
                                .image( photo.strm, doc.x + (card_width + gap)*(factor.width%3), doc.y + (card_height + gap)*factor.height, { width: card_width, height: photo_height } )
                        
                        doc
                            .lineWidth(.5)
                            .moveTo( x + (card_width + gap)*(factor.width%3), y + (card_height + gap)*factor.height + photo_height )
                            .lineTo( x + (card_width + gap)*(factor.width%3) + card_width, y + (card_height + gap)*factor.height + photo_height )
                            .stroke( )

                        //Address
                        doc.x = x + (card_width + gap)*(factor.width%3) + padding
                        doc.y = y + (card_height + gap)*factor.height + photo_height + padding

                        doc
                            .fillColor( "black" )
                            .fontSize( 9 )
                            .font( "Helvetica" )
                            .text( cama_data?.mat ? ( cama_data.mat.length > 0 ? cama_data.mat[ 0 ].address : "NA" ) :"NA", {
                                width: card_width - gap,
                                height: 20,
                                lineBreak: false,
                                ellipsis: true
                                
                            } )
                                                        
                        //Parcel ID, Land Area, Sale Price, Market Value
                        doc.x = doc.x - padding
                        temp_x = doc.x
                        
                        doc.table( {
                                title: "", headers : [ { label:"Label" }, { label:"Value" }, ],
                                rows: [ 
                                    [ "Parcel ID", cama_data.pid ],
                                    [ "Land Area", formatLandArea( cama_data.land_size, cama_data.land_unit, cama_data.sqft ) ],
                                    [ "Sale Price", cama_data.sale.length > 0 ? `${formatMoney( cama_data.sale[ 0 ].sale_price, {  minimumFractionDigits: 0, } )} (${formatDate( cama_data.sale[ 0 ].sale_date )})` : "NA" ],
                                    [ "Market Val", cama_data.market_value ? formatMoney( cama_data.market_value, {  minimumFractionDigits: 0, } ) : "NA" ],
                        
                                ]
            
                            }, getTableOptions( doc, margin, gap, card_width ) )
                        temp_y = doc.y

                        //Bulding Info
                        doc.x = temp_x 
                        doc.y = temp_y - 11
                        
                        doc.table( {
                            title: "", headers : [ { label:"Label" }, { label:"Value" }, { label:"Labela" }, { label:"Valuea" }, ],
                            rows: [ 
                                ( cama_data.bldg.length > 0 ? [ "Sq. Ft", cama_data.bldg[ 0 ].total_sqft ?? "NA", "Year Built", cama_data.bldg[ 0 ].year_built ?? "NA" ] : [ "Sq. Ft", "NA", "Built", "NA" ] ),
                                ( cama_data.bldg.length > 0 ? [ "Bedrooms", cama_data.bldg[ 0 ].bedrooms ?? "NA", "Full Baths", cama_data.bldg[ 0 ].full_baths ?? "NA" ] : [ "Beds", "NA", "Full Baths", "NA" ] ),
                                                        
                            ]
        
                        }, { ...getTableOptions( doc, margin, gap, card_width ), columnsSize: [ card_width*1.75/6, card_width*1.4/6, card_width*1.75/6, card_width*1.1/6 ] } )

                        doc.x = x  + (card_width + gap)*(factor.width%3)
                        doc.y = y + (card_height + gap)*factor.height + gap/2

                        if( photo.dte )
                            doc
                                .rect( x  + (card_width + gap)*(factor.width%3) + (card_width-47), y + (card_height + gap)*factor.height, 47, 10).fill( 'black' )
                                .fillColor( "yellow" )
                                .fontSize( 8 )
                                .font( "Helvetica" )
                                .text( (photo.dte ? `${photo.dte.substring( 4, 6 )}/${photo.dte.substring( 6, 8 )}/${photo.dte.substring( 0, 4 )}` : "" ), {
                                    align: "right", 
                                    width: card_width - gap/2,
                                })

                        //Card Outline
                        doc.x = x
                        doc.y = y

                        doc
                            .lineWidth( 1 )
                            .rect( doc.x + (card_width + gap)*(factor.width%3), doc.y + (card_height + gap)*factor.height, card_width, card_height)
                            .stroke( )

                    }

                }

                //Footer
                addFooter( doc, margin )

                if( page < pages - 1 )
                    doc.addPage( )

            }

            // Finalize PDF file
            doc.end( )

            response = Buffer.from( await getStreamAsBuffer( doc ) )
            options = { ...options, headers: { "Content-Type": "application/pdf" } }

        }
         
    }catch( err ){
		response = genError( { "message": err.message, "code": err.code } )
        options.status = 500

    }finally{
        return new Response( response, options )

    }

}