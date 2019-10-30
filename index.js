let bubble;
let clippy;
let opened;

// Initialize each of the global variables.
window.onload = function() {
    bubble = document.getElementById("bubble");
    clippy = document.getElementById("clippy");
    opened = false;
}

// Calculate where we are, scrolling-percentage-wise. If we're near the end, summon Clippy.
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    if (!opened && scrolled > 60) {
        summonClippy();
    }
};
// I gazed into the abyss and the abyss gazed back
function summonClippy() {
    opened = true;
    bubble.style.display = "block";
    clippy.style.display = "block";
}
function vanquishClippy() {
    bubble.style.display = "none";
    clippy.style.display = "none";
}