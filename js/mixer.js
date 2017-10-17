/* Simple mixer script by Colin Campbell https://colincampbell.me */
/* global localStorage */

if (document.readyState !== 'loading') {
  run()
} else {
  document.addEventListener('DOMContentLoaded', run)
}

function run () {
  const controlsContainer = document.getElementById('controls')
  const mixerContainer = document.getElementById('mixer')
  const mixerToggle = document.getElementById('mixer-toggle')

  const controlsContainerOriginalOpacity = controlsContainer.style.opacity

  const mixerState = {
    streams: []
  }

  mixerToggle.addEventListener('click', (event) => {
    if (mixerContainer.style.display !== 'none') {
      mixerContainer.style.display = 'none'
      controlsContainer.style.opacity = controlsContainerOriginalOpacity
    } else {
      mixerContainer.style.display = 'block'
      controlsContainer.style.opacity = 1
    }
  })

  document.querySelectorAll('.audio-stream').forEach((stream) => {
    mixerState.streams.push({
      element: stream,
      name: stream.dataset.streamName,
      source: stream.dataset.streamSource,
      type: stream.dataset.streamType,
      id: mixerState.streams.length + 1
    })
  })

  mixerState.streams.forEach((stream) => {
    initializeStream(stream)
    addStreamToInterface(stream)
  })

  document.querySelectorAll('#mixer .stream input').forEach((slider) => {
    slider.addEventListener('input', (event) => {
      const stream = getStreamById(event.target.dataset.streamId)
      setVolume(stream, event.target.value)
    })
  })

  function initializeStream (stream) {
    const storedVolume = localStorage.getItem(`stream-${stream.id}-volume`)

    // Default volume
    if (stream.type === 'music') {
      setVolume(stream, 0.4)
    }

    // Restore stored volume
    if (storedVolume !== null) {
      setVolume(stream, storedVolume)
    }
  }

  function addStreamToInterface (stream) {
    const streamControl = document.createElement('div')
    streamControl.classList.add('stream')

    streamControl.innerHTML = `
      <div>${stream.name}</div>
      <input type="range" min="0" max="1" step="any"
        data-stream-id="${stream.id}" value="${stream.element.volume}">`

    mixerContainer.appendChild(streamControl)
  }

  function setVolume (stream, volume) {
    stream.element.volume = parseFloat(volume).toFixed(2)
    localStorage.setItem(`stream-${stream.id}-volume`, volume)
  }

  function getStreamById (id) {
    const streams = mixerState.streams.filter((stream) => {
      return (stream.id === parseInt(id))
    })

    return streams[0]
  }
}
