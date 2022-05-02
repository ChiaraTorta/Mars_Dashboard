let store = {
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selected_rover : '' ? undefined : 'Curiosity',
    mars_photos: [],
    rover_info: {},
    headline: 'Mars Rover Photos',
    copy: `Image data gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars`
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let {
        mars_photos,
        rover_info,
        rovers,
        headline,
        copy
    } = state

    return `
        <header></header>
        <main>
            <div class="container">
                ${Headline(headline, copy)}
                ${ButtonContainer(rovers)}
                ${InfoTab(rover_info)}
                ${ImageGallery(mars_photos)}
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

window.addEventListener('click', (event) => {
    if (event.target.type === 'button') {
        const rover = event.target.innerText
        getRoverInfo(rover)
        getMarsPhotos(rover)
    }
  }, false)

// ------------------------------------------------------  COMPONENTS

const Headline = (headline, copy) => {
    return `
        <div class="headline-container">
            <h1>${headline}</h1>
            <p>${copy}</p>
        </div>
    `
}

const ButtonContainer = (rovers) => {
    return `
        <div class='button-container'>
            ${rovers.map(rover => {
                return Button(rover)
            }).join('')}
        </div>`
}


const Button = (rover) => {
    return `
        <button type="button" class="button">${rover}</button>
    `
}

const InfoTab = (rover_info) => {
    // If gallery mars_photos don't already exist -- request them again
    if (Object.keys(rover_info).length === 0) {
        getRoverInfo(store.selected_rover)
    } else {
        return `
        <div class="infotab-container">
            <p>Name: ${rover_info.data.rover.name}</p>
            <p>Launch Date: ${rover_info.data.rover.launch_date}</p>
            <p>Landing Date: ${rover_info.data.rover.landing_date}</p>
        </div>
        `
    }
}

const ImageGallery = (mars_photos) => {
    // If gallery mars_photos don't already exist -- request them again
    if (mars_photos.length < 1 || mars_photos === undefined) {
        getMarsPhotos(store.selected_rover)
    } else {
        return mars_photos.photos.latest_photos.slice(0, 6).map((photo) => (`
        <div class="img-container">
            <img src="${photo.img_src}" style="width:100%">
        </div>`)).join('')
    }
}

// ------------------------------------------------------  API CALLS

const getMarsPhotos = (rover) => {
    fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(mars_photos => updateStore(store, {
            mars_photos
        }))
}

const getRoverInfo = (rover) => {
    fetch(`http://localhost:3000/roverInfo/${rover}`)
        .then(res => res.json())
        .then(rover_info => updateStore(store, {
            rover_info
        }))
}