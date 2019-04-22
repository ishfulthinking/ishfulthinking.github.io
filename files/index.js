// I combined a link-underlining script with one that summons Clippy since they
// use the same onload and onscroll functions.
let about;
let exper;
let coding;
let music;
let art;
let cont;

let bubble;
let clippy;
let opened;

// Initialize each of the global variables.
window.onload = function() {
    about  = document.getElementById("aboutLink");
    exper  = document.getElementById("experLink");
    coding = document.getElementById("codingLink");
    music  = document.getElementById("musicLink");
    art    = document.getElementById("artLink");
    cont   = document.getElementById("contactLink");
    underlineLinks(0);

    bubble = document.getElementById("bubble");
    clippy = document.getElementById("clippy");
    opened = false;
}

// Calculate where we are, scrolling-percentage-wise. If we're near the end, summon Clippy.
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    underlineLinks(scrolled);

    if (!opened && scrolled > 50)
        summonClippy();
};

function underlineLinks(scrolled) {
    // Reset all links, so we don't have weird leftover underlines.
    about.style.textDecoration  = "none";
    exper.style.textDecoration  = "none";
    coding.style.textDecoration = "none";
    music.style.textDecoration  = "none";
    art.style.textDecoration    = "none";
    cont.style.textDecoration   = "none";

    // Underline the right link.
    if (scrolled < 27)
        about.style.textDecoration = "underline";
    else if (scrolled < 40)
        exper.style.textDecoration = "underline";
    else if (scrolled < 56)
        coding.style.textDecoration = "underline";
    else if (scrolled < 85)
        music.style.textDecoration = "underline";
    else if (scrolled < 100)
        art.style.textDecoration = "underline";
    else
        cont.style.textDecoration = "underline";
}

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