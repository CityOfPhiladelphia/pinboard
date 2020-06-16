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
