import { ninefireCols as palette, initConfigs } from './data/consts.js'
const debug = false;

function main() {
    const idx = 1
    const config = initConfigs[idx]; 
    const figHeight = config.height;
    const figWidth = config.width;
    const arry = config.obj;
    const lenght = figHeight * figWidth;
    var array = arry;
    render( array, figHeight, figWidth);
    setInterval( function() { array = updateLoop( array, figHeight, figWidth)}, 200);
}
function updateLoop( array, figHeight, figWidth) {
// {{{
    const newArray = updateArryIter( array, figHeight, figWidth, figHeight * figWidth);
    render( newArray, figHeight, figWidth);
    return newArray;
// }}}
}
function render( array, figHeight, figWidth) {
// {{{
    function genRow( array, rows, cols) {
        function genCol( array, cols) {
            if (cols == 0) return '';
            const idx = (figWidth - cols) + figWidth * (figHeight - rows);
            const value = 0 + array[idx];
            const colInit = (() => {
                if (debug == true) {
                    const result = `<td><div class = "pixel-idx">${idx}</div>` + value;
                    return result;
                } else {
                    const colorComp = palette[value];
                    const color = `${colorComp.r},${colorComp.g},${colorComp.b}`;
                    const result = `<td style = "background-color : rgb(${color})">`;
                    return result;
                }
            })();
            const colFinish = '</td>';
            return colInit + colFinish + genCol( array, cols - 1);
        }
        if (rows == 0) return '';
        const rowInit = '<tr>';
        const row = genCol( array, cols);
        const rowFinish = '</tr>';
        return rowInit.concat( row).concat( rowFinish).concat( 
            genRow( array, rows - 1, cols));
    }
    const tableInit = '<table cellpadding = 0 cellspacing = 0>';
    const table = genRow( array, figHeight, figWidth);
    const tableFinish = '</table>';
    document.querySelector( '#canvas').innerHTML = tableInit + table + tableFinish;
// }}}
}
// /////////////////////////////////////////////////////////////////////////////
//                 Calculating neighbors and updating arrays
// /////////////////////////////////////////////////////////////////////////////
function calcNeighbors( array, row, col, figHeight, figWidth) {
// {{{
    const vertNeighbors = (() => { 
        let n = 0;
        if (row < figHeight - 1) n += array[(row + 1) * figWidth + col];
        if (row > 0) n += array[(row - 1) * figWidth + col];
        return n;
    })()
    const horizNeighbors = (() => { 
        let n = 0;
        if (col < figWidth - 1) n += array[row * figWidth + col + 1];
        if (col > 0) n += array[row * figWidth + col - 1];
        return n;
    })()
    const diagSupNeighbors = (() => { 
        let n = 0;
        if (row > 0 && col < figWidth - 1) n += array[(row - 1) * figWidth + col + 1]; 
        if (row > 0 && col > 0) n += array[(row - 1) * figWidth + col - 1];
        return n;
    })()
    const diagInfNeighbors = (() => { 
        let n = 0;
        if (row < figHeight - 1 && col < figWidth - 1) n += array[(row + 1) * figWidth + col + 1]; 
        if (row < figHeight - 1 && col > 0) n += array[(row + 1) * figWidth + col - 1];
        return n;
    })()
    return vertNeighbors + horizNeighbors + diagSupNeighbors + diagInfNeighbors;
// }}}
}
function updateArryIter( liveArry, figHeight, figWidth, left) {
// {{{
    if (left < 0) return [];
    const newVal = (() => {
        const neighbors = calcNeighbors( liveArry, Math.floor( left / figWidth),
            left % figWidth, figHeight, figWidth);
        if (liveArry[left] == 0) {
            return neighbors == 3;
        } else {
            if (neighbors < 2) return false;
            if (neighbors < 4) return true;
            return false;
        }
    })();
    return updateArryIter( liveArry, figHeight, figWidth, left - 1).concat( newVal);
// }}}
}
function updateNeighIter( liveArry, figHeight, figWidth, left) {
// {{{
    if (left < 0) return [];
    const neighbors = calcNeighbors( liveArry, Math.floor( left / figWidth),
        left % figWidth, figHeight, figWidth);
    console.log( Math.floor( left / figWidth), left % figWidth, neighbors)
    return updateNeighIter( liveArry, figHeight, figWidth, left - 1).concat( neighbors);
// }}}
}
// /////////////////////////////////////////////////////////////////////////////
//                                Var
// /////////////////////////////////////////////////////////////////////////////
function zeroArryInit( lenght) {
    if (lenght == 0) return [];
    return [false].concat( zeroArryInit( lenght - 1));    
}

main()
