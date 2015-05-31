rm -r ./npm-pkg && \
./node_modules/.bin/babel src --out-dir npm-pkg && \
cp package.json ./npm-pkg && \
cp README.md ./npm-pkg && \
cd ./npm-pkg && \
npm publish
