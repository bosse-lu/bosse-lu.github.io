# Rédaction des pages News et Spécial footeux

Ce guide décrit comment les articles des pages **English News** (`news/`) et **Spécial footeux** (`foot/`) sont préparés, validés et publiés. Il sert de référence aux tâches programmées de Claude et à M. Bosse.

## Le circuit de validation

1. **Préparation.** Les nouveaux articles sont ajoutés dans `news/drafts.json` ou `foot/drafts.json`, puis envoyés sur le site (commit + push).
2. **Aperçu.** Les brouillons ne sont visibles qu'à l'adresse de la page suivie de `?apercu` :
   - https://bosse-lu.github.io/news/?apercu
   - https://bosse-lu.github.io/foot/?apercu
3. **Validation.** M. Bosse relit l'aperçu et répond dans la conversation de la tâche : il valide, demande des corrections ou refuse un article.
4. **Publication.** Seulement après son accord, les articles validés sont déplacés de `drafts.json` vers le **début** de `articles.json`. On vide ensuite `drafts.json` (`[]`), puis on fait un commit et un push.

On ne publie jamais dans `articles.json` sans accord explicite. Un article refusé est supprimé de `drafts.json`.

## Rythme

- **Spécial footeux** : chaque lundi, 2 ou 3 articles sur l'actualité du week-end et des jours précédents. Le brouillon est préparé le dimanche soir.
- **English News** : vérification chaque semaine, mais 1 à 3 articles **seulement si l'actualité en vaut la peine**. S'il n'y a rien de pertinent, ne rien préparer et le dire.

## Choix des sujets

- L'histoire se passe dans un **pays anglophone** (Royaume-Uni et ses nations, États-Unis, Canada, Irlande, Australie, Nouvelle-Zélande, Jamaïque, Guyana, Afrique du Sud…) ou concerne un acteur anglophone (NASA, une université britannique…).
- **News** : sciences, espace, animaux, nature, environnement, école et éducation, technologie, culture, sport hors football, initiatives de jeunes. On varie les thèmes d'une semaine à l'autre.
- **Foot** : Premier League, coupes anglaises, football féminin (WSL, Lionesses), Écosse, MLS et NWSL, sélections, belles histoires (petits clubs, jeunes joueurs, records). On inclut du football féminin aussi souvent que possible.
- **À éviter** : violence, faits divers tragiques, guerre, sujets politiques clivants, alcool, paris sportifs, publicités, rumeurs non confirmées, vie privée des joueurs, transferts non officiels.
- L'actualité date de **moins de 10 jours** (foot : de préférence du week-end).

## Sources et droits

- On s'appuie sur des sources fiables (agences de presse, grands médias, sites officiels de clubs, de ligues ou d'institutions scientifiques). **Jamais** de site de paris sportifs.
- Chaque fait (score, date, nom, chiffre) est vérifié dans la source, si possible dans deux sources.
- Le texte est **entièrement rédigé avec nos propres mots** en anglais simplifié. On ne recopie aucune phrase de la source, au plus une très courte citation entre guillemets. On ne reprend **aucune photo** : un emoji et le drapeau suffisent.
- Chaque article cite sa ou ses sources, avec un lien vers l'original.

## Niveau de langue

- **5e = A2** : phrases courtes, présent et prétérit simple, vocabulaire courant, 110 à 150 mots.
- **4e = A2+** : on peut ajouter le present perfect, des connecteurs (because, so, but, when), quelques mots plus rares expliqués dans les key words, 130 à 170 mots.
- Les articles foot sont de niveau 4e (classe de 4e section foot).
- Les chiffres sont écrits en chiffres, les dates en toutes lettres (« 27 October 2026 »).

## Format d'un article (JSON)

```json
{
  "id": "2026-11-02-court-identifiant",
  "date": "2026-11-02",
  "level": "5e" | "4e" | "5e · 4e",
  "topic": "Space | Nature | School | Science | Technology | Sport | Premier League | Women's football | …",
  "country": "England",
  "flag": "uk | england | scotland | ireland | usa | canada | australia | newzealand | jamaica | guyana",
  "emoji": "🚀",
  "title": "Titre court en anglais",
  "lead": "Une phrase qui résume l'article.",
  "body": ["Paragraphe 1", "Paragraphe 2", "Paragraphe 3", "Paragraphe 4"],
  "keywords": [["mot tel qu'il apparaît dans le texte", "traduction"], "… 6 à 8 mots-clés"],
  "questions": [
    {"q": "Question en anglais ?", "options": ["A", "B", "C"], "answer": 1},
    "… 3 questions à choix multiple, réponse = position de la bonne option (0, 1 ou 2)"
  ],
  "turn": "Une consigne « Your turn! » pour l'oral ou l'écrit, avec une amorce de phrase.",
  "sources": [{"name": "Nom du média (pays)", "date": "27 October 2026", "url": "https://…"}]
}
```

- `date` est la date de mise en ligne sur le site ; `id` commence par cette date.
- Les mots-clés sont soulignés automatiquement dans le texte : écrire chaque mot-clé **exactement sous la forme du texte** (par exemple « drove », pas « to drive »).
- Les questions portent sur des informations précises du texte. Les mauvaises réponses sont plausibles mais clairement fausses.
- Vérifier que le fichier JSON reste valide (`python3 -m json.tool fichier.json`).

## Message de validation

Après avoir poussé les brouillons, envoyer à M. Bosse un message court en français avec :
- le lien d'aperçu,
- pour chaque article : le titre, le niveau et une phrase sur le sujet,
- la question : « Je publie tout, ou vous souhaitez des changements ? »
