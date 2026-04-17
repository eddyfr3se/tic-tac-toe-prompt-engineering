const circleColor = '#00b0EF';
const crossColor = '#ffc000';
const circleWidth = 70;
const circleHeight = 70;

let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6],            // diagonal
];

let currentShape = 'circle'; 
function init() {
    render();
}



function render() {
    const contentDiv = document.getElementById('content');
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = getAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = getAnimatedCrossSVG();
            }
            
            const onclick = fields[index] === null ? `onclick="handleClick(this, ${index})"` : '';
            tableHtml += `<td ${onclick}>${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    contentDiv.innerHTML = tableHtml;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentShape;
        cell.innerHTML = currentShape === 'circle' ? getAnimatedCircleSVG() : getAnimatedCrossSVG();
        cell.onclick = null;

        const winCombo = checkWinner();
        if (winCombo) {
            drawWinningLine(winCombo);
            disableAllClicks();
        } else {
            currentShape = currentShape === 'circle' ? 'cross' : 'circle';
        }
    }
}

function isGameFinished() {
    return fields.every(field => field !== null) || checkWinner() !== null;
}

function disableAllClicks() {
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
        tds[i].onclick = null;
    }
}

function checkWinner() {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (
            fields[a] &&
            fields[a] === fields[b] &&
            fields[a] === fields[c]
        ) {
            return combo; 
        }
    }
    return null; 
}



function getAnimatedCircleSVG() {
    return `
<svg width="${circleWidth}" height="${circleHeight}" viewBox="0 0 ${circleWidth} ${circleHeight}">
  <circle
    cx="${circleWidth / 2}"
    cy="${circleHeight / 2}"
    r="30"
    fill="none"
    stroke="${circleColor}"
    stroke-width="8"
    stroke-dasharray="188.4"
    stroke-dashoffset="188.4"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="188.4"
      to="0"
      dur="2s"
      fill="freeze"
    />
  </circle>
</svg>
    `;
}

function getAnimatedCrossSVG() {
    return `
<svg width="${circleWidth}" height="${circleHeight}" viewBox="0 0 ${circleWidth} ${circleHeight}">
  <line
    x1="15" y1="15"
    x2="${circleWidth - 15}" y2="${circleHeight - 15}"
    stroke="${crossColor}"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="77.78"
    stroke-dashoffset="77.78"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="77.78"
      to="0"
      dur="1s"
      fill="freeze"
    />
  </line>
  <line
    x1="${circleWidth - 15}" y1="15"
    x2="15" y2="${circleHeight - 15}"
    stroke="${crossColor}"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="77.78"
    stroke-dashoffset="77.78"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="77.78"
      to="0"
      dur="1s"
      fill="freeze"
      begin="1s"
    />
  </line>
</svg>
    `;
}
function drawWinningLine(combination) {
    const tds = document.querySelectorAll('#content td');
    const startCell = tds[combination[0]];
    const endCell = tds[combination[2]];
    const content = document.getElementById('content');
    const contentRect = content.getBoundingClientRect();
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const startX = startRect.left - contentRect.left + startRect.width / 2;
    const startY = startRect.top - contentRect.top + startRect.height / 2;
    const endX = endRect.left - contentRect.left + endRect.width / 2;
    const endY = endRect.top - contentRect.top + endRect.height / 2;

    content.insertAdjacentHTML('beforeend', `
        <svg style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000;">
            <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#fff" stroke-width="15" stroke-linecap="round"></line>
        </svg>
    `);
}