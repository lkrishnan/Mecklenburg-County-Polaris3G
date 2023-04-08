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
        const keys = [ "addrno", "prefix", "stname", "sttype", "suffix", "unit", "juris", "city", "state", "zip" ]
    
        return keys.reduce( ( addr, key ) => { 
                if( obj.hasOwnProperty( key ) && obj[ key ] )
                    addr += ( ( obj[ key ].trim( ).length > 0 ) ? ( ( addr.trim( ).length > 0 ) ? " " : "" ) + obj[ key ].trim( ) : "" )

                return addr

            }, "" ) 

    },

    formatLandArea = ( acres, unit, gis_acres ) => {
        let landarea = ""
		
		unit = ( unit ? unit.trim( ) : null )
		acres = ( acres ? parseFloat( acres ) : null )
				
		if( acres ){
			if( unit && unit.length > 0 ) //also checks if acres is greater than zero
				landarea = acres.toFixed( ( unit === "AC" ? 3 : 0 ) ) + " " + unit

			else //hack to take care of poorly maintained unit information
				landarea = acres.toFixed( 3 ) + " AC"
			  	
		}else if( gis_acres )
			landarea = parseFloat( gis_acres ).toFixed( 3 ) + " GIS Calc. Acres"
		
		return landarea
    
    },

    formatLegalDesc = desc => {
        desc = desc.trim( )

        console.log( desc )
				
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
						desc = `<a href='https://meckrodhistorical.com/DocumentView.asp?DocumentType=Maps&Instrument="${bk.toString( ).padStart( 4, "0" )}${pg.toString( ).padStart( 4, "0" )}&Close=True' target='_blank' rel='noreferrer' class='text-signify underline underline-offset-4 hover:text-sky-600'>${desc}</a>`

					else if( bk === 884 || bk > 999 )
                        desc = `<a href='https://meckrodhistorical.com/DocumentView.asp?DocumentType=Deed&Instrument="${bk.toString( ).padStart( 4, "0" )}${pg.toString( ).padStart( 4, "0" )}&Close=True' target='_blank' rel='noreferrer' class='text-signify underline underline-offset-4 hover:text-sky-600'>${desc}</a>`
						
					else
						desc = `<a href='https://meckrod.manatron.com/RealEstate/SearchDetail.aspx?bk="${bk}&pg=${pg}&type=BkPg' target='_blank' rel='noreferrer' class='text-signify underline underline-offset-4 hover:text-sky-600'>${desc}</a>`
						
				}

			}
		}
		
        return desc
	},

    formatOwnersAsHTML = owners => {
        let temp =  owners.trim( )
                .split( "|" )
                .reduce( ( html, owner, i ) => {
                    html += ( owner.trim( ).length > 0 ?  "<br/>" + parseInt ( i + 1 ) + ". " + owner.replace( ";", ", " ) : "" )

                    return html

                }, "" )

        return temp

        
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
	}

export { arrayToNumList, concatArr, formatAddr, formatLandArea, formatLegalDesc, formatOwnersAsHTML, formatUCWords }