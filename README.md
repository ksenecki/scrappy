# Scrappy

Scraping Boardgamepage Shops using [Playwright](https://playwright.dev/) and [oclif.io](https://oclif.io/)
Data can be filtered using [scrappy-web](https://github.com/ksenecki/scrappy-web)

## Project requirements

1. [Node 16+](https://nodejs.org/en/docs/)

## How to setup the Project

1. Clone repository
2. Enter the project directory and execute `npm install` in order to install all the packages

## Install Playwright with npm

1. `npm install playwright`
2. `npm install @playwright/test`

## Running Scrappy with oclif.io

- `./bin/dev <command> --save <flag>` to run with a flag to save
- `save`: `json`, console.log() as default
- use `--help` for help
- debug with `DEBUG=* ./bin/dev command`

## Boardgame Shops

- `npm run scrappy` to run an example
- `npm run scrappy:parallel` to run all scrapers parallelly
- `npm run <shopname>:json` to run single shop scraper, e.g. `npm run dragoneye`
- available shops: `dragoneye`, `dragonus`, `mepel`, `planszostrefa`, `shopgracz`
- scraping only available games if possible
