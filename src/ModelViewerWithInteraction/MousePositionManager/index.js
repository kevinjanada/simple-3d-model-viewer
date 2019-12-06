class MousePositionManager {
  constructor(domElement) {
    this.canvas = null
    this.mouseCanvasPosition = {x: 0, y: 0};
    this.mouseWindowPosition = {x: 0, y: 0};
    // Method this context bind
    this.setupCanvas = this.setupCanvas.bind(this)
    this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this)
    this.setMouseCanvasPosition = this.setMouseCanvasPosition.bind(this)
    this.clearMouseCanvasPosition = this.clearMouseCanvasPosition.bind(this)
    this.setMouseWindowPosition = this.setMouseWindowPosition.bind(this)
    this.getPosition = this.getPosition.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseMoveCallback = () => null
    this.onMouseMoveCallback = this.onMouseMoveCallback.bind(this)

    this.setupCanvas(domElement)

    // Event Listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseout', this.clearMouseCanvasPosition)
    this.canvas.addEventListener('mouseleave', this.clearMouseCanvasPosition)
    this.canvas.addEventListener('mouseenter', this.handleMouseEnterCanvas) // TODO: Implement this
    this.canvas.addEventListener('mouseleave', this.handleMouseLeaveCanvas) // TODO: Implement this
  }

  setupCanvas(domElement) {
    if (domElement) {
      this.canvas = domElement
      this.canvasWidth = domElement.offsetWidth - 16;
      this.canvasHeight = domElement.offsetHeight;
    } else {
      // render to body
      this.canvas = document.createElement('div')
      document.body.appendChild(this.canvas)
      this.canvasWidth = window.innerWidth - 20
      this.canvasHeight = window.innerHeight - 20
    }
  }

  onMouseMove(event) {
    this.setMouseCanvasPosition(event)
    this.setMouseWindowPosition(event)
    this.onMouseMoveCallback(event)
  }

  /**
   * Set the mouse position relative to the window position
   * @param {DOMEvent object} event
  */
  setMouseWindowPosition(event) {
    event.preventDefault()
    this.mouseWindowPosition.x = event.clientX;
    this.mouseWindowPosition.y = event.clientY;
  }

  /**
   * Get the x and y of canvas element
   * @param {DOMEvent object} event 
   */
  getCanvasRelativePosition(event) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  /**
   * Set the mouse position relative to the canvas / container of renderer
   * @param {DOMEvent object} event 
   * this.mousePosition.x == -1 <= x <= 1 
   * this.mousePosition.y == -1 <= y <= 1
   */
  setMouseCanvasPosition(event) {
    const pos = this.getCanvasRelativePosition(event);
    this.mouseCanvasPosition.x = (pos.x / this.canvas.clientWidth ) *  2 - 1 + 0.012;
    this.mouseCanvasPosition.y = (pos.y / this.canvas.clientHeight) * -2 + 1;  // note we flip Y
  }

  /**
   * unlike the mouse which always has a position
   * if the user stops touching the screen we want
   * to stop raycasting. For now we just pick a value
   * unlikely to pick something
   */
  clearMouseCanvasPosition() {
    this.mouseCanvasPosition.x = -100000;
    this.mouseCanvasPosition.y = -100000;
  }

  getPosition() {
    return {
      mouseCanvasPosition: this.mouseCanvasPosition,
      mouseWindowPosition: this.mouseWindowPosition
    }
  }

  /**
   * Register callback Function to events
   * @param {domEvent} event 
   * @param {function} callback 
   */
  on(event, callback) {
    console.log(callback)
    if (event === 'mousemove') {
      this.onMouseMoveCallback = callback
    }
  }
}

export default MousePositionManager