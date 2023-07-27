const null2empty = inp => {
    return ( ( !inp || ( typeof inp === "undefined" ) ) ? "" : inp.trim( ) ) 

},
removeArrayDups = arr => {
    return arr.reduce( ( unique, item ) => ( unique.includes( item ) ? unique : [ ...unique, item ] ), [ ], )

},
srchstr2qrystr = str => {
    return str.replace(/\s/g, "+").toLowerCase( )

},
qrystr2srchstr = str => {
    return str.replace( /\+/g, " " ).toUpperCase( )

},
filterObj = ( theobj, allowed ) => {
    return Object.keys( theobj )
            .filter( key => allowed.includes( key ) )
            .reduce( ( obj, key ) => { obj[ key ] = theobj[ key ]; return obj; }, { } )

},
json2URL = obj => {
    return Object.keys( obj ).map( ( i ) => i + '=' + encodeURIComponent( obj[ i ] ) ).join( '&' )

},
debounce = ( fn, time ) => { // add a timeout before a function call
    let timeout

    return function( ){
        const functionCall = () => fn.apply( this, arguments )
        clearTimeout( timeout)
        timeout = setTimeout( functionCall, time )
    
    }

},
icon = ( typ, width=36, height=36 ) => {
    const lookup = {
        park: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M538 976H423V827H120l189-274h-95l266-377 266 377h-94l188 274H538v149ZM236 767h189-90 290-89 189-489Zm0 0h489L536 493h89L480 287 335 493h90L236 767Z"/></svg>`,
        link : `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M450 776H280q-83 0-141.5-58.5T80 576q0-83 58.5-141.5T280 376h170v60H280q-58.333 0-99.167 40.765-40.833 40.764-40.833 99Q140 634 180.833 675q40.834 41 99.167 41h170v60ZM325 606v-60h310v60H325Zm185 170v-60h170q58.333 0 99.167-40.765 40.833-40.764 40.833-99Q820 518 779.167 477 738.333 436 680 436H510v-60h170q83 0 141.5 58.5T880 576q0 83-58.5 141.5T680 776H510Z"/></svg>`,
        nearby: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M522 974v-60q45-6 87.5-23.5T689 844l41 44q-46 38-98 59t-110 27Zm269-148-43-41q27-36 45-77.5t25-89.5h61q-8 60-30.5 112.5T791 826Zm27-292q-7-48-25-89t-45-78l43-41q38 50 58 99t30 109h-61ZM437 974q-152-17-254-130.5T81 576q0-154 102-267.5T437 178v60q-127 17-211.5 113.5T141 576q0 128 84.5 224.5T437 914v60Zm253-666q-39-27-81.5-44.5T524 238v-60q54 8 107 29t99 57l-40 44ZM480 787q-85-72-126-133.5T313 540q0-79 50.5-125.5T480 368q66 0 116.5 46.5T647 540q0 52-41 113.5T480 787Zm0-209q19 0 32-13t13-32q0-17-13-31t-32-14q-19 0-32 14t-13 31q0 19 13 32t32 13Z"/></svg>`,
        pdf: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M331 625h37v-83h48q15.725 0 26.362-10.638Q453 520.725 453 505v-48q0-15.725-10.638-26.362Q431.725 420 416 420h-85v205Zm37-120v-48h48v48h-48Zm129 120h84q15 0 26-10.638 11-10.637 11-26.362V457q0-15.725-11-26.362Q596 420 581 420h-84v205Zm37-37V457h47v131h-47Zm133 37h37v-83h50v-37h-50v-48h50v-37h-87v205ZM260 856q-24 0-42-18t-18-42V236q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560V236H260v560ZM140 976q-24 0-42-18t-18-42V296h60v620h620v60H140Zm120-740v560-560Z"/></svg>`,
        library: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M480 996q-78-69-170.5-106T120 853V424q94 0 186.5 43T480 587q81-77 173.5-120T840 424v429q-97 0-189.5 37T480 996Zm0-77q71-51 146.5-81.5T780 799V489q-68 11-143.5 54.5T480 664q-88-81-160-123t-140-52v310q78 8 153.5 38.5T480 919Zm3-475q-65 0-109.5-44.5T329 290q0-65 44.5-109.5T483 136q65 0 109.5 44.5T637 290q0 65-44.5 109.5T483 444Zm.159-60Q522 384 549.5 356.341q27.5-27.66 27.5-66.5Q577 251 549.341 223.5q-27.66-27.5-66.5-27.5Q444 196 416.5 223.659q-27.5 27.66-27.5 66.5Q389 329 416.659 356.5q27.66 27.5 66.5 27.5ZM482 288Zm-2 416Z"/></svg>`,
        lightrail: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M160 796V402q0-90 70.5-119T449 252l32-66H280v-50h400v50H541l-30 66q126 2 207.5 30.5T800 402v394q0 59-40.5 99.5T660 936l60 60v20h-70l-80-80H390l-80 80h-70v-20l60-60q-59 0-99.5-40.5T160 796Zm505-154H220h519-74ZM483 812q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16Zm-2-445h251-509 258ZM220 582h519V427H220v155Zm74 290h371q32 0 53-22t21-54V642H220v154q0 32 21.5 54t52.5 22Zm187-560q-123 0-185.5 14.5T223 367h509q-10-20-70.5-37.5T481 312Z"/></svg>`,
        bus: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M249 936q-13 0-23-7.5T216 909v-84q-29-16-42.5-46T160 715V318q0-74 76.5-108T481 176q166 0 242.5 34T800 318v397q0 34-13.5 64T744 825v84q0 12-10 19.5t-23 7.5h-19q-14 0-24-7.5T658 909v-55H302v55q0 12-10 19.5t-24 7.5h-19Zm232-644h259-520 261Zm177 293H220h520-82Zm-438-60h520V352H220v173Zm106 219q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16Zm308 0q23 0 39-16t16-39q0-23-16-39t-39-16q-23 0-39 16t-16 39q0 23 16 39t39 16ZM220 292h520q-24-26-92-41t-167-15q-118 0-181 13.5T220 292Zm82 502h356q35 0 58.5-27t23.5-62V585H220v120q0 35 23.5 62t58.5 27Z"/></svg>`,
        store: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M160 316v-60h642v60H160Zm5 580V638h-49v-60l44-202h641l44 202v60h-49v258h-60V638H547v258H165Zm60-60h262V638H225v198Zm-50-258h611-611Zm0 0h611l-31-142H206l-31 142Z"/></svg>`,
        key: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M280 644q-28 0-48-20t-20-48q0-28 20-48t48-20q28 0 48 20t20 48q0 28-20 48t-48 20Zm0 172q-100 0-170-70T40 576q0-100 70-170t170-70q72 0 126 34t85 103h356l113 113-167 153-88-64-88 64-75-60h-51q-25 60-78.5 98.5T280 816Zm0-60q58 0 107-38.5t63-98.5h114l54 45 88-63 82 62 85-79-51-51H450q-12-56-60-96.5T280 396q-75 0-127.5 52.5T100 576q0 75 52.5 127.5T280 756Z"/></svg>`,
        information: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M350 836h470V699H350v137ZM140 453h150V316H140v137Zm0 187h150V513H140v127Zm0 196h150V699H140v137Zm210-196h470V513H350v127Zm0-187h470V316H350v137ZM140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Z"/></svg>`,
        moreinfo: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M633 857q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm100 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm100 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm-653 79q-24.75 0-42.375-17.625T120 876V276q0-24.75 17.625-42.375T180 216h600q24.75 0 42.375 17.625T840 276v329q-14-8-29.5-13t-30.5-8V276H180v600h309q4 16 9.023 31.172Q503.045 922.345 510 936H180Zm0-107v47-600 308-4 249Zm100-53h211q4-16 9-31t13-29H280v60Zm0-170h344q14-7 27-11.5t29-8.5v-40H280v60Zm0-170h400v-60H280v60Zm452.5 579q-77.5 0-132.5-55.5T545 828q0-78.435 54.99-133.718Q654.98 639 733 639q77 0 132.5 55.282Q921 749.565 921 828q0 76-55.5 131.5t-133 55.5Z"/></svg>`,
        circle: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z"/></svg>`,
        uncheck: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M833 1015 718 900q-50 36-110 56t-128 20q-85 0-158-30.5T195 861q-54-54-84.5-127T80 576q0-68 20-128t56-110L26 208l43-43 807 807-43 43Zm-353-99q55 0 104-15.5t91-43.5L498 680l-77 78-165-166 45-45 120 120 32-32-254-254q-28 42-43.5 91T140 576q0 145 97.5 242.5T480 916Zm324-102-43-43q28-42 43.5-91T820 576q0-145-97.5-242.5T480 236q-55 0-104 15.5T285 295l-43-43q50-36 110-56t128-20q84 0 157 31t127 85q54 54 85 127t31 157q0 68-20 128t-56 110ZM585 594l-46-45 119-119 46 45-119 119Zm-62-61Zm-86 86Z"/></svg>`,
        zoomin: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M796 935 533 672q-30 26-69.959 40.5T378 727q-108.162 0-183.081-75Q120 577 120 471t75-181q75-75 181.5-75t181 75Q632 365 632 471.15 632 514 618 554q-14 40-42 75l264 262-44 44ZM377 667q81.25 0 138.125-57.5T572 471q0-81-56.875-138.5T377 275q-82.083 0-139.542 57.5Q180 390 180 471t57.458 138.5Q294.917 667 377 667Zm-31-85v-82h-82v-60h82v-81h60v81h81v60h-81v82h-60Z"/></svg>`,
        payment: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M540 636q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM220 776q-24.75 0-42.375-17.625T160 716V316q0-24.75 17.625-42.375T220 256h640q24.75 0 42.375 17.625T920 316v400q0 24.75-17.625 42.375T860 776H220Zm100-60h440q0-42 29-71t71-29V416q-42 0-71-29t-29-71H320q0 42-29 71t-71 29v200q42 0 71 29t29 71Zm480 180H100q-24.75 0-42.375-17.625T40 836V376h60v460h700v60ZM220 716V316v400Z"/></svg>`,
        realestateagent:  `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M770 701V379L560 232 350 379v129h-60V349l270-193 270 193v352h-60ZM560 232Zm20 204h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm66 478-311-89v57H40V568h309l255 96q27 10 45.5 32.5T668 761h114q42 0 70 30t28 81v26l-314 96Zm-466-92h94V628h-94v274Zm462 30 256-78q-6-19-15-26t-21-7H575q-30 0-55.5-4T471 806l-81-25 22-58 73 24q25 8 47.5 11t71.5 3q0-12-4.5-23.5T584 721l-245-93h-84v214l307 90ZM194 765Zm410-4Zm-410 4Zm61 0Z"/></svg>`,
        location: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M480.089 566Q509 566 529.5 545.411q20.5-20.588 20.5-49.5Q550 467 529.411 446.5q-20.588-20.5-49.5-20.5Q451 426 430.5 446.589q-20.5 20.588-20.5 49.5Q410 525 430.589 545.5q20.588 20.5 49.5 20.5ZM480 897q133-121 196.5-219.5T740 504q0-117.79-75.292-192.895Q589.417 236 480 236t-184.708 75.105Q220 386.21 220 504q0 75 65 173.5T480 897Zm0 79Q319 839 239.5 721.5T160 504q0-150 96.5-239T480 176q127 0 223.5 89T800 504q0 100-79.5 217.5T480 976Zm0-472Z"/></svg>`,
        flood: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M80 976v-60q34-3 54.5-21.5T208 876q53 0 75.5 20t60.5 20q38 0 60.5-20t75.5-20q53 0 76 20t60 20q38 0 60.5-25t75.5-25q53 0 73.5 23.5T880 916v60q-42 0-68.5-25T752 926q-33 0-58 25t-78 25q-53 0-78-20t-58-20q-33 0-58 20t-78 20q-53 0-78-20t-58-20q-33 0-59.5 20T80 976Zm264-190q-53 0-78-20t-58-20q-33 0-59.5 20T80 786v-60q34-3 54.5-21.5T208 686q11 0 22.5 1.5T251 692l-51-185-62 77-47-38 300-370 445 170-22 56-92-35 86 321q18 10 36.5 24t35.5 13v61q-42 0-68.5-25T752 736q-33 0-58 25t-78 25q-53 0-78-20t-58-20q-33 0-58 20t-78 20Zm0-60q31 0 55.5-17.5T456 687l-37-136 136-36 55 211q38 4 62.5-22t69.5-28l-90-336-241-93-164 202 74 274q7 2 12 2.5t11 .5Zm151-237Z"/></svg>`,
        unfold: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M480 936 300 756l44-44 136 136 136-136 44 44-180 180ZM344 444l-44-44 180-180 180 180-44 44-136-136-136 136Z"/></svg>`,
        checksm: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M400 738 247 585l42-42 111 111 271-271 42 42-313 313Z"/></svg>`,
        arrowback: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M480 896 160 576l320-320 42 42-248 248h526v60H274l248 248-42 42Z"/></svg>`,
        pushpin: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="m634 608 86 77v60H510v241l-30 30-30-30V745H240v-60l80-77V276h-50v-60h414v60h-50v332Zm-313 77h312l-59-55V276H380v354l-59 55Zm156 0Z"/></svg>`,
        signpost: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M450 976V796H230L120 686l110-110h220v-90H156V266h294v-90h60v90h220l110 110-110 110H510v90h294v220H510v180h-60ZM216 426h489l50-50-50-50H216v100Zm39 310h489V636H255l-50 50 50 50Zm-39-310V326v100Zm528 310V636v100Z"/></svg>`,
        polygon: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17" /></svg>`,
        rect: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 96 960 960" width="${width}" class="fill-current"><path d="M80 896V256h800v640H80Zm60-60h680V316H140v520Zm0 0V316v520Z"/></svg>`,
        id: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M10 7V9H9V15H10V17H6V15H7V9H6V7H10M16 7C17.11 7 18 7.9 18 9V15C18 16.11 17.11 17 16 17H12V7M16 9H14V15H16V9Z" /></svg>`,
        selectsrch: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M18 12H20V14H18V12M14 16H16V18H14V16M20 17C20 17.55 19.55 18 19 18H18V16H20V17M7 4H8V6H6V5C6 4.45 6.45 4 7 4M19 4C19.55 4 20 4.45 20 5V6H18V4H19M14 6V4H16V6H14M10 6V4H12V6H10M10 18V16H12V18H10M7 18C6.45 18 6 17.55 6 17V16H8V18H7M6 12H8V14H6V12M6 8H8V10H6V8M20 8V10H18V8H20M3 8H4V20H16V21C16 21.54 15.57 22 15.03 22H15L3 22C2.45 22 2 21.55 2 21V9C2 8.45 2.45 8 3 8Z" /></svg>`,
        markuppt: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M9 9V15H15V9H9M11 11H13V13H11V11Z" /></svg>`,
        markupline: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5" /></svg>`,
        markuppoly: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17" /></svg>`,
        tape: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M9,5A7,7 0 0,1 16,12H17V15H16V19H9A7,7 0 0,1 2,12A7,7 0 0,1 9,5M9,8A4,4 0 0,0 5,12A4,4 0 0,0 9,16A4,4 0 0,0 13,12A4,4 0 0,0 9,8M17,17H22V19L22,21H20V19H17V17Z" /></svg>`,
        print: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M19 8C20.66 8 22 9.34 22 11V17H18V21H6V17H2V11C2 9.34 3.34 8 5 8H6V3H18V8H19M8 5V8H16V5H8M16 19V15H8V19H16M18 15H20V11C20 10.45 19.55 10 19 10H5C4.45 10 4 10.45 4 11V15H6V13H18V15M19 11.5C19 12.05 18.55 12.5 18 12.5C17.45 12.5 17 12.05 17 11.5C17 10.95 17.45 10.5 18 10.5C18.55 10.5 19 10.95 19 11.5Z" /></svg>`,
        overlays: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z" /></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`,
        ruler: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M1.39,18.36L3.16,16.6L4.58,18L5.64,16.95L4.22,15.54L5.64,14.12L8.11,16.6L9.17,15.54L6.7,13.06L8.11,11.65L9.53,13.06L10.59,12L9.17,10.59L10.59,9.17L13.06,11.65L14.12,10.59L11.65,8.11L13.06,6.7L14.47,8.11L15.54,7.05L14.12,5.64L15.54,4.22L18,6.7L19.07,5.64L16.6,3.16L18.36,1.39L22.61,5.64L5.64,22.61L1.39,18.36Z" /></svg>`,
        setsquare: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M17.7 17.7L16.6 18.8L15.9 18L17 17L15 15L14 16.1L13.3 15.4L14.4 14.3L12.5 12.4L11.4 13.5L10.7 12.8L11.8 11.7L9.8 9.8L8.7 10.9L8 10.2L9 9L7.1 7.1L6 8.1L5.3 7.4L6.4 6.3L4 4V20H20L17.7 17.7M7 17V11.2L12.8 17H7Z" /></svg>`,
        draw: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z" /></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>`,
        alert: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" /></svg>`,
        maplegend: `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 0 24 24" width="${width}" class="fill-current"><path d="M9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3L20.34,3.03L15,5.1L9,3M8,5.45V17.15L5,18.31V6.46L8,5.45M10,5.47L14,6.87V18.53L10,17.13V5.47M19,5.7V17.54L16,18.55V6.86L19,5.7M7.46,6.3L5.57,6.97V9.12L7.46,8.45V6.3M7.46,9.05L5.57,9.72V11.87L7.46,11.2V9.05M7.46,11.8L5.57,12.47V14.62L7.46,13.95V11.8M7.46,14.55L5.57,15.22V17.37L7.46,16.7V14.55Z" /></svg>`,

    }
    
    return lookup[ typ ]
    
}

export { null2empty, removeArrayDups, srchstr2qrystr, qrystr2srchstr, filterObj, json2URL, debounce, icon }