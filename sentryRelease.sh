# Script to copy cfg files and replace release tokens for Sentry
sentry_release_hash=$(cat '.git/refs/heads/master')
yes | cp -f './../cfg/config.js' './src/config/config.js'
sed -i "s/RELEASE_REPLACE_TOKEN/$sentry_release_hash/g" './src/config/config.js'
