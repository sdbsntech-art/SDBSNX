// Exercices & Quiz Interactifs
export const EXERCISES_DATA = [
  {
    "id": "ex-1",
    "cycle": "L1",
    "matiere": "HTML & CSS",
    "title": "Création d'une Card Profil en Glassmorphism",
    "difficulty": "Facile",
    "xp": 50,
    "description": "Réalisez une carte responsive avec fond flou semi-transparent, bordure lumineuse et ombre portée élégante.",
    "question": "Quelle propriété CSS permet de créer un effet de verre dépoli flou sur l'arrière-plan ?",
    "options": [
      "backdrop-filter: blur(10px);",
      "background-blur: 10px;",
      "filter: blur-background(10px);",
      "opacity-filter: glass(10);"
    ],
    "answerIndex": 0,
    "explanation": "La propriété standard CSS \"backdrop-filter: blur(10px);\" applique l'effet de flou à la zone située directement derrière l'élément."
  },
  {
    "id": "ex-2",
    "cycle": "L1",
    "matiere": "JavaScript",
    "title": "Manipulation du DOM et Événements",
    "difficulty": "Moyen",
    "xp": 100,
    "description": "Interceptez le clic d'un bouton pour ajouter dynamiquement un élément de liste.",
    "question": "Quelle méthode permet d'ajouter un écouteur d'événement de manière moderne et recommandée ?",
    "options": [
      "element.addEventListener(\"click\", handler)",
      "element.onclick = handler",
      "element.attachClickEvent(handler)",
      "element.listen(\"click\", handler)"
    ],
    "answerIndex": 0,
    "explanation": "addEventListener est la méthode standard permettant d'attacher plusieurs écouteurs sans écraser les gestionnaires existants."
  },
  {
    "id": "ex-3",
    "cycle": "L2",
    "matiere": "SQL & Bases de données",
    "title": "Requêtes Jointures et Agrégations",
    "difficulty": "Moyen",
    "xp": 120,
    "description": "Écrivez une requête pour calculer la moyenne des notes par étudiant.",
    "question": "Quelle clause SQL permet de filtrer les résultats APRÈS un GROUP BY ?",
    "options": [
      "HAVING",
      "WHERE",
      "FILTER BY",
      "LIMIT"
    ],
    "answerIndex": 0,
    "explanation": "La clause HAVING filtre les groupes générés par la clause GROUP BY, tandis que WHERE filtre les lignes individuelles avant le groupement."
  },
  {
    "id": "ex-4",
    "cycle": "L2",
    "matiere": "Langage C",
    "title": "Arithmétique des Pointeurs",
    "difficulty": "Difficile",
    "xp": 150,
    "description": "Comprendre le fonctionnement des adresses mémoire et du déréférencement.",
    "question": "Si `int tab[5] = {10, 20, 30, 40, 50}; int *p = tab;`, que vaut `*(p + 2)` ?",
    "options": [
      "30",
      "20",
      "Adresse de tab[2]",
      "10"
    ],
    "answerIndex": 0,
    "explanation": "p pointe vers tab[0]. *(p + 2) déréférence l'élément à l'indice 2, soit tab[2] qui vaut 30."
  },
  {
    "id": "ex-5",
    "cycle": "L3",
    "matiere": "Sécurité Web",
    "title": "Protection contre les Failles OWASP",
    "difficulty": "Avancé",
    "xp": 200,
    "description": "Analyse des failles XSS et mise en place d'un Content Security Policy (CSP).",
    "question": "Quel flag de cookie empêche JavaScript d'accéder à un cookie de session (mitigation vol de session XSS) ?",
    "options": [
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "NoScript"
    ],
    "answerIndex": 0,
    "explanation": "Le flag HttpOnly interdit à document.cookie d'accéder au cookie, bloquant ainsi le vol de session en cas de faille Cross-Site Scripting (XSS)."
  }
];
