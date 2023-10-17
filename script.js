const canvas = document.querySelector('.canvas')

var starting_diagrammi = document.querySelectorAll(".diagramma")
var diagrams = []

starting_diagrammi.forEach(diagramma => {
    setup_diagramma(diagramma)
})


function setup_diagramma(diagramma) {
    let offsetX, offsetY;
    let mouseDown;

    const move = (e) => {
        diagramma.style.left = `${e.clientX - offsetX}px`;
        diagramma.style.top = `${e.clientY - offsetY}px`;
    }

    diagramma.addEventListener("mousedown", (e) => {
        if (e.target == diagramma) {
            if (e.button == 0) {
                mouseDown = true;
                offsetX = e.clientX - diagramma.offsetLeft;
                offsetY = e.clientY - diagramma.offsetTop;

                document.addEventListener("mousemove", move);
                contextMenu.classList.add('hidden')
            }
        }
    })

    document.addEventListener("mouseup", (e) => {
        if (mouseDown) {
            mouseDown = false;

            diagramma.style.transition = '0.1s';

            if (e.clientX - offsetX < 0) diagramma.style.left = 0;
            if (e.clientY - offsetY < 0) diagramma.style.top = 0;

            if ((e.clientX - offsetX) + diagramma.clientWidth > canvas.clientWidth) diagramma.style.left = canvas.clientWidth - diagramma.clientWidth + "px";
            if ((e.clientY - offsetY) + diagramma.clientHeight > canvas.clientHeight) diagramma.style.top = canvas.clientHeight - diagramma.clientHeight + "px";


            document.removeEventListener("mousemove", move)
            diagramma.style.transition = '0.0s';
            contextMenu.classList.add("hidden")
        }
    });

    let connectorDown;
    let connectors = []
    let mouseDownPos = null

    for (let child of diagramma.children) {
        if (child.id == "top-connector" || child.id == "bottom-connector") {
            child.addEventListener("mousedown", (e) => {
                connectorDown = true;
                mouseDownPos = {
                    x: e.clientX,
                    y: e.clientY
                }

                const line = {
                    start: mouseDownPos,
                    end: mouseDownPos,
                    lineWidth: 10
                }

                drawLine(line);
            })

            canvas.addEventListener("mousemove", (e) => {
                if (connectorDown) {
                    let mouseEndPos = {
                        x: e.clientX,
                        y: e.clientY
                    }

                    let line = {
                        start: mouseDownPos,
                        end: mouseEndPos
                    }
                }
                ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

                drawLine(line)
            })

            canvas.addEventListener("mouseup", (e) => {
                if (connectorDown) {
                    connectorDown = false;
                    showContextMenu(e);
                }
            })
        }
    }
};


const contextMenu = document.querySelector("#contextMenu")
let menuX, menuY = 0

/*canvas.addEventListener('click', (e) => {
    if (e.target == canvas) {
        contextMenu.classList.remove('hidden')
        contextMenu.style.left = (e.clientX - canvas.offsetLeft) + "px";
        contextMenu.style.top = (e.clientY - canvas.offsetTop) + "px";

        menuX = (e.clientX - canvas.offsetLeft)
        menuY = (e.clientY - canvas.offsetTop)
    }
    else {
        contextMenu.classList.add('hidden')
    }
})
*/

function showContextMenu(e) {
    contextMenu.classList.remove('hidden')
    contextMenu.style.left = (e.clientX - canvas.offsetLeft) + "px";
    contextMenu.style.top = (e.clientY - canvas.offsetTop) + "px";

    menuX = (e.clientX - canvas.offsetLeft)
    menuY = (e.clientY - canvas.offsetTop)
}

function hideContextMenu() {

}



var contextMenuButtons = document.querySelectorAll('#diagrammaBtn')

contextMenuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        contextMenu.classList.add('hidden')

        let clone = document.querySelector(`.diagramma.${button.getAttribute('diagramma-type')}`).cloneNode(true)
        canvas.append(clone)
        clone.classList.remove('hidden')

        diagrams.push(clone)
        setup_diagramma(clone)
        e.preventDefault()

        clone.style.left = menuX - clone.clientWidth / 2 + "px";
        clone.style.top = menuY - clone.clientHeight / 2 + "px";
    })
});