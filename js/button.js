(function () {
    const button = document.querySelector('button');
    const messageTarget = document.querySelector('p');

    if (!button || !messageTarget) {
        return;
    }

    button.addEventListener('click', function () {
        fetch('http://localhost:5500/button')
            .then((res) => res.text())
            .then((msg) => {
                messageTarget.innerText = msg;
            });
    });
})();