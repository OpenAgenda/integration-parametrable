# Intégration paramétrable

## Les prefiltres

**À définir pour afficher les événements passés lorsqu'un filtre temporel est utilisé. Lorsque l'agenda n'a aucun événément à venir ou en cours ne pas définir ce préfiltre pour afficher les événements passés :**

PORTAL_VISIBILITY_PAST_EVENTS=1

**Si les événements passés doivent toujours être affichés :**

PORTAL_FORCE_PASSED_DISPLAY=1

**Définir les événements à afficher par leur statut (par defaut : current, upcoming ):**

PORTAL_PREFILTER=

## Widget total

**Définir pour changer le label du widget total (valeur par défaut: événement et événements)**

CONFIG_TOTAL_LABEL={"fr": "résultat", "en": "result"}
CONFIG_TOTAL_LABEL_PLURAL={"fr": "résultats", "en": "results"}

## Le style

**Une couleur de background à définir (couleur par défaut : white) :**

STYLES_BG_COLOR=

**Deux couleurs prédominantes à définir :**

STYLES_PRIMARY_COLOR=

STYLES_SECONDARY_COLOR=

**Une couleur de bannière à définir  (uniquement si aucune image n'est souhaitée en bannière) :**

STYLES_COLOR_BANNER=

**Une couleur de footer à définir :**

STYLES_FOOTER_COLOR=

**Une couleur de texte et de background à définir pour la mention "à la une":**

STYLES_FEATURED_BG_COLOR=

STYLES_FEATURED_COLOR=

**À définir pour supprimer les marges :**

STYLES_NO_MARGIN=1

**À définir pour supprimer les ombres :**

STYLES_NO_SHADOWS=1

**Ajouter un lien css externe :**

EXTERNE_CSS_LINK=

**Ne pas charger les images srcset**

STYLES_USE_SRCSET_IMG=0

## La bannière

**Afficher la bannière :**

STYLES_DISPLAY_BANNER=1

**Définir l'image de la bannière (uniquement si aucune couleur n'a été prédéfinie précédemment) :**

STYLES_IMG_BANNER=https://banner.png

**Définir le logo de la bannière :**

STYLES_LOGO_BANNER=https://logo-banner.png

**À définir si le logo n'est pas assez visible :**

STYLES_DARKER_BANNER=1

## Les filtres

### Afficher uniquement le filtre "rechercher"

STYLES_DISPLAY_ONLY_SEARCH_FILTER=1

### Sinon définir les filtres à afficher (nombre paire)

**Afficher le filtre "calendrier" :**

STYLES_DISPLAY_CALENDAR_FILTER=1

**Afficher le filtre "ville" :**

STYLES_DISPLAY_CITY_FILTER=1

**Afficher le filtre "type de participation" :**

STYLES_DISPLAY_ATTENDANCEMODE_FILTER=1

**Afficher le filtre "mot-clé" :**

STYLES_DISPLAY_KEYWORDS_FILTER=1

**Afficher le filtre "rechercher" :**

STYLES_DISPLAY_SEARCH_FILTER=1

### Afficher des filtres additionnels

STYLES_DISPLAY_ADDITIONAL_FILTER=1

**Définir le titre et le label des filtres additionnels :**

STYLES_ADDITIONAL_TITLE_FILTER=Filtre1,Filtre2

STYLES_ADDITIONAL_SLUG_FILTER=Slug1,Slug2

**Définir une icone associée aux filtres additionnels :**

Choisir une icone parmi : default, access, accessibility, categories, themes, conditions, location, public, 

STYLES_ADDITIONAL_IMG_FILTER=default,access

**Définir un tri pour les filtres additionnels :**

Au delà du choix par défaut, un tri est disponible: 'alphabetical'.

STYLES_ADDITIONAL_SORT_FILTER=,alphabetical,,alphabetical

Lorsque cette variable est définie, définir le même nombre d'éléments qu'il y en a dans STYLES_ADDITIONAL_SLUG_FILTER

**Déterminer le nombre de valeurs à charger dans les options présentées dans le filtre:**

STYLES_ADDITIONAL_SIZE_FILTER=,,120

Lorsque cette variable est définie, définir le même nombre d'éléments qu'il y en a dans STYLES_ADDITIONAL_SLUG_FILTER

### Afficher le filtre calendrier d'une periode donnée

CONFIG_DISPLAY_PERIOD_FILTER=1

**Définir la periode :**
CONFIG_DATE_PERIOD_FILTER_BEGIN=2024-01-01
CONFIG_DATE_PERIOD_FILTER_END=2024-01-05

**Définir la taille du bouton**

STYLES_PERIOD_FILTER_SIZE_BTN=33%

### Afficher le filtre map

STYLES_DISPLAY_MAP_FILTER=1

Optionnellement, définir la hauteur de la carte:
STYLES_MAP_FILTER_HEIGHT=456px

## Les boutons

**À définir pour ne pas afficher le bouton de contribution :**

STYLES_NO_CONTRIBUTE_BUTTON=1

**À définir pour ne pas afficher le bouton d'export :**

STYLES_NO_EXPORT_BUTTON=1

## La vue liste

**Définir le type d'affichage des items (mozaïque par défaut) :**

STYLES_TYPE_LIST=line

**Afficher la dscription courtes :**

STYLES_DISPLAY_LIST_DESCRIPTION=1

**Mettre le titre en gras :**

STYLES_BOLD_TITLE_FONT=1

**Afficher l'âge :**

STYLES_DISPLAY_LIST_AGE=1

**Definir le champ lieu (si ces variables ne sont pas définies le champ lieu est par défaut: location.name) :**

STYLES_DEFINE_LIST_LOCATION=1

STYLES_LIST_KEY_LOCATION=lieu-de-lanimation

**Definir le label du champ lieu (par défaut: "Lieu") :**

STYLES_LIST_KEY_LOCATION_LABEL

**Définir le champ catégorie (si ces variables ne sont pas définies le champ catégorie n'apparaît pas) :**

STYLES_DISPLAY_LIST_CATEGORY=1

STYLES_LIST_KEY_CATEGORY=categorie-danimation

**Une couleur de texte et de background à définir pour le champ catégorie :**

STYLES_LIST_CATEGORY_BG_COLOR=

STYLES_LIST_CATEGORY_COLOR=

**Définir un champ à afficher en plus (si ces variables ne sont pas définies rien n'apparaît) :**
STYLES_DISPLAY_LIST_MORE=1

STYLES_LIST_KEY_MORE=exposant

**Definir le label du champ à afficher en plus :**

STYLES_LIST_KEY_MORE_LABEL=Exposant

**Changer le tri :**

OPTION_SORT=timingsWithFeatured.asc

Les tris disponibles sont documentés ici: https://developers.openagenda.com/10-lecture/

## La vue détail

**Afficher les infos se situant à droite (partage, calendrier, localisation) :**

STYLES_DISPLAY_RIGHT_EVENT_INFOS=1

**Afficher les champs additionnels (les affiche tous par défaut) :**

CONFIG_DISPLAY_ADDITIONAL_FIELDS_EVENT=1

**Définir les champs additionnels à afficher pour n'en afficher que quelques uns :**

CONFIG_SELECTED_ADDITIONAL_FIELD=lieu-de-lanimation,categorie-danimation

## Le footer

### Afficher un lien vers OpenAgenda

STYLES_DISPLAY_LINK_OA=1

### Afficher le footer

STYLES_DISPLAY_FOOTER=1

### Définir un logo

STYLES_LOGO_FOOTER=https://logo-footer.png

### Définir le lien de l'organisation

**Le lien :**

STYLES_LINK_PRINCIPAL=https://www.organisation.com/

**Le texte qui sera affiché par ce lien :**

STYLES_TEXT_LINK_PRINCIPAL=Organisation

### Lien Facebook

**Afficher un lien Facebook :**

STYLES_DISPLAY_LINK_FACEBOOK=1

**Définir le lien Facebook :**

STYLES_LINK_FACEBOOK=https://www.facebook.com/

### Lien Twitter

**Afficher un lien Twitter :**

STYLES_DISPLAY_LINK_TWITTER=1

**Définir le lien Twitter :**

STYLES_LINK_TWITTER=https://www.twitter.com/

### Lien Instagram

**Afficher un lien Instagram :**

STYLES_DISPLAY_LINK_INSTAGRAM=1

**Définir le lien Instagram :**

STYLES_LINK_INSTAGRAM=https://www.instagram.com/

### Lien Youtube

**Afficher un lien Youtube :**

STYLES_DISPLAY_LINK_YOUTUBE=1

**Définir le lien Youtube :**

STYLES_LINK_YOUTUBE=https://www.youtube.com/

## La map (pas obligatoire)

**Attribution à définir :**

MAP_TILES_ATTRIBUTION=

**URL à définir :**

MAP_TILES_URL=

**Définir le chemin de l'icone (icone par défaut si cette variable n'est pas définie):**

MAP_MARKER_ICON_PATH=../markerIcon.png

## Le Preview

**Afficher le bouton "Voir tous les événements" :**

STYLES_DISPLAY_LIST_BTN=1
STYLES_LINK_LIST_BTN=https://www.lien-vers-la-vue-liste.com