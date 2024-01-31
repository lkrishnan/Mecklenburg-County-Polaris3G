import {json2URL} from "$lib/utils"

const genError = err => ( { "statusCode":500, "error": "Internal Server Error", ...err } ),
    getInvalidParams = ( params, allowed ) => {
        if( Array.from( params ).length > 0 )
            return Array.from( params )
                .map( param => ( allowed.includes( param[ 0 ] ) ? null :  `${param[ 0 ]}=${param[ 1 ]}` ) )
                .filter( n => n )
        
        else
            return Object.keys( params )
                    .map( param => ( allowed.includes( param ) ? null : param ) )
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
                return `/api/validate/address?addr=${encodeURIComponent( srch_str )}`
            
            case "pid": 
                return `/api/validate/pid?pid=${srch_str}`

            case "gisid": 
                return `/api/validate/gisid?gisid=${srch_str}`

            case "owner": 
                const comma_split = srch_str.split( "," ).map( item => item.trim( ) )
                return `/api/validate/owner?get=fullname&lastname=${encodeURIComponent( comma_split[ 0 ] )}&firstname=${(comma_split.length > 1 ? encodeURIComponent( comma_split[ 1 ] ) : "" )}`

            case "ownerfirst":
                return `/api/validate/owner?get=firstname&firstname=${encodeURIComponent( srch_str )}`

            case "ownerlast":
                return `/api/validate/owner?get=lastname&lastname=${encodeURIComponent( srch_str )}`

            case "road": 
                return `/api/validate/road?name=${srch_str}`

            case "stcode": 
                return `/api/validate/road?stcode=${srch_str}`

            case "situs":
                return `/api/validate/situs?address=${srch_str}`

            case "intersection": 
                return `/api/validate/intersection?${json2URL( srch_str.split( "&" ).map( ( item, i ) => ( { ['street'+(i+1)]: item.trim( ) } ) ).reduce( ( prev, curr ) => ( { ...prev, ...curr } ) ), )}`

            case "intersectionstcode":
                return `/api/validate/intersection?${json2URL( srch_str.split( "&" ).map( ( item, i ) => ( { ['stcode'+(i+1)]: item.trim( ) } ) ).reduce( ( prev, curr ) => ( { ...prev, ...curr } ) ), )}`
            break

            case "park": 
                return `/api/validate/facility/park?name=${encodeURIComponent( srch_str )}`

            case "school": 
                return `/api/validate/facility/school?name=${encodeURIComponent( srch_str )}`

            case "library": 
                return `/api/validate/facility/library?name=${encodeURIComponent( srch_str )}`

            case "business": 
                return `/api/validate/facility/business?name=${encodeURIComponent( srch_str )}`

            case "lightrail": 
                return `/api/validate/facility/lightrail?name=${encodeURIComponent( srch_str )}`

            case "busstop": 
                return `/api/validate/facility/busstop?name=${encodeURIComponent( srch_str )}`
    
            default:
                return null

        }

    },

    getPrelimPlan = async projname => {
        const params = {
                table: "preliminary_plans_ln",
                columns: "ST_XMin(ST_Extent(shape)) as xmin, ST_YMin(ST_Extent(shape)) as ymin, ST_XMax(ST_Extent(shape)) as xmax, ST_YMax(ST_Extent(shape)) as ymax",
                filter: `projname = '${projname}'`,

            },
            response = await fetch( `/api/query/gis?${json2URL( params )}` ),
            rows = await response.json( )

        return rows

    },

    getUSNG = async ( lat, lng, fetch=null ) => {
        const usng_resp = await fetch( `/api/query/usng?lat=${lat}&lng=${lng}` ),
            usng_json = await usng_resp.json( )

        return usng_json.usng

    },

    getProjCoords = async ( x, y, in_epsg, out_epsg, fetch=null ) => {
        const proj_resp = await fetch( `/api/query/gis/project?x=${x}&y=${y}&in_epsg=${in_epsg}&out_epsg=${out_epsg}` ),
            proj_rows = await proj_resp.json( )

        if( out_epsg === "4326" )
            return ( proj_rows.length > 0 ? { lat: proj_rows[ 0 ].y, lng: proj_rows[ 0 ].x } : { lat: null, lng: null } )

        else if( out_epsg === "2264" ) 
            return ( proj_rows.length > 0 ? proj_rows[ 0 ] : { x: null, y: null } )


    },

    getPOI = async ( poi, fetch=null ) => {
        let _poi = { 
            ...poi,
            ...( poi?.x && poi?.y ? { } : await getProjCoords( poi.lng, poi.lat, "4326", "2264", fetch ) ),
            ...( poi?.lat && poi?.lng ? { } : await getProjCoords( poi.x, poi.y, "2264", "4326", fetch ) ),
    
        }

        _poi.usng = ( _poi.lat && _poi.lng ? await getUSNG( _poi.lat, _poi.lng, fetch ) : null )
    
        return _poi

    }
    
export {genError, getInvalidParams, getErrorMsg, getAPIURL,  getProjCoords, getUSNG, getPOI, getPrelimPlan}