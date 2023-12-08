import {formatDate} from "$lib/format"
import {getPropImage} from "$lib/report"

const addHeader = ( doc, title ) => {
        //Heading
        doc
            .fontSize( 10 )
            .font( "Helvetica-Bold" )
            .text( title, { align: "center" } )

        doc
            .font( "Helvetica" )
            .text( `Date Printed: ${formatDate( new Date( ) )}`, {
                align: "center"
            } )

        return doc
        
    },

    addFooter = ( doc, margin ) => {
        //Footer - Disclaimer
        doc.x = margin
        doc.y = doc.page.height - 67

        doc
            .fontSize( 8 )
            .fillColor( "black" )
            .font( "Helvetica-Oblique" )
            .text( "This map or report is prepared for the inventory of real property within Mecklenburg County and is compiled from recorded deeds, plats, tax maps, surveys, planimetric maps, and other public records and data. Users of this map or report are hereby notified that the aforementioned public primary information sources should be consulted for verification. Mecklenburg County and its mapping contractors assume no legal responsibility for the information contained herein." )

    },
    
    addCardPropertyCard = async ( doc, cama_data, width, height, gap, img_height, factor, page_top, fetch ) => {
        const photo = await getPropImage( cama_data.gisid, fetch, true ),
            card_top = {
                x: (width + gap)*(factor.width%3),
                y: (height + gap)*factor.height,

            }

        //Property Image
        doc
            .moveTo( page_top.x + card_top.x, page_top.y + card_top.y )
            .path("M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z" )
            .path( "M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z" )
            .stroke( )
        //doc
        //    .image( await photo.strm, page_top.x + card_top.x, page_top.y + card_top.y, { width: width, height: img_height } )

        

        doc
            .lineWidth( 1 )
            .rect( page_top.x + card_top.x, page_top.y + card_top.y, width, height)
            .stroke( )

    },

    getTableOptions = ( doc, margin, gap, colwidth ) => {
        const half = doc.page.width/2
                        
        return {
            hideHeader: true,
            columnsSize: [ colwidth/3, colwidth*2/3 ],
            divider: {
                header: { disabled: true, width: 0.7, opacity: 1 },
                horizontal: { disabled: true, width: 1, opacity: 1 }
            },
            padding: 5,
            prepareHeader: ( ) => doc.font( "Helvetica" ).fontSize( 9 ),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                const {x, y, width, height} = rectCell;

                doc
                    .lineWidth(.5)
                    .moveTo(x+width, y)
                    .lineTo(x, y)
                    .stroke()
                
                
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

        }

    }

export {addHeader, addFooter, addCardPropertyCard, getTableOptions}