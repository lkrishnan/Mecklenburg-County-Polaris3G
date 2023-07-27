import { validateNumeric } from "$lib/validate"

const arrayToNumList = ( arr ) => {
		let htmlstr = ""
	
		for( var l = arr.length-1; l >= 0; l-- ){
			if( arr[ l ].trim( ).length === 0 )
				arr.splice ( l,1 )
						
		} 

		if( arr.length > 1 ){
			for( i = 0; i < arr.length; i++ )
				htmlstr += ( htmlstr.length > 0 ? "<br/>" : "" ) + parseInt( i + 1, 10 ) + ". " + arr[ i ].trim( )
			
		}else if( arr.length > 0 )	
			htmlstr += arr[ 0 ].trim( )
		
		return htmlstr

	},
	concatArr = ( arr, joiner=" " ) => {
    	return arr.reduce( ( str, item ) => {
			if( item )
				str += ( str.length > 0 ? joiner : "" ) + item.trim( )

			return str

			}, "" )

	},

    formatAddr = obj => {
        const keys = [ "address", "addrno", "prefix", "stname", "sttype", "suffix", "unit", "juris", "city", "state", "zip" ]
    
        return keys.reduce( ( addr, key ) => { 
                if( obj.hasOwnProperty( key ) && obj[ key ] )
                    addr += ( ( obj[ key ].trim( ).length > 0 ) ? ( ( addr.trim( ).length > 0 ) ? " " : "" ) + obj[ key ].trim( ) : "" )

                return addr

            }, "" ) 

    },

	formatDeed = ( legal_ref, saledate, astext=false ) => {
		const a = new Date( saledate ),
			b = new Date( "03/01/1990" ),
			msDateA = Date.UTC( a.getFullYear( ), a.getMonth( ) + 1, a.getDate( ) ),
			msDateB = Date.UTC( b.getFullYear( ), b.getMonth( ) + 1, b.getDate( ) ),
			legal_ref_arr = legal_ref.split( "-" ),
			zeroPad = ( num, places ) => {
				var zero = places - num.toString( ).length + 1;
				return Array( + ( zero > 0 && zero ) ).join( "0" ) + num;
			}

		let deed = "NA"

		if( legal_ref_arr.length === 2 ){
			const deedbook = legal_ref_arr[ 0 ],
				deedpage = legal_ref_arr[ 1 ]

			if( astext )
				deed = deedbook + "-" + deedpage

			else{
				if( ( parseFloat( msDateA ) <= parseFloat( msDateB ) ) && ( ( parseInt( deedbook ) > 1 && parseInt( deedbook )  < 33 ) || ( parseInt( deedbook ) > 33 && parseInt( deedbook )  < 6219 ) ) ){
					deed = "<a href='http://meckrodhistorical.com/DocumentView.asp?DocumentType=Deed&Instrument=" + 
						zeroPad( parseInt( deedbook ), 4 ) + zeroPad( parseInt( deedpage ), 4 ) + "&Close=True' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>" + 
						deedbook + "-" + deedpage + "</a>"
				}else if( parseFloat( msDateA ) > parseFloat( msDateB ) ){
					deed = "<a href='https://meckrod.manatron.com/RealEstate/SearchDetail.aspx?bk=" + deedbook.replace( /^0+/, '' ) + "&pg=" + deedpage.replace( /^0+/, '' ) + 
						"&type=BkPg' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>" + deedbook + "-" + deedpage + "</a>"
				}

			}

		}

		return deed

	},

	/*formatDeed = ( deedbook, deedpage, saledate, astext ) => {
		const a = new Date( saledate ),
			b = new Date( "03/01/1990" ),
			msDateA = Date.UTC ( a.getFullYear( ), a.getMonth( ) + 1, a.getDate( ) ),
			msDateB = Date.UTC ( b.getFullYear( ), b.getMonth( ) + 1, b.getDate( ) )

		let deed = "NA"

		if( deedbook && deedpage ){
			deedbook = deedbook.trim( )
			deedpage = deedpage.trim( )

			if( deedbook.length > 0 & deedpage.length > 0 ){
				if( astext )
					deed = deedbook + "-" + deedpage

				else{
					if( ( parseFloat( msDateA ) <= parseFloat( msDateB ) ) && ( ( parseInt( deedbook ) > 1 && parseInt( deedbook )  < 33 ) || ( parseInt( deedbook ) > 33 && parseInt( deedbook )  < 6219 ) ) ){
						var zeroPad = function( num, places ){
							var zero = places - num.toString( ).length + 1;
							return Array( + ( zero > 0 && zero ) ).join( "0" ) + num;
						}
						
						deed = "<a href='http://meckrodhistorical.com/DocumentView.asp?DocumentType=Deed&Instrument=" + 
							zeroPad( parseInt( deedbook ), 4 ) + zeroPad( parseInt( deedpage ), 4 ) + "&Close=True' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>" + 
							deedbook + "-" + deedpage + "</a>";
					}else if( parseFloat( msDateA ) > parseFloat( msDateB ) ){
						deed = "<a href='https://meckrod.manatron.com/RealEstate/SearchDetail.aspx?bk=" + deedbook.replace( /^0+/, '' ) + "&pg=" + deedpage.replace( /^0+/, '' ) + 
							"&type=BkPg' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>" + deedbook + "-" + deedpage + "</a>";
					}

				}

			}


		}

		return deed
			
	},*/

    formatLandArea = ( acres, unit, unit_desc, gis_acres ) => {
        let landarea = ""
		
		if( acres && unit && unit.length > 0 ){
			if( [ "AC", "CA", "DE", "GA", "GC", "SU", "TCR", "WF" ].includes( unit ) )
				landarea = `${parseFloat( acres ).toFixed( 3 )} Acres (${unit} - ${unit_desc})`

			else if( [ "CU", "SF" ].includes( unit ) )
				landarea = `${parseFloat( acres ).toFixed( 3 )} SqFt (${unit} - ${unit_desc})`

			else if( [ "LT", "RSV" ].includes( unit ) )
				landarea = `${parseFloat( acres ).toFixed( 3 )} Acres (GIS Calc)`
				
		}else if( gis_acres )
			landarea = `${parseFloat( gis_acres ).toFixed( 3 )} Acres (GIS Calc)`
		
		/*unit = ( unit ? unit.trim( ) : null )
		acres = ( acres ? parseFloat( acres ) : null )
				
		if( acres ){
			if( unit && unit.length > 0 ) //also checks if acres is greater than zero
				landarea = acres.toFixed( ( unit === "AC" ? 3 : 0 ) ) + " " + unit

			else //hack to take care of poorly maintained unit information
				landarea = acres.toFixed( 3 ) + " AC"
			  	
		}else if( gis_acres )
			landarea = parseFloat( gis_acres ).toFixed( 3 ) + " GIS Calc. Acres"*/
		
		return landarea
    
    },

    formatLegalDesc = desc => {
        desc = desc.trim( )
				
		if( desc.match( /M\d+(-|\s)\d+/ ) ){
			const result = desc.match( /M\d+(-|\s)\d+/ ),
				splitter = ( result.indexOf( "-" ) > -1 ? "-" : " " )
				
            let bk = result[ 0 ].substring( 1, result[ 0 ].indexOf ( splitter ) ),
				pg = result[ 0 ].substring( result[ 0 ].indexOf ( splitter ) + 1, result[ 0 ].length )

            
				
			if( validateNumeric( bk ) && validateNumeric( pg ) ){
				bk = parseInt( bk )
				pg = parseInt( pg )
				
				if( bk > 2 ){
					if( ( bk < 23 ) || ( bk === 23 && pg < 645 ) || ( bk === 230 ) || ( bk === 332 ) )
						desc = `<a href='https://meckrodhistorical.com/DocumentView.asp?DocumentType=Maps&Instrument="${bk.toString( ).padStart( 4, "0" )}${pg.toString( ).padStart( 4, "0" )}&Close=True' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>${desc}</a>`

					else if( bk === 884 || bk > 999 )
                        desc = `<a href='https://meckrodhistorical.com/DocumentView.asp?DocumentType=Deed&Instrument="${bk.toString( ).padStart( 4, "0" )}${pg.toString( ).padStart( 4, "0" )}&Close=True' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>${desc}</a>`
						
					else
						desc = `<a href='https://meckrod.manatron.com/RealEstate/SearchDetail.aspx?bk="${bk}&pg=${pg}&type=BkPg' target='_blank' rel='noreferrer' class='text-segundo underline underline-offset-4 hover:text-primero'>${desc}</a>`
						
				}

			}
		}
		
        return desc
	},

    formatOwnersAsHTML = ( owners ) => {
		let temp = owners.reduce( ( html, owner, i ) => {
			if( owner && owner.trim( ).length > 0 ){
				const owner_arr = owner.split( "," )
				html += `${( i > 0 ? "<br/>" : "" )} ${parseInt ( i + 1 )}. ${owner_arr[ 1 ]} ${owner_arr[ 0 ]}`
				
			}

			return html

		}, "<br/>" )


		/*let temp =  owners.trim( )
                .split( "|" )
                .reduce( ( html, owner, i ) => {
                    html += ( owner.trim( ).length > 0 ?  "<br/>" + parseInt ( i + 1 ) + ". " + owner.replace( ";", ", " ) : "" )

                    return html

                }, "" )*/

        return temp
        
    },

	formatFullName = ( lastname, firstname, comma=true ) => {
		let fullname = ""

		if( lastname ){
			if( comma )
				fullname = ( lastname ?? "" ) + ( firstname ? ", " + firstname : "" )

			else
				fullname = ( firstname ?? "" ) + ( lastname ? " " + lastname : "" )
			
		}

		console.log( fullname)
		
		return fullname

	},

    formatUCWords = str => {
		//  discuss at: http://phpjs.org/functions/ucwords/
		// original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// improved by: Waldo Malqui Silva
		// improved by: Robin
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Onno Marsman
		//    input by: James (http://www.james-bell.co.uk/)
		//   example 1: ucwords('kevin van  zonneveld');
		//   returns 1: 'Kevin Van  Zonneveld'
		//   example 2: ucwords('HELLO WORLD');
		//   returns 2: 'HELLO WORLD'

		return ( str + "" ).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, $1 => $1.toUpperCase( ) )
	},

	//Format Numbers 
	formatCommas = ( num, decimals = 0 ) => {
		if( num === null || isNaN( num ) ) 
			return "N/A"

		return parseFloat( num ).toLocaleString( "en-US", { maximumFractionDigits: decimals, } )

	},
	formatMoney = num => {
  		if( num === null || isNaN( num ) ) 
			return "N/A"

  		return parseFloat( num ).toLocaleString( "en-US", { style: "currency", currency: "USD", } )

	},
	formatDate = dateString => {
  		let date = new Date( dateString )
  		
		return date.toLocaleDateString( "en-US" )

	}

export { arrayToNumList, concatArr, formatAddr, formatLandArea, formatLegalDesc, formatOwnersAsHTML, formatUCWords, formatDeed, formatCommas, formatMoney, formatDate, formatFullName }