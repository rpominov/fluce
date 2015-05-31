rm -rf ./npm-pkg
./node_modules/.bin/babel src --out-dir npm-pkg
cp package.json ./npm-pkg
