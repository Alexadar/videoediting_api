echo This script will install npm packages, and run pm2 skripts
echo Make sure ffmpeg os package is installed
npm install
mkdir -p data
pm2 delete all 
pm2 start pm2.json
mongod --dbpath ./data --port 15015 --fork --syslog