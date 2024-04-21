const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./media/flappy-bird-set.png";

// Parametre generaux
let gamePlaying = false; // Si on est pas entrain de jouer
const gravity = .5; // La gravité de l'oiseau
const speed = 6.2; // La vitesse du jeu
const size = [51, 36]; // La taille de l'oiseau largeur et hauteur
const jump = -10; // Le saut de l'oiseau
const cTenth = (canvas.width / 10); // 1/10 de la largeur du canvas

// Parametre des poteaux
const pipeWidth = 78; // Largeur des poteaux
const pipeGap = 270; // L'ecart entre les poteaux
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; // Fonction pour gerer l'emplacement des poteaux

let index = 0; // Qui permet de placer les element au fuir et à mesure
let bestScore = 0, currentScore = 0, pipes = []
let flight; // le vol de l'oiseau
let flyHeight; // La hauteur de l'oiseau

// Chaque fois qu'on lance le jeu le setup va etre appelé
const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    // Ensuite on genere les poteaux
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

// Ensuite on fait une fonction render qui nous donne le rendu de toute notre animation 
const render = () => {
    // On fait ++ à chaque fois qu'on appel le rendu
    index ++;

    // Faire avancer l'image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

    // Positionner l'animation de l'oiseau dans notre canvas 
    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    } else {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - (size[0] / 2)), flyHeight, ...size);
        flyHeight = ((canvas.height / 2) - (size[1] / 2));
        
        // Ecrire dans le canvas 
        ctx.fillText(`Meilleur Score : ${bestScore}`, 55, 245);
        ctx.fillText(`Cliquez pour jouer`, 48, 450);
        ctx.fillText(`Appuyer sur l'ecran`, 48, 510);
        ctx.fillText(`Ou`, 200, 540);
        ctx.fillText(`La touche ESPACE`, 60, 570);
        ctx.fillText(`Pour Sauter`, 120, 600);
        ctx.font = "bold 30px courier"
    }

    // L'affichage des poteaux
    if (gamePlaying) {
        // On prend nos trois poteaux qu'on a générer et on les map
        pipes.map(pipe => {
            pipe[0] -= speed;

            // On dessine ensuite nos poteaux
            // Poteaux d'en haut
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);

            // Poteaux d'en bas
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWidth) {
                currentScore ++;
                bestScore = Math.max(bestScore, currentScore);
                // Supprimer le poteaux qui passe et ajouter un poteaux à la fin 
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
            // La fin de la partie quand on tape un poteaux
            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                setup();
            }
        })
    }
    // Affichage du Score 
    document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById("currentScore").innerHTML = `Score : ${currentScore}`;

    // Et on le relance à chaque fois
    window.requestAnimationFrame(render);
}
setup();
img.onload = render; // Au chargement de l'image tu peut commencer à lancer le render
document.addEventListener("click", () => gamePlaying = true);
window.onclick = () => flight = jump;
window.onkeydown = (e) => {
    if (e.keyCode === 32) {
        flight = jump
    }
};
document.body.style.zoom = "100%";