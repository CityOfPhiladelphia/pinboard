# Pinboard

Pinboard is a framework for creating apps for investigating a single data layer in great detail. It has a refine panel along the top, which you can use to filter some of the pins and data off of the app. It also shows a map panel on the right, and a list of pins on the left, which can opened and closed to show more data about the pin.

The package is in npm as [@phila/pinboard](https://www.npmjs.com/package/@phila/pinboard).

It is used to create multiple apps for the City of Philadelphia, including:

|Site|GitHub|
|---|---|
|[Food distribution sites](https://www.phila.gov/food/#/)|[repo](https://github.com/CityOfPhiladelphia/free-meals-resource-finder)|
|[Resources for immigrants](http://phila-resource-finder.s3-website-us-east-1.amazonaws.com/immigrant/prod/#/)|[repo](https://github.com/CityOfPhiladelphia/immigrant-resource-finder)|
|[Resources for recycling and donation](https://www.phila.gov/recycling-donation-finder/)|[repo](https://github.com/CityOfPhiladelphia/recycling-and-donation-finder)|
|[Resources for businesses](https://phila-resource-finder.s3.amazonaws.com/business/prod/index.html)|[repo](https://github.com/CityOfPhiladelphia/business-technical-support-finder)|

![Food_Example](https://mapboard-images.s3.amazonaws.com/pinboard/phone-free-meals-resource-finder.JPG)
![Immigrant_Example](https://mapboard-images.s3.amazonaws.com/pinboard/phone-immigrant-resource-finder.JPG)
![Example](https://mapboard-images.s3.amazonaws.com/Pinboard.JPG)

## Setup
`yarn install`

### Local development
You can use vue ui to serve a local version, or run `yarn serve` for hot reloading.
Linters will run on save, and lint fixes will be run on commits.

## Deploying
Create pull request for changes and merge into `master` branch for travis-ci build to kick-off.

## Release Notes

### 1.3.2 - 9/24/2024

* fix for backwards compatibility for recycling finder
* allows sorting the data for the map, so you can put some points above others (when they are doubled)

### 1.3.1 - 8/27/2024

* adds a fix for a tooltip for a multiple refine group

### 1.3.0 - 8/27/2024

* adds a fix to Fuse for handling keyword matches

### 1.2.15 - 8/23/2024

* merges all work for setting up lactation-spaces-finder

### 1.2.14 - 6/7/2024

* allows sizing the logo

### 1.2.13 - 4/17/2024

* fixes bug in MapPanel.vue that was causing a console error when loading with a pin in the url

### 1.2.12 - 2/28/2024

* uses @phila/vue-datafetch that adds headers to http request

### 1.2.11 - 12/21/2023

* allows forced message in holiday banner

### 1.2.10 - 11/27/2023

* makes "forceBanner" option work for a week after a holiday

### 1.2.9 - 11/21/2023

* sets up "forceBanner" option for holidays, which overrules the automatic holiday banner option

### 1.2.8 - 11/13/2023

* incorporates @phila/vue-datafetch 2.2.16, which has a small bugfix for pinboard after major changes for mapboard

### 1.2.7 - 10/17/2023

* small bugfixes for running business resource finder off 1.2.x release

### 1.2.6 - 10/5/2023

* sets up holiday banner for translating holiday names

### 1.2.5 - 9/5/2023

* uses new gtag id for GA4 for 2nd time

### 1.2.4 - 8/31/2023

* small fix for holiday banner

### 1.2.3 - 8/30/2023

* reverts gtag change
* sets up automatic holiday banner

### 1.2.2 - 8/14/2023

* changes gtag to use phila.gov GA4 id

### 1.2.1 - 7/24/2023

* bugfix for singular section titles in expand-collapses

### 1.2.0 - 7/14/2023

* releases many features created during user testing

### 1.1.47 - 6/8/2023

* adds css for alert modal

### 1.1.46 - 3/24/2023

* fixes bug with using maplibre

### 1.1.45 - 3/24/2023

* uses @phila/vue-mapping with updated maplibre and @phila/vue-datafetch with updated geoserver

### 1.1.44 - 2/22/2023

* fixes bug with apps that do not use circlemarkers

### 1.1.43 - 2/21/2023

* fixes bug with using tab and spacebar to open refine panel

### 1.1.42 - 2/9/2023

* updates packages

### 1.1.41 - 12/27/2022

* undoes change to filtering of categoryField_array apps

### 1.1.40 - 12/23/2022

* fixes bug with filtering of categoryField_array apps

### 1.1.39 - 10/25/2022

* fixes gtag for language selector

### 1.1.38 - 9/27/2022

* changes terminology from from dependent/independent to checkbox/radio
* fixes for screen readers

### 1.1.37 - 9/9/2022

* ran package updates

### 1.1.36 - 9/7/2022

* allows website text to wrap in default cards

### 1.1.35 - 9/7/2022

* cleans up css of default cards

### 1.1.34 - 9/6/2022

* moves more css into main project
* does not conditionally import any @phila/vue-mapping elements

### 1.1.33 - 9/1/2022

* moves css from primary care finder into src/assets/scss/expandCollapse.scss

### 1.1.32 - 8/18/2022

* fixes refine to filter in default i18n files

### 1.1.31 - 8/17/2022

* further bug fix for translating tags in refine panel

### 1.1.30 - 8/17/2022

* makes default link behavior to open a new tab

### 1.1.29 - 8/17/2022

* bug fix for translating tags in refine panel

### 1.1.28 - 8/16/2022

* bug fix for icon size

### 1.1.27 - 8/16/2022

* fixes for refine panel css spacing

### 1.1.26 - 8/16/2022

* fixes css of Apply Filters button in Mobile

### 1.1.25 - 8/15/2022

* fixes appLink

### 1.1.24 - 8/15/2022

* fix for initial services routing bug

### 1.1.23 - 7/28/2022

* ui changes in refine panel

### 1.1.22 - 7/22/2022

* cleans up searchBar code

### 1.1.21 - 7/21/2022

* splits i18n file into separate language files

### 1.1.20 - 7/21/2022

* opens refine panel when view list is clicked if not mobile
* makes independent groups (radio buttons) also affect refine results

### 1.1.19 - 7/12/2022

* fixes bug with finding languages for i18n

### 1.1.18 - 7/11/2022

* allows routing by language selected

### 1.1.17 - 7/8/2022

* fixes z-index of address search bar to be beneath the language dropdown

### 1.1.16 - 7/7/2022

* fixes bug where wrong expandCollapse stays open when you search an address

### 1.1.15 - 7/7/2022

* allows address marker color to be settable

### 1.1.14 - 7/7/2022

* changes color of address marker to purple, fixes length of address search bar issues

### 1.1.13 - 7/6/2022

* fixes sorting of locations alphabetically and numerically

### 1.1.12 - 7/6/2022

* fixes padding in non-mobile refine panel

### 1.1.11 - 7/5/2022

* fixes padding in mobile refine panel

### 1.1.10 - 6/30/2022

* fixes refine panel issues for categoryField_value app like Food Finder

### 1.1.9 - 6/30/2022

* cleans up major mobile ux issues

### 1.1.8 - 6/28/2022

* fixes bug with app that has no tooltips

### 1.1.7 - 6/28/2022

* fixes bug with tooltips for larger checkbox label

### 1.1.6 - 6/28/2022

* fixes tooltips for multiline option

### 1.1.5 - 6/27/2022

* makes tooltips in checkbox category label work

### 1.1.4 - 6/27/2022

* removes old i18n Banner entirely, fixes bug with header placement on phila-ui lang selector

### 1.1.3 - 6/21/2022

* fixes bug with categoryField_value apps and routing

### 1.1.2 - 6/21/2022

* uses phila-ui for i18n
* makes tooltips in mobile permanent

### 1.1.1 - 5/27/2022

* cleans up mobile screen css

### 1.1.0 - 5/26/2022

* allows retractableRefine option

### 1.0.10 - 2/22/2022

* fixes small issues with accessibility

### 1.0.9 - 2/18/2022

* fixes issues with z-index of input over map, placement of i18n globe

### 1.0.8 - 2/17/2022

* allows @phila/phila-ui radio buttons in refine panel that work with i18n

### 1.0.7 - 2/15/2022

* makes it so that the address/keyword input can be for addresses only

### 1.0.6 - 1/20/2022

* fixes bug with loading app filtered when coordinates are projected

### 1.0.5 - 1/20/2022

* uses pvm 3.1.4, fixing z-index issues
* fixes longstanding bug with loading the app filtered and then unfiltering

### 1.0.4 - 1/19/2022

* uses pvm 3.1.3, fixes placement of text in mapbox popups

### 1.0.3 - 1/19/2022

* uses pvm 3.1.2 which fixes circle markers and popups
* cleans up old scss and vestigial files

### 1.0.2 - 1/18/2022

* uses new commits of pvd and pvm
* fixes scrollbar issues

### 1.0.1 - 9/20/2021

* fixes tag searching

### 1.0.0 - 8/20/2021

* uses @phila/phila-ui, stops using @phila/vue-comps

### 0.6.0 - 6/10/2021

* fixes refine for Multiple Field Groups apps

### 0.5.15 - 3/30/2021

* removes undefined boxes from refine panel

### 0.5.14 - 2/9/2021

* fixes bug in RefinePanel.vue if refine value is a string

### 0.5.13 - 2/8/2021

* adds fuse.js, uses it on keyword search

### 0.5.12 - 11/24/2020

* hides tags label in default expand-collapse-content if there are none

### 0.5.11 - 11/24/2020

* allows tags types to be set in config

### 0.5.10 - 11/23/2020

* makes any categoryField_value app use radio buttons instead of checkboxes
* makes filtering using multiple checkboxes use an AND query, to reduce results if more boxes are clicked

### 0.5.9 - 10/23/2020

* fixes githubs actions for push to npmjs

### 0.5.8 - 10/23/2020

* uses pvc 2.1.19
* uses pvd 1.4.4
* uses github actions for push to npmjs

### 0.5.7 -10/9/2020

* changes for adding sections to the voting site

### 0.5.6 - 10/8/2020

* adds "cityOfPhiladelphia" to pinboard built in i18n values

### 0.5.5 - 10/8/2020

* makes vue-gtag work for all resource finders

### 0.5.4 - 10/8/2020

* adds vue-gtag package and tags events

### 0.5.3 - 10/7/2020

* uses upgraded vue libraries:
    * @phila/vue-mapping 2.2.9
    * @phila/vue-comps 2.1.15
    * @phila/vue-datafetch 1.4.3

### 0.5.2 - 9/29/2020

* fixes issues with i18n when you use fewer languages

### 0.5.1 - 9/29/2020

* updates packages, small changes for voting finder

### 0.5.0 - 8/28/2020

* uses pvd and pvm releases that do not import leaflet unless needed

### 0.4.8 - 8/14/2020

* fixes bugs with i18n in refine panel, info circles in refine panel

### 0.4.7 - 8/14/2020

* fixes bug with point color

### 0.4.6 - 6/25/2020

* fixes css issues

### 0.4.5 - 6/17/2020

* fixes bug with missing latlng

### 0.4.4 - 6/17/2020

* fixes bug with font awesome marker placement in mapbox map

### 0.4.3 - 6/16/2020

* fixes keyword search when keyword is the first option

### 0.4.2 - 6/16/2020

* fixes keyword search when keyword is the only option

### 0.4.1 - 6/16/2020

* fixes search by keywords

### 0.4.0 - 6/16/2020

* moves up minor version to test npm

### 0.3.10 - 6/16/2020

* uses mapbox FontAwesomeMarker.vue from @phila/vue-mapping

### 0.3.9 - 6/15/2020

* fixes issues with data rows that are missing geometries

### 0.3.8 - 6/14/2020

* uses new releases of vue packages, uses airtable sources, mapbox styles hosted by mapbox

### 0.3.7 - 6/9/2020

* uses pvm 2.1.5, with many new mapbox features added

### 0.3.6 - 5/27/2020

* upgrades all packages

### 0.3.5 - 5/22/2020

* adds to footer

### 0.3.4 - 5/22/2020

* adds all kinds of alert functionality

### 0.3.3 - 5/18/2020

* fixes tiny bug with custom greeting

### 0.3.2 - 5/18/2020

* fixes small css issues and bugs

### 0.3.1 - 5/18/2020

* fixes small issues to make new changes compatible with original pinboard apps

### 0.3.0 - 5/15/2020

* uses @phila/vue-comps 2.1.2
* adds major changes to refine panel options

### 0.2.0 - 5/5/2020

* uses minor updates to libraries:
  * @phila/vue-comps 2.1.1
  * @phila/vue-mapping 2.1.1
  * @phila/vue-datafetch 1.2.0

### 0.1.18 - 2/3/2020

* pushes to @phila/pinboard* uses new locations for phila libraries:
  * @phila/vue-comps 2.0.9
  * @phila/vue-mapping 2.0.5
  * @phila/vue-datafetch 1.1.7
* pushes to @phila/pinboard instead of @philly/pinboard

### 0.1.17 - 12/16/2019
* Adds how to use content.

### 0.1.16 - 11/04/2019

* Uses pvc 1.0.47

### 0.1.15 - 10/30/2019
* Adds new fields + accessibility features

### 0.1.14 - 10/24/2019

* adds all upgrades that depedabot put into separate pull requests

### 0.1.13 - 10/17/2019

* Uses pvm 1.0.43 which fixes VectorMarker updating - allows more points to be used on the pinboard
* Uses pvc 1.0.42

### 0.1.12 - 10/9/2019

* Uses new releases of @philly libraries which ran upgrades
  * Uses @philly/vue-comps 1.0.41
  * Uses @philly/vue-mapping 1.0.41
  * Uses new restructured pvd (which also ran upgrades)
    * Uses @philly/vue-datafetch 0.0.27

### 0.1.11 - 9/6/2019

* Uses new releases of @philly libraries which ran upgrades
  * Uses @philly/vue-comps 1.0.37
  * Uses @philly/vue-mapping 1.0.36
  * Uses @philly/vue-datafetch 0.0.24

### 0.1.10 - 9/6/2019

* release that had to be replaced right away

### 0.1.9 - 8/9/2019

* Uses new releases of @philly libraries which ran upgrades
  * Uses @philly/vue-comps 1.0.36
  * Uses @philly/vue-mapping 1.0.35
  * Uses @philly/vue-datafetch 0.0.22
