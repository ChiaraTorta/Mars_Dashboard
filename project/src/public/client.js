let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    mars_photos: []
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
    let { rovers, mars_photos, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                ${LatestPhotos(mars_photos)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const LatestPhotos = (mars_photos) => {
    // If gallery mars_photos don't already exist -- request them again
    if (mars_photos.length < 1 || mars_photos === undefined) {
        getMarsPhotos(store)
    }

    return (`
            <img src="${mars_photos.photos.latest_photos[0].img_src}" height="350px" width="100%" />
            <p>${mars_photos.photos.latest_photos[0].rover.name}</p>
        `)
}

// ------------------------------------------------------  API CALLS

const getMarsPhotos = (state) => {
    let { mars_photos, rovers } = state

    fetch(`http://localhost:3000/rovers/${rovers[0]}`)
    .then(res => res.json())
    .then(mars_photos => updateStore(store, { mars_photos } ))
}
