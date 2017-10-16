echo This script will stop db and api
kill -2 `pgrep mongo`
pm2 kill