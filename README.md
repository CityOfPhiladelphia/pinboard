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
