'use babel'

export class View {
  constructor(name) {
    this.name = name

    this.notification = this.element = null
  }
  show() {
    this.notification = atom.notifications.addInfo(`Upgrading ${this.name}`, {
      detail: `You can disable auto-updates in this package's settings`,
      dismissable: true
    })
    this.element = atom.views.getView(notification)
  }
  dismiss() {
    this.notification.dismiss()
  }
  finish() {
    const content = this.element.querySelector('.detail-content')
    const title = this.element.querySelector('.message p')

    if (content) {
      content.textContent = `${this.name} has been upgraded to the latest version`
    }
    if (title) {
      title.textContent = `Upgraded ${this.name}`
    }

    this.element.classList.remove('info')
    this.element.classList.remove('icon-info')
    this.element.classList.add('success')
    this.element.classList.add('icon-check')
  }
}
