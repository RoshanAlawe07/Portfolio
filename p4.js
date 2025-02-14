document.addEventListener('scroll', () => {
    const rightRock = document.querySelector('.rightrock');
    const frame = document.querySelector('.frame');

    const frameRect = frame.getBoundingClientRect();
    const rockRect = rightRock.getBoundingClientRect();

    if (rockRect.top < frameRect.top || rockRect.bottom > frameRect.bottom) {
        rightRock.style.backgroundColor = "white"; // Set white background when out of bounds
    } else {
        rightRock.style.backgroundColor = "transparent"; // Reset background
    }
});
