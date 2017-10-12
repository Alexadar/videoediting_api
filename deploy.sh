echo This script will install npm packages, and run pm2 skripts
npm install
mkdir -p data
mongod --dbpath ./data --port 15100
pm2 delete all 
pm2 start pm2.json