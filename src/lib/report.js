import {formatFullName2, formatLandArea, formatUCWords, formatDate, formatFEMADate, formatMoney, formatDeed, formatDecimal, formatPercentage, formatAcres} from "$lib/format"
import {json2URL} from "$lib/utils"

const getAssociateData = ( legal_description, sqft, land_size, land_unit, fire_district, special_district, account_type, municipality, land_use_desc ) => [ 
            [ "Legal Desc", ( legal_description ? legal_description : "NA" ) ],
            [ "Land Area", formatLandArea( land_size, land_unit, sqft ) ],
            [ "Fire District", ( fire_district ? formatUCWords( fire_district.toLowerCase( ) ) : "NA" ) ],
            [ "Special District", ( special_district ? formatUCWords( special_district.toLowerCase( ) ) : "NA" ) ],
            [ "Account Type", ( account_type ? formatUCWords( account_type.toLowerCase( ) ) : "NA" ) ],
            [ "Municipality", ( municipality ? formatUCWords( municipality.toLowerCase( ) ) : "NA" ) ],
            [ "Land Use", ( land_use_desc ? formatUCWords( land_use_desc.toLowerCase( ) ) : "NA" ) ],

        ],

    getWaterQualData = async ( gisid, fetch ) => {
        let ret = [ ]

        if( gisid ){
            const response = await fetch( `/api/overlay/feature/gis?table_from=parcels_py&table_to=waterquality_buffers_py&columns=waterquality_buffers_py.objectid&filter=parcels_py.pid='${gisid}'` ),
                data = await response.json( )

            ret.push( [ "Water Quality Buffer", ( data.length > 0 ? "IN" : "OUT" ) ] )

        }

        return ret

    },

    getFloodplainData = async ( gisid, x , y, fetch ) => {
        let ret = [ ]

        if( x && y ){
            const fema_panel_resp = await fetch( encodeURI( `/api/query/gis?table=fema_panels_py&filter=ST_Within(ST_GeomFromText('POINT(${x} ${y})', 2264),shape)` ) ),
                fema_panel_rows =  await fema_panel_resp.json( )

            if( fema_panel_rows.length > 0)
                ret.push( [ "FEMA Panel", `${fema_panel_rows[ 0 ].panel_id} (${formatFEMADate( fema_panel_rows[ 0 ].eff_date )})` ] )
                
        }

        if( gisid ){
            const femafldp_resp = await fetch( `/api/overlay/feature/gis?table_from=parcels_py&table_to=fema_floodplain_changes_py&columns=fema_floodplain_changes_py.objectid&filter=parcels_py.pid='${gisid}'` ),
                commfldp_resp = await fetch( `/api/overlay/feature/gis?table_from=parcels_py&table_to=community_floodplain_changes_py&columns=community_floodplain_changes_py.objectid&filter=parcels_py.pid='${gisid}'` ),
                femafldp_data = await femafldp_resp.json( ),
                commfldp_data = await commfldp_resp.json( )

            ret.push( 
                [ "FEMA Flood Zone", `${( femafldp_data.length > 0 ? "IN" : "OUT" )}` ], 
                [ "Comm Flood Zone", `${( femafldp_data.length > 0 ? "IN" : "OUT" )}` ]

            )

        }

        return ret

    },

    getPostConstDistData = async ( x, y, fetch ) => {
        let ret = [ ]

        if( x && y ){
            const postconst_resp = await fetch( `/api/query/gis?table=PostConst_Districts_py&columns=district&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                postconst_data = await postconst_resp.json( )

            

            if( postconst_data.length > 0 )
                ret.push( [ "Post Construction District", postconst_data[ 0 ].district ] )

        }

        return ret

    },

    getStrmWtrshdData = async ( x, y, fetch ) => {
        let ret = [ ]

        if( x && y ){
            const strmwtrshd_resp = await fetch( `/api/query/gis?table=Watershed_Stormwater_py&columns=name&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                strmwtrshd_data = await strmwtrshd_resp.json( )

            if( strmwtrshd_data.length > 0 )
                ret.push( [ "Stream Watershed District", strmwtrshd_data[ 0 ].name ] )

        }

        return ret

    },

    getDrnkWtrshdData = async ( x, y, fetch ) => {
        let ret = [ ]

        if( x && y ){
            const resp = await fetch( `/api/query/gis?table=Watershed_DrinkingWater_py&columns=name,subarea&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                data = await resp.json( )

            if( data.length > 0 )
                ret.push( [ `Drinking Watershed`, `${data[ 0 ].name} (${data[ 0 ].subarea})` ] )

        }

        return ret

    },

    getLocData = async ( gisid, x , y, fetch ) => {
        let ret = [ ]

        if( x && y ){
            const soi_resp = await fetch( `/api/query/gis?table=sphereofinfluence_py&columns=name&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                soi_data = await soi_resp.json( )

            if( soi_data.length > 0 )
                ret.push( [ "ETJ Area", soi_data[ 0 ].name ] )

            const hist_charlotte_resp = await fetch( `/api/query/gis?table=historic_districts_py&columns=objectid&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                hist_davidson_resp = await fetch( `/api/query/gis?table=davidsonlocalhistoricdistrict_py&columns=objectid&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                hist_charlotte_data = await hist_charlotte_resp.json( ),
                hist_davidson_data = await hist_davidson_resp.json( )

            ret.push( [ "Historic District", ( hist_charlotte_data.length > 0 || hist_davidson_data.length > 0 ? "Yes" : "No" ) ] )

            const census_resp = await fetch( `/api/query/gis?table=census_tracts_2020_py&columns=name20 as tract&filter=ST_Within(ST_GeomFromText( 'POINT(${x} ${y})', 2264 ) , shape)` ),
                census_data = await census_resp.json( )

            ret.push( [ "Census Tract #", ( census_data.length > 0 ? census_data[ 0 ].tract : "NA" ) ] )
                
        }

        if( gisid ){
            const bip_resp = await fetch( `/api/overlay/feature/tax?table_from=parcels_py&table_to=commercial_70_buffer_py&columns=commercial_70_buffer_py.objectid&filter=parcels_py.pid='${gisid}'` ),
                bip_data = await bip_resp.json( )

            ret.push( [ "Inside BIP Opportunity Area", ( bip_data.length > 0 ? "Yes" : "No" ) ] )

        }

        return ret

    },

    getOwnershipData = owner=> owner.map( (o, i) => [ i+1+".", formatFullName2( o, false ) ] ),
    getMailingAddrData = mailaddr => [ mailaddr ],
    getSaleData = sale => sale.splice( 0, 3 ).map( item => [ formatDeed( item.legal_reference, item.sale_date , true ), formatDate( item.sale_date ), formatMoney( item.sale_price ) ] ),
    getPropImage = async ( gisid, fetch, placeholder=false ) => {
        const svg = '<?xml version="1.0" encoding="utf-8"?><svg fill="#cbd5e1" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>no-image</title><path d="M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z"/><path d="M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/></svg>'
        
        if( !gisid )
            return { strm: null, photo_date: null, svg: ( placeholder ? svg : null ) }
            
        const photo_info_resp = await fetch( `/api/query/tax/photo?gisid=${gisid}` ),
            photo_info_rows = await photo_info_resp.json( )

        if( photo_info_rows.length === 0 )
            return { strm: null, photo_date: null, svg: ( placeholder ? svg : null ) }
        
        const photo_resp = await fetch( photo_info_rows[ 0 ].photo_url )

        if( photo_resp.statusText !== "OK" )
            return { strm: null, photo_date: null, svg: ( placeholder ? svg : null ) }

        const blob = await photo_resp.blob( ),
            buf = await blob.arrayBuffer( )

        return { 
            strm: Buffer.from( buf ), 
            dte: photo_info_rows[ 0 ].photo_date, 
            svg: null 

        }

    },

    getLandAnlyzData = async ( gisid, total_sqft, tags, fetch ) => {
        let ret = [ ]

        const getURLs = gisid => [ 
            { 
                url: `/api/query/gis?table=parcels_py as s,jurisdiction_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`, 
                tag: "juris",
                label: "Jurisdiction",

            }, { 
                url: `/api/query/tax?table=parcels_py as s,utility_rightofway_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.utility_name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`, 
                tag: "utilrow",
                label: "Utility ROW",

            }, { 
                url: `/api/query/tax?table=parcels_py as s,railroad_rightofway_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.rr_name as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`, 
                tag: "railrow",
                label: "Railroad ROW",

            }, { 
                url: `/api/query/gis?table=parcels_py as s,fema_floodplain_changes_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.fld_zone as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`, 
                tag: "fldp", 
                label: "FEMA Floodplain",

            }, { 
                url: `/api/query/gis?table=parcels_py as s,WaterQuality_Buffers_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.legend as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}' AND t.legend in('30 ft PC','35 ft PC','50 ft PC','100 ft PC','50 ft PC Undisturbed','100 ft PC Undisturbed','200 ft PC Undisturbed')`, 
                tag: "postconst", 
                label: "Post Const Buffers",

            }, { 
                url: `/api/query/gis?table=parcels_py as s,WaterQuality_Buffers_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.legend as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}' AND t.legend in('100 ft SW','100 ft WS','35 ft SW','40 ft WS','50 ft SW','50 ft WS','30 ft PIPED','35 ft PIPED','100 ft PIPED')`, 
                tag: "swim", 
                label: "SWIM Buffers",

            }, { 
                url: [ 
                    `/api/query/gis?table=parcels_py as s,zoning_cityofcharlotte_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.zonedes as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`,
                    `/api/query/tax?table=parcels_py as s,county_towns_zoning_py as t&columns=ST_Area(st_intersection(s.shape, t.shape)) As sqft, t.zone_des as label&filter=ST_intersects(s.shape, t.shape) AND s.pid='${gisid}'`,
                ],
                tag: "zoning", 
                label: "Zoning",

            }

        ],
        getLabel = ( tag, label ) => {
            switch( tag ){
                case "juris":
                    return ( label ?? "Other" )
                case "zoning":
                    return ( label ?? "Unknown" )
                default: 
                    return ( label ? "Inside" : "Outside" )

            }
            
        },
        urls = getURLs( gisid ).filter( item => tags.includes( item.tag ) ),
        jsons = await Promise.all( 
            urls.map( async item => {
                if( Array.isArray( item.url ) ) //to find zoning intersection
                    return await Promise.all( item.url.map( url => fetch( url ).then( resp => resp.json( ) ) ) )
                else
                    return fetch( item.url ).then( resp => resp.json( ) )
                
            } ) 

        ),
        magic_sqft = 440
        
        urls.forEach( ( item, i ) => {
            const rows = jsons[ i ].flat( ),
                intersect_sqft = rows.reduce( ( accumulator, row ) => accumulator + row.sqft, 0 ),
                non_intersect_sqft = total_sqft - intersect_sqft

            if( [ "juris", "zoning" ].includes( item.tag ) )
                ret = [
                    ...ret,
                    ...rows.map( row => [ row.label, `${formatAcres( row.sqft )} (${formatPercentage( row.sqft, total_sqft )})` ] ), 
                    ...( parseInt( Math.abs( non_intersect_sqft ) ) >= magic_sqft ? [ [ ( item.tag === "juris" ? "Other" : "Unknown" ), `${formatAcres( non_intersect_sqft )} (${formatPercentage( non_intersect_sqft, total_sqft )})` ] ] : [ ] )

                ]
            
            else
                ret = [
                    ...ret,
                    [
                        item.label,
                        `${formatAcres( ( rows.length > 0 ? intersect_sqft : 0 ) )} (${formatPercentage( ( rows.length > 0 ? intersect_sqft : 0 ), total_sqft )})`,
                        `${formatAcres( non_intersect_sqft )} (${formatPercentage( non_intersect_sqft, total_sqft )})`
                    ], 
                    
                ]

        } )

        return ret

    }
    
export {getAssociateData, getWaterQualData, getFloodplainData, getOwnershipData, getMailingAddrData, getSaleData, getLocData, getPostConstDistData, getStrmWtrshdData, getDrnkWtrshdData, getPropImage, getLandAnlyzData}