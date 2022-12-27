# Boardgame Scrappy

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

- `./bin/dev scrap`
- use `--help` for help
- debug with `DEBUG=* ./bin/dev scrap`

## Boardgame Shops

- `npm run scrappy` to run all scrapers sequentionally
- `npm run scrappy:parallel` to run all scrapers parallelly
- `npm run dragoneye` to tun single Dragoneye scraper
- `npm run dragonus` to tun single Dragonus scraper
- `npm run mepel` to tun single Mepel scraper
