echo This script will stop db and api
mongod --dbpath ./data --shutdown
pm2 kill