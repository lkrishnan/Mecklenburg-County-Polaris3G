const genError = err => {
    return { "statusCode":500, "error": "Internal Server Error", ...err }
        
    },
    getInvalidParams = ( params, allowed ) => {
        return Array.from( params )
                .map( param => ( allowed.includes( param[ 0 ] ) ? null :  `${param[ 0 ]}=${param[ 1 ]}` ) )
                .filter( n => n )

    },
    getErrorMsg = ( params, allowed ) => {
        if( Array.from( params ).length > 0 ){
            const invalid_params = getInvalidParams( params, allowed ).join( ', ' )

            return `invalid paramater(s) sent: ${invalid_params}`

        }else 
            return "No parameters were sent"

    },
    getAPIURL = ( srch_type, srch_str ) => {
        switch( srch_type ){
            case "address":
                return `/api/validate/address?addr=${srch_str}`

            case "situs":
                return `/api/validate/situs?address=${srch_str}`

            case "business": 
                return `/api/validate/facility/business?name=${srch_str}`

            case "busstop": 
                return `/api/validate/facility/busstop?name=${srch_str}`

            case "intersection": 
                const amprsnd_split = srch_str.split( "&" ).map( item => item.trim( ) )
                return `/api/validate/intersection?street1=${amprsnd_split[ 0 ]}&street2=${amprsnd_split[ 1 ]}`
                
            case "gisid": 
                return `/api/validate/gisid?gisid=${srch_str}`

            case "lightrail": 
                return `/api/validate/facility/lightrail?name=${srch_str}`

            case "library": 
                return `/api/validate/facility/library?name=${srch_str}`

            case "lightrail": 
                return `/api/validate/facility/lightrail?name=${srch_str}`

            case "owner": 
                const comma_split = srch_str.split( "," ).map( item => item.trim( ) )
                return `/api/validate/owner?get=fullname&lastname=${comma_split[ 0 ]}&firstname=${comma_split[ 1 ]}`

            case "ownerlast":
                return `/api/validate/owner?get=lastname&lastname=${srch_str}`

            case "park": 
                return `/api/validate/facility/park?name=${srch_str}`

            case "pid": 
                return `/api/validate/pid?pid=${srch_str}`
                
            case "road": 
                return `/api/validate/road?name=${srch_str}`

            case "school": 
                return `/api/validate/facility/school?name=${srch_str}`
                
            default:
                return null

        }

    }

export { genError, getInvalidParams, getErrorMsg, getAPIURL }