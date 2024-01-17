import {json2URL, sortArrayofObjs} from "$lib/utils"
import {validateNumeric} from "$lib/validate"

const getPrelimPlans = async ( ) => {
        const params = {
            table: "preliminary_plans_ln",
            columns: "projname, projname as value, projname as label",
            group: "projname",
            sort: "projname",
            filter: "projname is not NULL",

        },
        response = await fetch( `/api/query/gis?${json2URL( params )}` ),
        rows = await response.json( )

        if( rows.length > 0 )
            rows.unshift( { label: "Select Preliminary Plan", value: null } )
        
        return rows
        
    },

    getEnggrids = async ( ) => {
        const params = {
            table: "enggrid_py",
            columns: "map_sheet_no, ST_XMin(ST_Extent(shape)) as xmin, ST_YMin(ST_Extent(shape)) as ymin, ST_XMax(ST_Extent(shape)) as xmax, ST_YMax(ST_Extent(shape)) as ymax, map_sheet_no as value, map_sheet_no as label",
            group: "map_sheet_no",
            sort: "map_sheet_no",
            filter: "map_sheet_no is not NULL",

        },
        response = await fetch( `/api/query/gis?${json2URL( params )}` ),
        rows = await response.json( )

        if( rows.length > 0 )
            rows.unshift( { label: "Select Engineering Grid", value: null } )

        return rows

    },

    getAnlyzFieldsInit = ( list, gisid, neigh_code ) => {
        let fields = {
            prop_use: {
                val: null,
                items: [ ],
                selected: 0,
                select_ctrl: true,
                use: true

            },

            narrow: {
                val: null,
                items: [ 
                    { value: "juris", label: "JURISDICTION" }, 
                    { value: "neigh_code", label: "APPRAISAL NEIGHBORHOOD CODE" }, 
                    { value: "stcode", label: "STREET NAME" }  

                ],
                selected: 0,
                select_ctrl: true,

            },

            juris: {
                val: "CHARLOTTE",
                items: [ 
                    { label: "CHARLOTTE", value: "CHARLOTTE" },    
                    { label: "CORNELIUS", value: "CORNELIUS" },
                    { label: "DAVIDSON", value: "DAVIDSON" },
                    { label: "HUNTERSVILLE", value: "HUNTERSVILLE" },
                    { label: "MATTHEWS", value: "MATTHEWS" },
                    { label: "MINT HILL", value: "MINT HILL" },
                    { label: "PINEVILLE", value: "PINEVILLE" },
                    { label: "STALLINGS", value: "STALLINGS" },
                    { label: "UNINC-MECKLENBURG", value: "MECKLENBURG COUNTY-UNINCORPORATED" },

                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            neigh_code: {
                val: null,
                items: [ ],
                selected: null,
                select_ctrl: true,
                use: false,

            },

            stcode: {
                val: null,
                value: "",
                rules: [
                    v => ( v ? null : "Street Name is required" ),
                ], 
                minchar: 3,
                items: [ ],
                nomatch: false,
                spinner: false,
                select_ctrl: false,
                use: false,
                is_open: false,

            },

            buffer: {
                val: null,
                value: null,
                rules: [
                    v => ( v ? null : "Buffer is required" ),
                    v => ( validateNumeric( v ) && parseInt( v ) > -1 && parseInt( v ) <= 5280 ? null : "Buffer should be a number between 0 - 5280 ft." ),
                ],
                select_ctrl: false,
                use: false,

            },

            parcel_acreage: {
                val: null,
                items: [ 
                    { label: "BOTH", value: null },
                    { label: "WITH ACREAGE", value: 1 },
                    { label: "WITHOUT ACREAGE", value: 0 },

                ],
                selected: 0,
                select_ctrl: true,
                use: true,

            },

            land_size_acreage: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Land Size should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),
                ],
                use: false,

            },

            land_size_no_acreage: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Land Size should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: false,

            },

            //No Acreage - POINT LOT, SUBMERGED, TOWNHOME CORNER LOT, WATERVIEW, WATERFRONT, LOT, GOLF COURSE, CONDO UNIT, MED CONDO
            //With Acreage - ACRE, CALC AREA, SMALL ACRE   /  SQUARE FEET

            market_value: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Market Value should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            sale_price: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Sale Price should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            sale_date: {
                min: null,
                max: null,
                absolute_min: "1900-03-06",
                absolute_max: new Date().toISOString().split("T")[0],
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Sale Date should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                ],
                use: true,
                
            },

            year_built: {
                min: 1696,
                max: new Date().getFullYear( ),
                absolute_min: 1696,
                absolute_max: new Date().getFullYear( ),
                decimal_places: 0,
                format: num => num,
                use: true,
                
            },

            sq_ft: {
                min: null,
                max: null,
                absolute_min: 0,
                absolute_max: 0,
                rules: [
                    ( min, max ) => ( ( min && !max ) || ( !min && max ) ? "Enter valid Min and Max or leave both empty." : null ),
                    ( min, max ) => ( min && max ? ( validateNumeric( min ) && validateNumeric( max ) ? null : `Both Min and Max should be numeric` ) : null ),
                    ( min, max, absolute_min, absolute_max ) => ( min && max ? ( min >=absolute_min && min <= absolute_max && max >=absolute_min && max <= absolute_max ? null : `Square Feet should be a number between ${absolute_min} - ${absolute_max}.` ) : null ),
                    ( min, max ) => ( min && max ? ( min <= max ? null : `Min cannot be higher than Max.` ) : null ),

                ],
                use: true,
                
            },

            bedroom: {
                val: null,
                items: [ 
                    { label: "ANY", value: null },    
                    { label: "1 BEDROOM", value: "1" },
                    { label: "2 BEDROOMS", value: "2" },
                    { label: "3 BEDROOMS", value: "3" },
                    { label: "4 BEDROOMS", value: "4" },
                    { label: "5+ BEDROOMS", value: "5" },
                    
                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            fullbath: {
                val: null,
                items: [ 
                    { label: "ANY", value: null },    
                    { label: "1 FULL BATH", value: "1" },
                    { label: "2 FULL BATHS", value: "2" },
                    { label: "3 FULL BATHS", value: "3" },
                    { label: "4 FULL BATHS", value: "4" },
                    { label: "5+ FULL BATHS", value: "5" },
                    
                ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            exterior_frame: {
                val: null,
                items: [ { label: "ANY", value: null }, ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

            story_type: {
                val: null,
                items: [ { label: "ANY", value: null }, ],
                selected: 0,
                select_ctrl: true,
                use: true,
                
            },

        }

        //prop_use
        fields.prop_use.items = sortArrayofObjs( [ { label: "VACANT LAND", "value": "Vacant Land" }, ...list.prop_use ], "value" )
        fields.prop_use.selected = fields.prop_use.items.findIndex( item => item.value == "Single-Family" )
        fields.prop_use.val = fields.prop_use.items[ fields.prop_use.selected ].value

        //narrow
        if( gisid )
            fields.narrow.items.push( { value: "buffer", label: "BUFFER SELECTED PROPERTY" } )

        //neigh_code
        fields.neigh_code.items = sortArrayofObjs( list.neigh_code, "value" )
        fields.neigh_code.selected = ( neigh_code ? fields.neigh_code.items.findIndex( item => item.value == neigh_code ) : 0 )
        fields.neigh_code.val = fields.neigh_code.items[ fields.neigh_code.selected ].value
        
        //land_size
        fields.land_size_acreage = {
            ...fields.land_size_acreage,
            absolute_min: list.land_size_acreage[ 0 ].land_size_min, 
            absolute_max: list.land_size_acreage[ 0 ].land_size_max, 
        }
        fields.land_size_no_acreage = {
            ...fields.land_size_no_acreage,
            absolute_min: list.land_size_no_acreage[ 0 ].land_size_min, 
            absolute_max: list.land_size_no_acreage[ 0 ].land_size_max, 
        }
        
        //market_value
        fields.market_value = { 
            ...fields.market_value, 
            absolute_min: list.market_value[ 0 ].market_value_min, 
            absolute_max: list.market_value[ 0 ].market_value_max, 

        }

        //sales_price
        fields.sale_price = { 
            ...fields.sale_price, 
            absolute_min: list.sale_price[ 0 ].sale_price_min, 
            absolute_max: list.sale_price[ 0 ].sale_price_max, 

        }

        //square_feet
        fields.sq_ft = { 
            ...fields.sq_ft, 
            absolute_min: list.sq_ft[ 0 ].sq_ft_min, 
            absolute_max: list.sq_ft[ 0 ].sq_ft_max, 

        }

        //exterior frame
        fields.exterior_frame.items = [ ...fields.exterior_frame.items, ...sortArrayofObjs( list.exterior_frame, "value" ) ]
        fields.exterior_frame.selected = fields.exterior_frame.items.findIndex( item => item.value == null )
        fields.exterior_frame.val = fields.exterior_frame.items[ fields.exterior_frame.selected ].value

        //story type
        fields.story_type.items = [ ...fields.story_type.items, ...sortArrayofObjs( list.story_type, "value" ) ]
        fields.story_type.selected = fields.story_type.items.findIndex( item => item.value == null )
        fields.story_type.val = fields.story_type.items[ fields.story_type.selected ].value

        return fields

    },

    getAnlyzDropDowns = async ( ) => {
        const api_args = {
                prop_use: {
                    table: "dbo.Polaris_Buildings as bldgs",
                    columns: "bldgs.BuildingCategoryDescription as value, UPPER(bldgs.BuildingCategoryDescription) as label",
                    filter: "LEN(LTRIM(RTRIM(bldgs.BuildingCategoryDescription))) > 0",
                    group: "bldgs.BuildingCategoryDescription"
    
                },
                neigh_code: {
                    table: "dbo.Polaris_AllParceldata as parcels",
                    columns: "parcels.Neighborhood as value, parcels.Neighborhood as label",
                    group: "parcels.Neighborhood",
                    sort: "parcels.Neighborhood",
    
                },
                land_size_acreage: {
                    //table: "(SELECT parcels.LandSize FROM dbo.Polaris_AllParceldata as parcels WHERE parcels.LandUnitDescription in ( 'ACRE', 'CALC AREA', 'SMALL ACRE' ) UNION SELECT parcels.LandSize/43560 FROM dbo.Polaris_AllParceldata as parcels WHERE parcels.LandUnitDescription in ( 'SQUARE FEET' )) as np",
                    //columns: "min(np.LandSize) as land_size_min, max(np.LandSize) as land_size_max",
                    table: "dbo.Polaris_AllParceldata",
                    columns: "min(LandSize/(IIF(LandUnitDescription in ( 'SQUARE FEET' ), 43560, 1))) as land_size_min, max(LandSize/(IIF(LandUnitDescription in ( 'SQUARE FEET' ), 43560, 1))) as land_size_max",
                    filter: "LandUnitDescription in ( 'ACRE', 'CALC AREA', 'SMALL ACRE', 'SQUARE FEET' )"
    
                },
                land_size_no_acreage: {
                    table: "dbo.Polaris_AllParceldata as parcels",
                    columns: "min(parcels.LandSize) as land_size_min, max(parcels.LandSize) as land_size_max",
                    filter: "parcels.LandUnitDescription in ( 'POINT LOT', 'SUBMERGED', 'TOWNHOME CORNER LOT', 'WATERVIEW', 'WATERFRONT', 'LOT', 'GOLF COURSE', 'CONDO UNIT', 'MED CONDO' )",
    
                },
                market_value: {
                    table: "dbo.Polaris_AllParceldata as parcels",
                    columns: "min(parcels.TotalMarketValue) as market_value_min, max(parcels.TotalMarketValue) as market_value_max",
    
                },
                sale_price: {
                    table: "dbo.Polaris_AllParceldata as parcels",
                    columns: "min(parcels.SalePrice) as sale_price_min, max(parcels.SalePrice) as sale_price_max",
    
                },
                sq_ft: {
                    table: "dbo.Polaris_Buildings",
                    columns: "min(totalarea) as sq_ft_min, max(totalarea) as sq_ft_max",
                    filter: "totalarea is NOT NULL",
    
                },
                exterior_frame: {
                    table: "dbo.Polaris_Buildings",
                    columns: "extwall as value, extwall as label",
                    filter: "LEN(extwall) > 0",
                    group: "extwall",
                },
                story_type: {
                    table: "dbo.Polaris_Buildings",
                    columns: "storyheight as value, storyheight as label",
                    filter: "LEN(storyheight) > 0",
                    group: "storyheight",
                }
    
            },
            urls = [
                //prop_use
                { url: `/api/query/cama?${json2URL( api_args.prop_use )}`, tag: "prop_use" },
                
                //neigh_code
                { url: `/api/query/cama?${json2URL( api_args.neigh_code )}`, tag: "neigh_code" },
                
                //land_size_acreage
                { url: `/api/query/cama?${json2URL( api_args.land_size_acreage )}`, tag: "land_size_acreage" },
                
                //land_size_no_acreage
                { url: `/api/query/cama?${json2URL( api_args.land_size_no_acreage )}`, tag: "land_size_no_acreage" },
                
                //market_value
                { url: `/api/query/cama?${json2URL( api_args.market_value )}`, tag: "market_value" },
            
                //sales_price
                { url: `/api/query/cama?${json2URL( api_args.sale_price )}`, tag: "sale_price" },
            
                //square_feet
                { url: `/api/query/cama?${json2URL( api_args.sq_ft )}`, tag: "sq_ft" },
            
                //exterior_frame
                { url: `/api/query/cama?${json2URL( api_args.exterior_frame )}`, tag: "exterior_frame" },
            
                //story_height
                { url: `/api/query/cama?${json2URL( api_args.story_type )}`, tag: "story_type" },
        
            ],
            jsons = await Promise.all( urls.filter( item => item.url ).map( item => fetch( item.url ).then( resp => resp.json( ) ) ) ),
            tags = Object.fromEntries( urls.filter( item => item.url ).map( (item, idx) => [ item.tag, ( Array.isArray( jsons[ idx ] ) ? jsons[ idx ] : [ ] ) ] ) )
        
            return tags
    
    },

    getAnlyzAllowedParams = ( ) => {
        return [ "juris", "neigh_code", "stcode", "buffer", "rings", "nearby", "xy", "latlng", "gisid", 
                    "pid", "assessproid", "matid", "lastname", "firstname", "situs", 
                    "market_value", "sale_price", "sale_date", "land_size_acreage", "land_size_no_acreage", "parcel_acreage",
                "prop_use", "sq_ft", "year_built", "bedroom", "fullbath", "exterior_frame", "story_type", "page", "limit" 
            ]
    }
    

export { getPrelimPlans, getEnggrids, getAnlyzDropDowns, getAnlyzAllowedParams, getAnlyzFieldsInit }