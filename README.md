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
