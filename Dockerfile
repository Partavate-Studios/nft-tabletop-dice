# PolyDice image builder. JS client in /var/www/client, PHP metadata service in /var/www/metadata
# Only /var/www/client has `composer/npm istall` run against it.

# Build Stage 1: Install Composer Dependencies
# Latest Composer LTS version as of 2022.03.22: 2.2
FROM composer:2.2 AS composer
COPY ./client /var/www/client
COPY ./web2-metadata /var/www/metadata

WORKDIR /var/www/client
RUN if [ -f "composer.json" ]; then \
        composer install --quiet --ignore-platform-reqs --no-interaction --no-dev --prefer-dist --optimize-autoloader; \
    fi

# Build Stage 2: NPM Install to generate assets
# Latest Node.js LTS version as of 2022.03.22: 16.14.2
FROM node:17.9-alpine AS node_npm
WORKDIR /var/www/client
COPY --from=composer /var/www/ /var/www/
# The JS Client requires ABI and address JSON artifacts for the EVM Contracts
COPY ./evm/artifacts/contracts/Dice.sol/TabletopDiceNFT.json /var/www/evm/artifacts/contracts/Dice.sol/TabletopDiceNFT.json
COPY ./evm/artifacts/contracts/DiceLibrary.sol/DiceLibrary.json /var/www/evm/artifacts/contracts/DiceLibrary.sol/DiceLibrary.json
COPY ./evm/addresses/published-addresses.json /var/www/evm/addresses/published-addresses.json

# Vue/Vite uses `npm run build`, Laravel uses `npm run prod`
RUN npm config set depth 0 && \
    npm install --silent --no-progress && \
    (npm run prod --silent --no-progress || npm run build --silent --no-progress) && \
    rm -rf node_modules

# Build Stage 3: Final image, without unneeded components
# Base image from https://github.com/Partavate-Studios/nginx-php-fpm
FROM registry.gitlab.com/partavate/infrastructure/nginx-php-fpm:php81

COPY ./web2-metadata/nginx.conf /etc/nginx/conf.d/polydice.conf
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy compiled PHP and Assets to the final image
COPY --from=composer /var/www/metadata /var/www/metadata
COPY --from=node_npm /var/www/client/public /var/www/client/public
