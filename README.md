# Pinboard
A generic app connected to a Carto endpoint, that allows users to search for a type of resource by location or keyword, and filter by resource type.

![Example](https://mapboard-images.s3.amazonaws.com/Pinboard.JPG)

## Setup
`yarn install`

### Local development
You can use vue ui to serve a local version, or run `yarn serve` for hot reloading.
Linters will run on save, and lint fixes will be run on commits.

## Deploying
Create pull request for changes and merge into `master` branch for travis-ci build to kick-off. The `/dist/` folder will be deployed to Amazon S3.

## Release Notes

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
