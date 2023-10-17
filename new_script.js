const canvas = document.getElementById('canvas')
const starting_diagrammi = document.querySelectorAll("#diagram")

function dragElement(element, boundingElement) {
    let pos1, pos2, pos3, pos4;

    element.onmousedown = onMouseDown;

    connectors = element.querySelectorAll('#connector')
    connectors.forEach(connector => {
        dragConnector(connector)
    })

    function onMouseDown(e) {
        if (e.target == element || e.target.className == "content") {
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = onMouseUp;
            document.onmousemove = onMouseMove;
        }
    }

    function onMouseMove(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = `${(element.offsetTop - pos2)}px`;
        element.style.left = `${(element.offsetLeft - pos1)}px`;
    }

    function onMouseUp(e) {
        if (boundingElement != null) {
            if (element.offsetTop < 0) element.style.top = 0;
            if (element.offsetLeft < 0) element.style.left = 0;

            if (element.offsetTop + element.clientHeight > boundingElement.clientHeight) element.style.top = `${boundingElement.clientHeight - element.clientHeight}px`;
            if (element.offsetLeft + element.clientWidth > boundingElement.clientWidth) element.style.left = `${boundingElement.clientWidth - element.clientWidth}px`;
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function dragConnector(connector) {
    let mouseDown = false;
    let startPos = null;

    connector.onmousedown = onMouseDown;


    function onMouseDown(e) {
        if (e.target == connector) {
            const centerX = connector.clientLeft + canvas.offsetLeft + connector.offsetLeft + connector.clientWidth / 2;
            const centerY = connector.clientTop + canvas.offsetTop + connector.offsetTop + connector.clientHeight / 2;

            startPos = { x: centerX, y: centerY }
            mouseDown = true;
            document.onmouseup = onMouseUp;
        }
    }

    function onMouseUp(e) {
        if (mouseDown) {
            mouseDown = false;
            if (e.clientY > startPos.y) {
                showContextMenu({ x: e.clientX, y: e.clientY })
                createLine(startPos, { x: e.clientX, y: e.clientY })
                startPos = null;
            }
        }
    }


}

diagrams = []

starting_diagrammi.forEach(element => {
    dragElement(element, canvas)
});


const contextMenu = document.getElementById("contextMenu")
let menuX, menuY;

function showContextMenu(position) {
    menuX = position.x - canvas.offsetLeft;
    menuY = position.y - canvas.offsetTop;

    contextMenu.classList.remove('hidden')
    contextMenu.style.left = menuX + "px";
    contextMenu.style.top = menuY + "px";
}

function hideContextMenu() {
    contextMenu.classList.add('hidden')
}

const diagramListHTML = {
    "funzione": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Funzione
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "dichiarazione": `
        <div class="content">
            <button class="connector top" id="connector"></button>  
            <div class="h-line"></div>
            <div class="v-line"></div>
            Dichiarazione
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "assegnazione": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Assegnazione
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "lettura": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Lettura
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "scrittura": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Scrittura
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "condizione": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Condizione
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "chiamata": `
        <div class="content">
            <div class="line-a"></div>
            <div class="line-b"></div>
            <button class="connector top" id="connector"></button>
            Chiamata
            <button class="connector bottom" id="connector"></button>
        </div>`,
    "mentre": `
        <div class="content">
            <button class="connector top" id="connector"></button>
            Mentre
            <button class="connector bottom" id="connector"></button>
        </div>`

}

function onContextMenuButtonClick(e, name) {
    hideContextMenu();

    const diagram = createDiagram(name, { x: menuX, y: menuY });
    if (diagram) dragElement(diagram)
}

function createDiagram(name, position) {
    const diagramHTML = diagramListHTML[name]

    if (diagramHTML) {
        const diagram = document.createElement('div')
        diagram.className = `diagram ${name}`;
        diagram.id = 'diagram'
        diagram.innerHTML = diagramHTML;

        canvas.appendChild(diagram)

        diagram.style.left = (position.x - diagram.clientWidth / 2) + 'px'
        diagram.style.top = position.y + 'px'

        return diagram
    }

    return null
}

var contextMenuButtons = document.querySelectorAll('#diagramBtn')

contextMenuButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        onContextMenuButtonClick(e, button.getAttribute('diagram-type'))
    })
});

const line = document.getElementById('line')

function createLine(startPosition, endPosition) {
    line.style.left = (startPosition.x - canvas.offsetLeft) + "px";
    line.style.top = (startPosition.y - canvas.offsetTop) + "px";

    var adjacentC = endPosition.x - startPosition.x
    var oppositeC = endPosition.y - startPosition.y

    let negative = false;
    if (adjacentC < 0 || oppositeC < 0) negative = true

    var i = Math.sqrt((oppositeC * oppositeC) + (adjacentC * adjacentC))

    line.style.width = i + "px";

    var angle = Math.atan(oppositeC / adjacentC) * (180 / Math.PI);
    if (negative) angle += 180

    line.style.transform = "rotate(" + angle + "deg)"
}

document.onmousedown = function (e) {
    console.log(e.clientX, e.clientY)
}