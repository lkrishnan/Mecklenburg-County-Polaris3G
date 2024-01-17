import {filterObj} from "$lib/utils"

const validateNumeric = str => ( str.match( /^\d+$/ ) ? true : false ),

validateAlphaNumeric = str => ( str.match( /^[a-zA-Z0-9 ]*$/ ) ? true : false ),

validateSpChar = str => ( str.match( /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ ) ? true : false ),

validateTaxPID = str => ( str.match( /^[0-2]\d{2}-{0,1}\d{3}-{0,1}\d{1}([A-Za-z0-9])$/ ) ? true : false ),

validateTaxPIDMin7 = str => ( str.match( /^[0-2]\d{2}-{0,1}\d{3}-{0,1}\d{1}?([A-Za-z0-9])?$/ ) ? true : false ),

validateGISID = str => ( str.match( /^[0-2]\d{4}(A|C|I|L|M|N|R|S|W|X|[0-9])\d{2}$/ ) ? true : false ),

validateCNumber = str => ( str.match( /^[0-2]\d{4}(C|c)\d{2}$/ ) ? true : false ),

validateIntersection = str => ( str.match( /^(\w+\s*){3}(AND|&)(\s*\w+){3}$/ ) ? true : false ),

validateOwnerName = str => ( str.replace(/\s/g, "" ).match( /^[A-Za-z0-9@&~`()_=+\';:\"\\\/?>.<-]+(,)[A-Za-z0-9@&~`()_=+\';:\"\\\/?>.<-]+$/ ) ? true : false ),

validateName = str => ( str.replace(/\s/g, "" ).match( /^[A-Za-z0-9@&~`()_=+\';:\"\\\/?>.<-]+$/ ) ? true : false ),

validateAddress = str => {
    const space_split = str.split( " " )

    return ( validateNumeric( space_split[ 0 ] ) ? true : false )

},
    
validateLatLng = str => {
    const coords = str.split( "," ).map( coord => parseFloat( coord.trim( ) ) )
            
    if( ( ( coords[ 0 ] >= -81.0562802910356 && coords[ 0 ] <= -80.5567016747919 ) && ( coords[ 1 ] >= 34.9991000096838 && coords[ 1 ] <= 35.5560858870075 ) ) || 
            ( ( coords[ 1 ] >= -81.0562802910356 && coords[ 1 ] <= -80.5567016747919 ) && ( coords[ 0 ] >= 34.9991000096838 && coords[ 0 ] <= 35.5560858870075 ) ) )
        return true
    
    else 
        return false
    
        
},
    
validateStatePlane = inp => {
    const coords = ( Array.isArray( inp ) ? inp : inp.split( "," ).map( coord => parseFloat( coord.trim( ) ) ) )

    if( ( ( coords[ 0 ] >= 1384251 && coords[ 0 ] <= 1537013 ) && ( coords[ 1 ] >= 460978 && coords[ 1 ] <= 660946 ) ) || 
            ( ( coords[ 1 ] >= 1384251 && coords[ 1 ] <= 1537013 ) && ( coords[ 0 ] >= 460978 && coords[ 0 ] <= 660946 ) ) )
        return true
        
    else
        return false

},

validateRings = arr => ( arr.flat( ).filter( item => !validateStatePlane( item ) ).length > 0 ? false : true ),

validateForm = fields => {
    let valid = true

    Object.keys( fields ).forEach( field => {
        if( "rules" in fields[ field ] ){
            // Reset the previous error
            fields[ field ].error = null

            // Check rule and store text if its an error
            fields[ field ].rules.forEach( ( rule, i ) => {
                if( !fields[ field ].error ){
                    fields[ field ].error = rule( ...Object.values( filterObj( fields[ field ], [ "val", "min", "max", "absolute_min", "absolute_max" ] ) ) )
                    
                }
                
            } )

            // Mark of invalid if an error message exisits
            valid = ( fields[ field ].error ? false : valid )

        }
        
    } )

    return { fields: fields, valid: valid }

}

export {validateNumeric, validateAlphaNumeric, validateSpChar, validateCNumber, validateTaxPID, 
    validateGISID, validateOwnerName, validateIntersection, validateAddress, validateLatLng, validateStatePlane, validateRings, validateForm, validateName, validateTaxPIDMin7}