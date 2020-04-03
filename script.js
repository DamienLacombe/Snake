window.onload = () => {

    const plateau = document.createElement('canvas');
    const ctx = plateau.getContext('2d');
    const largeurPlateau = window.innerWidth;
    const hauteurPlateau = window.innerHeight;
    let ratio = window.devicePixelRatio
    const block = largeurPlateau / 60 * ratio;
    let direction = "droite";
    let serpent = [[2, 2], [3, 2], [4, 2]];
    let demarrer = false;
    let vitesse = 100;
    let tete = serpent[serpent.length - 1];
    let relancer = 0;
    let pommeX = 4 * block
    let pommeY = 2 * block
    let pommeMange = false
    let point = 0

    const initialisationPlateau = () => {

        plateau.width = largeurPlateau * ratio;
        plateau.height = hauteurPlateau * ratio;
        plateau.style.width = largeurPlateau + "px"
        plateau.style.height = hauteurPlateau + "px"
        plateau.style.backgroundColor = "#3A3A3A";
        plateau.style.display = "block"
        document.body.appendChild(plateau);
        changementPositionPomme()
    }

    window.onkeydown = (e) => {    // Commandes 

        key = e.keyCode
        if (key === 39 && direction != "gauche") {
            setTimeout(() => {
                direction = "droite"
            }, 60);
        }
        else if (key === 37 && direction != "droite") {
            setTimeout(() => {
                direction = "gauche"
            }, 60);
        }
        else if (key === 38 && direction != "bas") {
            setTimeout(() => {
                direction = "haut"
            }, 60);
        }
        else if (key === 40 && direction != "haut") {
            setTimeout(() => {
                direction = "bas"
            }, 60);
        }
        else if (key === 13) {
            demarrer = true;
            relancer++;
        }
        if (e.keyCode === 13) {
            deplacement()
        }
    }

    const dessinSerpent = (serpent) => {

        for (i = serpent.length - 1; i >= 0; i--) {
            parties = serpent[i];
            dessiner(parties, ctx)
        }
        if (demarrer === true) {
            setTimeout(deplacement, vitesse)
        }
    }

    const deplacement = () => {
        ctx.clearRect((serpent[0][0] * block) - 1, (serpent[0][1] * block) - 1, block + 2, block + 2)
        let x = serpent[serpent.length - 1][0]
        let y = serpent[serpent.length - 1][1]
        if (direction === "droite") {
            x = serpent[serpent.length - 1][0] + 1
            y = serpent[serpent.length - 1][1]
        }
        if (direction === "gauche") {
            x = serpent[serpent.length - 1][0] - 1
            y = serpent[serpent.length - 1][1]
        }
        if (direction === "haut") {
            x = serpent[serpent.length - 1][0]
            y = serpent[serpent.length - 1][1] - 1
        }
        if (direction === "bas") {
            x = serpent[serpent.length - 1][0]
            y = serpent[serpent.length - 1][1] + 1
        }
        serpent.push([x, y])
        tete = [x, y]
        if (pommeMange === false) {
            serpent.splice(0, 1)
        } else
            pommeMange = false

        dessinSerpent(serpent, ctx)
    }

    const dessiner = (parties, ctx) => {
        x = parties[0] * block;
        y = parties[1] * block;
        ctx.fillStyle = "#79FF00"
        ctx.fillRect(x, y, block - 2, block - 2)
        if (demarrer === true) {
            colisionFinOuPomme()
        }
    }

    const relancerLeJeu = () => {

        demarrer = false
        ctx.clearRect(0, 0, largeurPlateau * ratio, hauteurPlateau * ratio)
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.textAlign = "center";
        ctx.font = "bold 70px sans-serif"
        ctx.fillText("Perdu", largeurPlateau / 2 * ratio, hauteurPlateau / 2 * ratio - 50)
        ctx.font = "bold 30px sans-serif"
        ctx.fillText("Appuyez sur entrez pour rejouer", largeurPlateau / 2 * ratio, hauteurPlateau / 2 * ratio)
        ctx.fillText(`Score : ${point}`, largeurPlateau / 2 * ratio, hauteurPlateau / 2 * ratio + 50)

        if (relancer >= 2) {
            location.reload(true);
        }
    }

    const colisionFinOuPomme = () => {

        if ((serpent[serpent.length - 1][0] / block * ratio < 0 || serpent[serpent.length - 1][0] * block / ratio >= largeurPlateau) ||
            (serpent[serpent.length - 1][1] / block * ratio < 0 || serpent[serpent.length - 1][1] * block / ratio >= hauteurPlateau - (block / ratio))) {
            relancerLeJeu()
        }
        let teteX = tete[0]
        let teteY = tete[1]
        for (i = serpent.length - 2; i > 0; i--) {
            if (teteX === serpent[i][0] && teteY === serpent[i][1]) {
                relancerLeJeu()
            }
        }
        if (teteX * block === pommeX && teteY * block === pommeY) {
            pommeMange = true
            changementPositionPomme()
        }
    }

    const changementPositionPomme = () => {

        for (i = serpent.length - 1; i > 0; i--) {
            if (pommeX === serpent[i][0] * block && pommeY === serpent[i][1] * block) {
                while (pommeX === serpent[i][0] * block && pommeY === serpent[i][1] * block) {
                    pommeX = Math.floor(Math.random() * Math.floor((largeurPlateau - 2) / (block / ratio))) * block
                    pommeY = Math.floor(Math.random() * Math.floor((hauteurPlateau - 2) / (block / ratio))) * block
                    console.log(pommeX, pommeY)
                }
            }
        }
        pomme()
    }

    const pomme = () => {
        ctx.beginPath()
        ctx.fillStyle = "#FF0000"
        ctx.arc(pommeX + block / 2, pommeY + block / 2, block / 2.5, 0, Math.PI * 2, true)
        ctx.fill()
        if (demarrer === true) {
            vitesse--
            point++
            ctx.font = "bold 60px sans-serif"
            ctx.fillStyle = "white"
            ctx.clearRect(0, 0, 80, 80)
            ctx.fillText(point.toString(), 5, 48)
            console.log(vitesse)
        }
    }

    const deroulementDuJeu = () => {
        initialisationPlateau();
        dessinSerpent(serpent);
    }

    deroulementDuJeu()
}
