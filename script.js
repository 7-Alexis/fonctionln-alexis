/* =========================================
   SITE MATHS — FONCTION ln
   JavaScript complet — ALEXIS
========================================= */


/* =========================================
   1. MODE SOMBRE / MODE CLAIR
========================================= */

const themeToggle = document.getElementById("themeToggle");

function appliquerTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☀️ Mode clair";
        }

    } else {
        document.body.classList.remove("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "🌙 Mode sombre";
        }
    }
}


/* Récupérer le thème enregistré */

const themeSauvegarde = localStorage.getItem("theme") || "light";

appliquerTheme(themeSauvegarde);


/* Changer le thème */

if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const modeSombre =
            document.body.classList.toggle("dark-mode");

        const nouveauTheme =
            modeSombre ? "dark" : "light";

        localStorage.setItem("theme", nouveauTheme);

        appliquerTheme(nouveauTheme);
    });
}


/* =========================================
   2. CALCULATEUR DE ln
========================================= */

function calculerLn() {

    const input = document.getElementById("nombre");
    const resultat = document.getElementById("resultat");

    if (!input || !resultat) {
        return;
    }

    const valeur = Number(input.value);

    /* Vérification */

    if (input.value.trim() === "" || Number.isNaN(valeur)) {

        resultat.textContent =
            "⚠️ Entre un nombre valide.";

        return;
    }

    /* ln(x) existe uniquement pour x > 0 */

    if (valeur <= 0) {

        resultat.textContent =
            "❌ ln(x) est défini uniquement pour x > 0.";

        return;
    }

    /* Calcul */

    const resultatLn = Math.log(valeur);

    resultat.innerHTML =
        "ln(" + valeur + ") ≈ <strong>" +
        resultatLn.toFixed(6) +
        "</strong>";
}


/* =========================================
   CALCUL AVEC LA TOUCHE ENTRÉE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("nombre");

    if (input) {

        input.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                calculerLn();
            }

        });

    }

});


/* =========================================
   3. AFFICHER / MASQUER LES CORRECTIONS
========================================= */

function afficherSolution(numero) {

    const solution =
        document.getElementById("solution" + numero);

    if (!solution) {
        return;
    }

    const actuellementVisible =
        solution.style.display === "block";

    if (actuellementVisible) {

        solution.style.display = "none";

    } else {

        solution.style.display = "block";

    }
}


/* =========================================
   4. DESSIN DE LA COURBE y = ln(x)
========================================= */

function dessinerCourbe() {

    const canvas =
        document.getElementById("graphique");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const largeur = canvas.width;
    const hauteur = canvas.height;

    /* Effacer le graphique */

    ctx.clearRect(0, 0, largeur, hauteur);

    /* Fond */

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largeur, hauteur);


    /* =====================================
       PARAMÈTRES DU REPÈRE
    ===================================== */

    const margeGauche = 60;
    const margeDroite = 25;
    const margeHaut = 25;
    const margeBas = 45;

    const largeurGraphique =
        largeur - margeGauche - margeDroite;

    const hauteurGraphique =
        hauteur - margeHaut - margeBas;


    /* Zone mathématique */

    const xmin = 0.05;
    const xmax = 10;

    const ymin = -3;
    const ymax = 3;


    /* Conversion coordonnées */

    function convertirX(x) {

        return margeGauche +
            ((x - xmin) / (xmax - xmin)) *
            largeurGraphique;

    }

    function convertirY(y) {

        return margeHaut +
            ((ymax - y) / (ymax - ymin)) *
            hauteurGraphique;

    }


    /* =====================================
       GRILLE
    ===================================== */

    ctx.strokeStyle = "#e1e6ef";
    ctx.lineWidth = 1;

    for (let x = 1; x <= 10; x++) {

        const px = convertirX(x);

        ctx.beginPath();
        ctx.moveTo(px, margeHaut);
        ctx.lineTo(px, hauteur - margeBas);
        ctx.stroke();

    }

    for (let y = -3; y <= 3; y++) {

        const py = convertirY(y);

        ctx.beginPath();
        ctx.moveTo(margeGauche, py);
        ctx.lineTo(largeur - margeDroite, py);
        ctx.stroke();

    }


    /* =====================================
       AXE DES ABSCISSES
    ===================================== */

    const axeX = convertirY(0);

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(margeGauche, axeX);
    ctx.lineTo(largeur - margeDroite, axeX);
    ctx.stroke();


    /* =====================================
       AXE DES ORDONNÉES
    ===================================== */

    const axeY = convertirX(0.05);

    ctx.beginPath();
    ctx.moveTo(axeY, margeHaut);
    ctx.lineTo(axeY, hauteur - margeBas);
    ctx.stroke();


    /* =====================================
       ÉTIQUETTES DES AXES
    ===================================== */

    ctx.fillStyle = "#333333";
    ctx.font = "14px Arial";

    ctx.fillText(
        "x",
        largeur - margeDroite - 5,
        axeX - 8
    );

    ctx.fillText(
        "y",
        axeY + 8,
        margeHaut + 12
    );


    /* =====================================
       VALEURS SUR L'AXE X
    ===================================== */

    for (let x = 1; x <= 10; x++) {

        const px = convertirX(x);

        ctx.fillText(
            String(x),
            px - 4,
            axeX + 20
        );

    }


    /* =====================================
       ASYMPTOTE x = 0
    ===================================== */

    ctx.save();

    ctx.setLineDash([6, 6]);

    ctx.strokeStyle = "#777777";

    ctx.beginPath();
    ctx.moveTo(axeY, margeHaut);
    ctx.lineTo(axeY, hauteur - margeBas);
    ctx.stroke();

    ctx.restore();


    /* =====================================
       COURBE y = ln(x)
    ===================================== */

    ctx.beginPath();

    let premierPoint = true;

    for (let x = 0.05; x <= 10; x += 0.02) {

        const y = Math.log(x);

        if (y < ymin || y > ymax) {
            premierPoint = true;
            continue;
        }

        const px = convertirX(x);
        const py = convertirY(y);

        if (premierPoint) {

            ctx.moveTo(px, py);
            premierPoint = false;

        } else {

            ctx.lineTo(px, py);

        }

    }

    ctx.strokeStyle = "#1261d8";
    ctx.lineWidth = 3;

    ctx.stroke();


    /* =====================================
       POINT IMPORTANT (1 ; 0)
    ===================================== */

    const pointX = convertirX(1);
    const pointY = convertirY(0);

    ctx.beginPath();

    ctx.arc(
        pointX,
        pointY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#e53935";
    ctx.fill();


    /* Étiquette */

    ctx.fillStyle = "#333333";
    ctx.font = "bold 13px Arial";

    ctx.fillText(
        "(1 ; 0)",
        pointX + 8,
        pointY - 8
    );


    /* =====================================
       NOM DE LA COURBE
    ===================================== */

    ctx.fillStyle = "#1261d8";
    ctx.font = "bold 15px Arial";

    ctx.fillText(
        "y = ln(x)",
        convertirX(6),
        convertirY(Math.log(6)) - 12
    );
}


/* =========================================
   5. TABLEAU DES VALEURS
========================================= */

function remplirTableau() {

    const tableau =
        document.getElementById("tableauLn");

    if (!tableau) {
        return;
    }

    const valeurs = [
        0.1,
        0.2,
        0.5,
        1,
        2,
        3,
        5,
        10
    ];

    tableau.innerHTML = "";

    valeurs.forEach(function (x) {

        const ligne =
            document.createElement("tr");

        const celluleX =
            document.createElement("td");

        const celluleLn =
            document.createElement("td");

        celluleX.textContent = x;

        celluleLn.textContent =
            Math.log(x).toFixed(4);

        ligne.appendChild(celluleX);
        ligne.appendChild(celluleLn);

        tableau.appendChild(ligne);

    });
}


/* =========================================
   6. INITIALISATION DU SITE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    dessinerCourbe();

    remplirTableau();

});


/* =========================================
   7. REDESSIN DU GRAPHIQUE
========================================= */

window.addEventListener("resize", function () {

    dessinerCourbe();

});


/* =========================================
   8. QUIZ TERMINALE
========================================= */

const questionsLn = [

    {
        question: "Quelle est le domaine de définition de ln(x) ?",

        choix: [
            "]−∞ ; +∞[",
            "]0 ; +∞[",
            "]−∞ ; 0[",
            "[0 ; +∞["
        ],

        reponse: 1,

        explication:
            "La fonction ln(x) est définie uniquement pour x > 0."
    },


    {
        question: "Quelle est la valeur de ln(1) ?",

        choix: [
            "−1",
            "1",
            "0",
            "e"
        ],

        reponse: 2,

        explication:
            "On a ln(1) = 0."
    },


    {
        question: "Quelle est la valeur de ln(e) ?",

        choix: [
            "0",
            "1",
            "e",
            "−1"
        ],

        reponse: 1,

        explication:
            "Par définition de la fonction logarithme népérien, ln(e) = 1."
    },


    {
        question: "Quelle est la dérivée de ln(x) sur ]0 ; +∞[ ?",

        choix: [
            "x",
            "ln(x)",
            "1/x",
            "x²"
        ],

        reponse: 2,

        explication:
            "La dérivée de ln(x) est 1/x pour x > 0."
    },


    {
        question: "Quelle expression est correcte ?",

        choix: [
            "ln(a + b) = ln(a) + ln(b)",
            "ln(ab) = ln(a) + ln(b)",
            "ln(ab) = ln(a) − ln(b)",
            "ln(a/b) = ln(a) + ln(b)"
        ],

        reponse: 1,

        explication:
            "Pour a > 0 et b > 0, ln(ab) = ln(a) + ln(b)."
    },


    {
        question: "Résoudre ln(x) = 2.",

        choix: [
            "x = 2",
            "x = ln(2)",
            "x = e²",
            "x = −e²"
        ],

        reponse: 2,

        explication:
            "En appliquant la fonction exponentielle aux deux membres, on obtient x = e²."
    },


    {
        question: "Quel est le sens de variation de ln sur ]0 ; +∞[ ?",

        choix: [
            "Strictement décroissante",
            "Constante",
            "Strictement croissante",
            "Elle change de sens"
        ],

        reponse: 2,

        explication:
            "Comme (ln x)' = 1/x > 0 pour x > 0, ln est strictement croissante."
    },


    {
        question: "Que vaut ln(1/e) ?",

        choix: [
            "1",
            "−1",
            "e",
            "0"
        ],

        reponse: 1,

        explication:
            "ln(1/e) = ln(e⁻¹) = −1."
    }

];


/* =========================================
   VARIABLES DU QUIZ
========================================= */

let questionActuelle = 0;
let scoreLn = 0;
let quizBloque = false;


/* =========================================
   LANCER LE QUIZ
========================================= */

function lancerQuiz() {

    questionActuelle = 0;
    scoreLn = 0;
    quizBloque = false;

    afficherQuestion();
}


/* =========================================
   AFFICHER UNE QUESTION
========================================= */

function afficherQuestion() {

    const quiz =
        document.getElementById("quiz");

    if (!quiz) {
        return;
    }

    if (questionActuelle >= questionsLn.length) {

        afficherResultatQuiz();

        return;
    }


    const question =
        questionsLn[questionActuelle];


    const progression =
        ((questionActuelle) /
        questionsLn.length) * 100;


    let html = "";

    html +=
        '<div class="quiz-progress">';

    html +=
        '<div class="quiz-progress-bar" style="width:' +
        progression +
        '%;"></div>';

    html +=
        "</div>";


    html +=
        "<p><strong>Question " +
        (questionActuelle + 1) +
        " / " +
        questionsLn.length +
        "</strong></p>";


    html +=
        '<div class="quiz-question">';

    html +=
        "<h3>" +
        question.question +
        "</h3>";

    html +=
        "</div>";


    question.choix.forEach(function (choix, index) {

        html +=
            '<button class="quiz-option" ' +
            'onclick="repondreQuiz(' +
            index +
            ')">' +
            String.fromCharCode(65 + index) +
            ". " +
            choix +
            "</button>";

    });


    quiz.innerHTML = html;

    quizBloque = false;
}


/* =========================================
   RÉPONDRE AU QUIZ
========================================= */

function repondreQuiz(index) {

    if (quizBloque) {
        return;
    }

    quizBloque = true;


    const question =
        questionsLn[questionActuelle];

    const quiz =
        document.getElementById("quiz");

    if (!quiz) {
        return;
    }


    const boutons =
        quiz.querySelectorAll(".quiz-option");


    boutons.forEach(function (bouton, i) {

        bouton.disabled = true;


        if (i === question.reponse) {

            bouton.classList.add("quiz-correct");

        }


        if (
            i === index &&
            i !== question.reponse
        ) {

            bouton.classList.add("quiz-wrong");

        }

    });


    /* Vérifier la réponse */

    if (index === question.reponse) {

        scoreLn++;

    }


    /* Explication */

    const explication =
        document.createElement("div");

    explication.className = "formule";

    explication.style.marginTop = "15px";

    explication.innerHTML =
        "💡 " +
        question.explication;


    quiz.appendChild(explication);


    /* Bouton suivant */

    const boutonSuivant =
        document.createElement("button");

    boutonSuivant.textContent =
        questionActuelle === questionsLn.length - 1
            ? "Voir mon résultat"
            : "Question suivante →";


    boutonSuivant.style.marginTop = "15px";


    boutonSuivant.addEventListener(
        "click",
        function () {

            questionActuelle++;

            afficherQuestion();

        }
    );


    quiz.appendChild(boutonSuivant);
}


/* =========================================
   RESULTAT DU QUIZ
========================================= */

function afficherResultatQuiz() {

    const quiz =
        document.getElementById("quiz");

    if (!quiz) {
        return;
    }


    const total =
        questionsLn.length;


    const pourcentage =
        Math.round(
            (scoreLn / total) * 100
        );


    let message;


    if (scoreLn === total) {

        message =
            "🏆 Excellent ! Tu maîtrises très bien la fonction ln.";

    } else if (scoreLn >= 6) {

        message =
            "🔥 Très bon travail ! Tes connaissances sont solides.";

    } else if (scoreLn >= 4) {

        message =
            "👍 Pas mal ! Encore quelques révisions et tu progresseras.";

    } else {

        message =
            "📚 Continue à réviser. Les exercices vont t'aider à progresser.";

    }


    quiz.innerHTML =

        "<h3>🎉 Quiz terminé !</h3>" +

        '<div class="formule">' +

        "<strong>Score : " +
        scoreLn +
        " / " +
        total +
        "</strong><br>" +

        "Pourcentage : " +
        pourcentage +
        "%" +

        "</div>" +

        "<p>" +
        message +
        "</p>" +

        '<button onclick="lancerQuiz()">' +
        "🔄 Recommencer le quiz" +
        "</button>";
}


/* =========================================
   9. ACTIVER LE BOUTON DU QUIZ
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const boutonQuiz =
        document.getElementById("demarrerQuiz");

    if (boutonQuiz) {

        boutonQuiz.addEventListener(
            "click",
            lancerQuiz
        );

    }

});


/* =========================================
   FIN DU SCRIPT
   Créé par ALEXIS
========================================= */