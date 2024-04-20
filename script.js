const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./media/flappy-bird-set.png";

// Paramettre generaux
let gamePlaying = false; // Si on est pas entrain de jouer
const gravity = .5; // La gravité de l'oiseau
const speed = 6.2; // La vitesse du jeu
const size = [51, 36]; // La taille de l'oiseau largeur et hauteur
const jump = -11.5; // Le saut de l'oiseau
const cTenth = (canvas.width / 10); // Variente du canvas

let index = 0; // Qui permet de placer les element au fuir et à mesure
let bestScore = 0, currentScore = 0, pipes = []
let flight; // le vol de l'oiseau
let flyHeight; // La hauteur de l'oiseau

// Ensuite on fait une fonction render qui nous donne le rendu de toute notre animation 
const render = () => {
    // On fait ++ à chaque fois qu'on appel le rendu
    index ++;

    // Positionner l'animation de l'oiseau dans notre canvas 
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - (size[0] / 2)), ((canvas.height / 2) - (size[1] / 2)), ...size);
    // Et on le relance à chaque fois
    window.requestAnimationFrame(render);
}
img.onload = render; // Au chargement de l'image tu peut commencer à lancer le render