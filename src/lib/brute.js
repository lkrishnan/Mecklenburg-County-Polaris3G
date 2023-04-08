export default async function brute( fetch, srch_type, srch_str ){
    try{
        // Check for bad search strings
        if( ( srch_type === "address" && !validateNumeric( space_split[ 0 ] ) ) ||
                ( srch_type === "intersection" && !validateIntersection( srch_str ) ) ||
                ( srch_type === "intersection" && !validateIntersection( srch_str ) ) ||
                ( srch_type === "owner" && ! validateOwnerName( srch_str ) ) ||
                [ "park", "library", "school", "business", "busstop", "lightrail" ].includes( srch_type ) && validateNumeric( srch_str ) && validateCNumber( srch_str ) )
                    throw "hands_up"

        else{ // Search
            const result = await fetch( getAPIURL( srch_type, srch_str ) ),
                response = await result.json( )
    
            return response
        }
            
    }catch( exception ){
        switch( exception ){
            case "hands_up":
                return [ ]
                break

        }
                
    }    

}
