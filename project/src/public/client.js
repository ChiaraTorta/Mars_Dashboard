let store = {
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    mars_photos: [],
    rover_info: {},
    selected_rover: '' ? '' : 'Curiosity',
    headline: 'Mars Rover Photos',
    copy: `Image data gathered by NASA's Curiosity, Opportunity, and Spirit rovers on Mars`
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    newStore = Object.assign(store, newState)
    render(root, newStore);
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
                ${rover_info.hasOwnProperty('info') ? InfoTab(rover_info) : ''}
                ${mars_photos.hasOwnProperty('photos') ? ImageGallery(mars_photos) : ''}
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', async () => {
    // make API calls on load event
    await getRoverInfo(store.selected_rover)
    await getMarsPhotos(store.selected_rover)
    render(root, store)
})

// change rover data on button click
window.addEventListener('click', (event) => {
    if (event.target.type === 'button') {
        const rover = event.target.innerText
        updateStore(store, {selected_rover: rover})
        getRoverInfo(rover)
        getMarsPhotos(rover)
    }
})

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
            ${rovers.map(rover => Button(rover)).join('')}
        </div>`
}

const Button = (rover) => {
    return `
        <button type="button" class="button">${rover}</button>
    `
}

const InfoTab = (rover_info) => {
    rover_info = rover_info.info.rover
    return `
        <div class="infotab-container">
            <p>Name: ${rover_info.name}</p>
            <p>Launch Date: ${rover_info.launch_date}</p>
            <p>Landing Date: ${rover_info.landing_date}</p>
        </div>
        `
}

const ImageGallery = (mars_photos) => {
    return `<div class="img-container">
                ${mars_photos.photos.latest_photos.slice(0, 6).map((photo) => (
                    `<img src="${photo.img_src}" style="width:100%">`)).join('')}
            </div>
            `
}

// ------------------------------------------------------  API CALLS
const getRoverInfo = (rover) => {
    fetch(`http://localhost:3000/roverInfo/${rover}`)
        .then(res => res.json())
        .then(rover_info => updateStore(store, {
            rover_info
        }))
}

const getMarsPhotos = (rover) => {
    fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(mars_photos => updateStore(store, {
            mars_photos
        }))
}