const inputs = document.querySelectorAll('#inputs input')
const output = document.getElementById('output')
const channelsDiv = document.getElementById('channels')

let params = {}
inputs.forEach(input => {
  params[input.id] = parseInt(input.value)
  input.addEventListener('input', () => {
    params[input.id] = parseInt(input.value) || 0
    updateOutput()
    drawChannels()
    resetAnimation()
  })
})

function calculateOutput() {
  const outH = Math.floor(
    (params.inputH + 2 * params.padH - params.dilH * (params.kernelH - 1) - 1) / params.strideH
  ) + 1
  const outW = Math.floor(
    (params.inputW + 2 * params.padW - params.dilW * (params.kernelW - 1) - 1) / params.strideW
  ) + 1
  return [outH, outW]
}

function updateOutput() {
  const [h, w] = calculateOutput()
  output.textContent = `(${params.inChannels}, ${h}, ${w})`
}

function drawChannels() {
  channelsDiv.innerHTML = ''
  for (let c = 0; c < params.inChannels; c++) {
    const container = document.createElement('div')
    container.className = 'channel-container'

    const title = document.createElement('div')
    title.className = 'channel-title'
    title.textContent = `Channel ${c + 1}`
    container.appendChild(title)

    const grid = document.createElement('div')
    grid.className = 'grid'
    const totalH = params.inputH + 2 * params.padH
    const totalW = params.inputW + 2 * params.padW
    grid.style.gridTemplateColumns = `repeat(${totalW}, 20px)`

    for (let i = 0; i < totalH * totalW; i++) {
      const div = document.createElement('div')
      div.className = 'cell'
      grid.appendChild(div)
    }

    container.appendChild(grid)
    channelsDiv.appendChild(container)
  }
}

let posY = 0, posX = 0, activeChannel = 0
let intervalID = null

function animate() {
  const totalH = params.inputH + 2 * params.padH
  const totalW = params.inputW + 2 * params.padW
  const outH = Math.floor((params.inputH + 2 * params.padH - params.dilH * (params.kernelH - 1) - 1) / params.strideH) + 1
  const outW = Math.floor((params.inputW + 2 * params.padW - params.dilW * (params.kernelW - 1) - 1) / params.strideW) + 1

  const grids = document.querySelectorAll('.grid')

  grids.forEach((grid, idx) => {
    const cells = grid.children
    for (let c of cells) {
      c.classList.remove('active', 'current-channel')
    }

    if (idx === activeChannel) {
      for (let dy = 0; dy < params.kernelH; dy++) {
        for (let dx = 0; dx < params.kernelW; dx++) {
          const y = posY * params.strideH + dy * params.dilH
          const x = posX * params.strideW + dx * params.dilW
          if (y < totalH && x < totalW) {
            cells[y * totalW + x].classList.add('active')
          }
        }
      }
      Array.from(cells).forEach(c => c.classList.add('current-channel'))
    }
  })

  posX++
  if (posX >= outW) {
    posX = 0
    posY++
  }
  if (posY >= outH) {
    posY = 0
    activeChannel++
    if (activeChannel >= params.inChannels) activeChannel = 0
  }
}

function startAnimation() {
  if (intervalID) clearInterval(intervalID)
  intervalID = setInterval(animate, 500)
}

function resetAnimation() {
  posX = 0
  posY = 0
  activeChannel = 0
  startAnimation()
}

// Initialize
updateOutput()
drawChannels()
startAnimation()

