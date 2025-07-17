const inputs = document.querySelectorAll('#inputs input')
const output = document.getElementById('output')
const gridDiv = document.getElementById('grid')

let params = {}
inputs.forEach(input => {
  params[input.id] = parseInt(input.value)
  input.addEventListener('input', () => {
    params[input.id] = parseInt(input.value) || 0
    updateOutput()
    drawGrid()
    resetAnimation()
  })
})

function calculateOutput() {
  const outH = Math.floor((params.inputH + 2 * params.padH - (params.kernelH - 1) - 1) / params.strideH) + 1
  const outW = Math.floor((params.inputW + 2 * params.padW - (params.kernelW - 1) - 1) / params.strideW) + 1
  return [outH, outW]
}

function updateOutput() {
  const [h, w] = calculateOutput()
  output.textContent = `(${h}, ${w})`
}

function drawGrid() {
  const totalH = params.inputH + 2 * params.padH
  const totalW = params.inputW + 2 * params.padW
  gridDiv.style.gridTemplateColumns = `repeat(${totalW}, 20px)`
  gridDiv.innerHTML = ''
  for (let i = 0; i < totalH * totalW; i++) {
    const div = document.createElement('div')
    div.className = 'cell'
    gridDiv.appendChild(div)
  }
}

let posY = 0, posX = 0
let intervalID = null

function animate() {
  const totalH = params.inputH + 2 * params.padH
  const totalW = params.inputW + 2 * params.padW
  const outH = Math.floor((params.inputH + 2 * params.padH - (params.kernelH - 1) - 1) / params.strideH) + 1
  const outW = Math.floor((params.inputW + 2 * params.padW - (params.kernelW - 1) - 1) / params.strideW) + 1

  const cells = gridDiv.children
  for (let c of cells) c.classList.remove('active')

  for (let dy = 0; dy < params.kernelH; dy++) {
    for (let dx = 0; dx < params.kernelW; dx++) {
      const y = posY * params.strideH + dy
      const x = posX * params.strideW + dx
      if (y < totalH && x < totalW) {
        cells[y * totalW + x].classList.add('active')
      }
    }
  }

  posX++
  if (posX >= outW) {
    posX = 0
    posY++
  }
  if (posY >= outH) {
    posY = 0
  }
}

function startAnimation() {
  if (intervalID) clearInterval(intervalID)
  intervalID = setInterval(animate, 500)
}

function resetAnimation() {
  posX = 0
  posY = 0
  startAnimation()
}

// Initialize on load
updateOutput()
drawGrid()
startAnimation()
