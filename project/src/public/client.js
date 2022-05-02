let store = {
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    mars_photos: [],
    rover_info: {}
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
        rover_info
    } = state

    return `
        <header></header>
        <main>
            <div class="container">
                ${ImageGallery(mars_photos)}
                ${InfoTab(rover_info)}
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const ImageGallery = (mars_photos) => {
    // If gallery mars_photos don't already exist -- request them again
    if (mars_photos.length < 1 || mars_photos === undefined) {
        getMarsPhotos(store)
    } else {
        return mars_photos.photos.latest_photos.slice(0, 5).map((photo) => (`
        <div class="slide">
            <img src="${photo.img_src}" style="width:100%">
        </div>`)).join('')
    }
}

const InfoTab = (rover_info) => {
    // If gallery mars_photos don't already exist -- request them again
    if (Object.keys(rover_info).length === 0) {
        getRoverInfo(store)
    } else {
        return `
        <div class="infoTab">
            <p>Name: ${rover_info.data.rover.name}</p>
            <p>Launch Date: ${rover_info.data.rover.launch_date}</p>
            <p>Landing Date: ${rover_info.data.rover.landing_date}</p>
        </div>
        `
    }
}

// ------------------------------------------------------  API CALLS

const getMarsPhotos = (state) => {
    let {
        rovers
    } = state

    fetch(`http://localhost:3000/rovers/${rovers[0]}`)
        .then(res => res.json())
        .then(mars_photos => updateStore(store, {
            mars_photos
        }))
}

const getRoverInfo = (state) => {
    let {
        rovers
    } = state

    fetch(`http://localhost:3000/roverInfo/${rovers[0]}`)
        .then(res => res.json())
        .then(rover_info => updateStore(store, {
            rover_info
        }))
}