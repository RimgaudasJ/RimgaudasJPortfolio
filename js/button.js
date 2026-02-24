document.querySelector('button').addEventListener('click', () => {
    // URL where the GET request will be sent
    fetch('http://localhost:5500/button')
    // Obtains the text of the response in the form of a promise
    .then(res => res.text())
    // Changes the text of the paragraph to the response text
    .then(msg => document.querySelector('p').innerText = msg)
})