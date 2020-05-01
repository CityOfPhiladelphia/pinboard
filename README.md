# Pinboard

Pinboard is a framework for creating apps that allow users to search for a type of resource by location or keyword, and filter by resource type.

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
Create pull request for changes and merge into `master` branch for travis-ci build to kick-off. The `/dist/` folder will be deployed to Amazon S3.

## Release Notes

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
