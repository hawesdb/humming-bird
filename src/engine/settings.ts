export class Settings {
  static #props: { [key: string]: string | number } = {}

  static get = (prop: string) => {
    return this.#props[prop]
  }

  static set = (prop: string, value: string | number) => {
    if (!Object.getOwnPropertyDescriptors(this)[prop]) {
      Object.defineProperty(this, prop, {
        configurable: true,
        enumerable: true,
        get: () => this.#props[prop],
        set: (val) => {
          this.#props[prop] = val
        },
      })
    }
    this.#props[prop] = value
  }

  static remove = (prop: string) => {
    delete this.#props[prop]
  }
}
