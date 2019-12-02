const DEFAULT_COLORS = [
  { hex: '#ab0707', description: 'High' },
  { hex: '#c78a06', description: 'Medium High' },
  { hex: '#f0df5d', description: 'Medium' },
  { hex: '#81db32', description: 'Low' },
  { hex: '#ffffff', description: 'Clear Color'}
]
const MENU_ITEM_HEIGHT = 42

class ColorMenu {
  /**
   * 
   * @param {DOMElement object} domElement 
   * @param {array<{ hex: string, description: string}>} colors 
   * @param {function} menuItemClickHandler -- 
   */
  constructor(domElement, colors, menuItemClickHandler) {
    this.colors = colors || DEFAULT_COLORS
    this.container = null
    this.menuElement = null
    this.menuElementWidth = 0
    this.menuElementHeight = 0
    this.menuItemClickHandler = (val) => console.log(val)
    this.init = this.init.bind(this)
    this.initializeMenuItems = this.initializeMenuItems.bind(this)
    this.computeMenuElementAnchorPosition = this.computeMenuElementAnchorPosition.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.menuItemClickHandler = this.menuItemClickHandler.bind(this)
    this.isMouseOnMenu = this.isMouseOnMenu.bind(this)

    if (domElement) {
      this.container = domElement
    } else {
      // render to body
      this.container = document.body
    }

    if (menuItemClickHandler) { this.menuItemClickHandler = menuItemClickHandler }
    else { this.menuItemClickHandler = (val) => console.log(val) } 

    this.init()
  }
  init() {
    this.menuElementHeight = this.colors.length * MENU_ITEM_HEIGHT // FIXME: How to set Menu height dynamically based on menu items??
    this.menuElementWidth = 150
    this.menuElement = document.createElement('div')
    this.menuElement.style.cssText = `width: ${this.menuElementWidth}px; background-color: white;`
    this.menuElement.style.position = 'absolute'
    this.menuElement.style.zIndex = '100'
    this.menuElement.style.display = 'none'
    this.initializeMenuItems()
    this.container.appendChild(this.menuElement)
  }
  initializeMenuItems() {
    this.colors.forEach(c => {
      const el = document.createElement('div')
      el.setAttribute('class', 'color-menu-item')
      el.style.width = '100%'
      el.style.height = `${MENU_ITEM_HEIGHT}px`
      el.style.backgroundColor = c.hex
      el.style.display = 'flex'
      el.style.justifyContent = 'center'
      el.style.alignItems = 'center'

      const text = document.createElement('p')
      text.innerHTML = c.description
      text.style.margin = 0

      el.appendChild(text)
      el.addEventListener('click', function(event) {
        console.log('jajaj')
      })
      this.menuElement.appendChild(el)
    })
  }
  /**
   * Show the menu element
   * @param {object: {x: number, y: number}} mouseWindowPosition 
   */
  show(mouseWindowPosition) {
    if (this.menuElement.style.display === 'none') {
      const { top, left } = this.computeMenuElementAnchorPosition(mouseWindowPosition)
      this.menuElement.style.top = `${top}px`
      this.menuElement.style.left = `${left}px`
      this.menuElement.style.display = 'block'
    }
  }
  /**
   * Hide the menu element
   */
  hide() {
    this.menuElement.style.display = 'none'
  }
  /**
   * Compute the anchor (top left) coordinate (x, y) of menu element
   * Use the anchor coordinate to position the menu element before showing it 
   * @param {object: {x: number, y: number}} mousePosition 
   */
  computeMenuElementAnchorPosition(mousePosition) {
    const rect = this.container.getBoundingClientRect()
    const { height, width } = rect
    const { x, y } = mousePosition
    let top, left;
    if(y < (height / 2)) {
      top = y
    } else {
      top = y - this.menuElementHeight
    }
    if(x < (width / 2)) {
      left = x
    } else {
      left = x - this.menuElementWidth
    }
    return { top, left }
  }
  /**
   * Helper to check whether mouse is currently hovering on menu element
   * @param {object: {x: number, y: number}} mousePosition 
   */
  isMouseOnMenu(mousePosition) {
    if (this.menuElement.style.display !== 'none') {
      const { x, y } = mousePosition
      // TODO: Get the top, bottom, left, and right of the menuElement
      const rect = this.menuElement.getBoundingClientRect()
      const { top, bottom, left, right } = rect
      if (x < right && x > left && y > top && y < bottom) {
        return true
      } else {
        return false
      }
    }
    return false
  }
}

export default ColorMenu