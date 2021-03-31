export default class Bin {
  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.content = []

    this.htmlElement.addEventListener('dragleave', (ev) => this.htmlElement.classList.remove('open'))
    this.htmlElement.addEventListener('dragover', (ev) => {
      ev.preventDefault()
      this.htmlElement.classList.add('open')
    })
    this.htmlElement.addEventListener(
      'drop',
      (ev) => {
        ev.preventDefault()

        let data = JSON.parse(ev.dataTransfer.getData('application/json'))

        switch (data.action) {
          case 'move':
            let item = document.querySelector(`#${data.itemId}`)
            this.bin(item)
            break
          default:
            break
        }

        this.htmlElement.classList.remove('open')
      },
      { useCapture: true }
    )

    this.htmlElement.addEventListener('bin', (ev) => {
      this.bin(ev.item)
    })

    this.htmlElement.addEventListener('dblclick', (ev) => {
      if (this.content.length == 0) return
      let item = this.content.pop()
      if (this.content.length == 0) this.htmlElement.classList.replace('not-empty', 'empty')

      item.style.display = ''
    })
  }

  bin(item) {
    if (this.content.length == 0) this.htmlElement.classList.replace('empty', 'not-empty')
    this.content.push(item)
    item.dispatchEvent(new Event('remove'))
    item.style.display = 'none'
  }
}
