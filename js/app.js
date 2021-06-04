import "../css/style.scss"

class Dog {
  constructor() {
    this.apiUrl = "https://dog.ceo/api"
    this.imageEl = document.querySelector("img.featured-dog__img")
    this.backgroundEl = document.querySelector(".featured-dog__background")
    this.tilesEl = document.querySelector(".tiles")
    this.spinnerEl = document.querySelector(".spinner")
    this.init()
  }

  showLoading = () => {
    this.spinnerEl.classList.add("spinner--visible")
  }

  hideLoading = () => {
    this.spinnerEl.classList.remove("spinner--visible")
  }

  listBreeds = () => {
    return fetch(`${this.apiUrl}/breeds/list/all`)
      .then((resp) => resp.json())
      .then((data) => data.message)
  }

  getRandomImage = () => {
    return fetch(`${this.apiUrl}/breeds/image/random`)
      .then((resp) => resp.json())
      .then((data) => data.message)
  }

  getRandomImageByBreed = (breed) => {
    return fetch(`${this.apiUrl}/breed/${breed}/images/random`)
      .then((resp) => resp.json())
      .then((data) => data.message)
      .catch((err) => console.log(err))
  }

  init = () => {
    this.showLoading()
    this.getRandomImage().then(this.showImageWhenReady)

    this.showAllBreeds()
  }

  showImageWhenReady = (image) => {
    this.imageEl.setAttribute("src", image)
    this.backgroundEl.style.backgroundImage = `url("${image}")`
    const time = Math.floor(Math.random() * 550)
    setTimeout(this.hideLoading, time)
  }

  addBread(breed, subBreed) {
    let name
    let type
    if (typeof subBreed === "undefined") {
      name = breed
      type = breed
    } else {
      name = `${breed} ${subBreed}`
      type = `${breed}/${subBreed}`
    }

    const tile = document.createElement("div")
    tile.classList.add("tiles__item")
    tile.classList.add("tile")

    const tileContent = document.createElement("div")
    tileContent.classList.add("tile__content")
    tileContent.innerText = name
    tileContent.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      this.showLoading()
      this.getRandomImageByBreed(type).then(this.showImageWhenReady)
    })

    tile.appendChild(tileContent)
    this.tilesEl.appendChild(tile)
  }

  showAllBreeds = () => {
    this.listBreeds().then((breeds) => {
      for (const breed in breeds) {
        if (breeds[breed].length === 0) {
          this.addBread(breed)
        } else {
          for (const subBreed of breeds[breed]) {
            this.addBread(breed, subBreed)
          }
        }
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Dog()
})
