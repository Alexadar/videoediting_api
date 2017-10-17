# videoediting_api
Video editing REST API
Done as "Proof of skils" test task

# Required software
NodeJS, PM2, ffmpeg, mongodb

# Start/Stop
Run start.sh and stop.sh scripts to run or stop app.
<br/>
start.sh will start pm2 process manager with api and worker node processes. Allso, it will 
<br/>
start mongod daemon in data foldr
<br/>
stop.sh will stop node processes and mongodb instance


# Test client
http://localhost:15000 will run test client
<br/>
You can test 'failed job' or 'rerun job' flows if you will login with user 'luckyStrike'

#Known limitations
Output file allways .mp4
<br/>
todo: Do a filesize check, filetype check for uploading source video.
<br/>
todo: gracefull stop of worker
<br/>
todo: omit internal data from responces
<br/>
todo: user security for /files/done folder

# API
## Endpoints
{client} stands for client type. Currently IOS
<br/>
{v} stands for API version, currently 1
<br/>
API requests are 'application/json'

## IOS
### /api/{client}/{v}/getUser
Request should pass user name, and in responce it will receive authorisation string for other api calls and socket connect: 
<br/>
## request 
        {
            body: {
                userId: 'userName'
            }
        }
<br/>
##responce 
        {data:    
            {
                userId: userId, - your user nmae
                jobs: [{
                    {
                        "_id",
                        "type", 
                        "state",
                        "createDate",
                        "updateDate",
                        "data" : {
                            "name", 
                            "trimStart",
                            "trimEnd",
                            "resultFile" - url to result file
                        },
                        "userId" - job owner
                    }
                }],
                constants, - dictionaries for states, types etc.
                accessHeaders - headers for API calls and socket security
            }
        }    

### /api/{client}/{v}/createFileTrimJob
Request should pass variables like trim start/end, desirable job name and file
<br/>
##Request should be multipart/formdata
<br/>
request: 
trimFileUpload - videoFile
<br/>
name
<br/>
trimStart
<br/>
trimEnd



### /api/{client}/{v}/restartJob
Request should pass job id and new state
<br/>
Request:
<br/>
{
    body: {
          state: constants.jobStates.created,
          _id: job._id
    }
}
<br/>
Responce:
<br/>
If responce contain no errors, job updtaed succesfully

### /files/{fileName}
You can download any video file from ths route.
<br/>
File url being passed on login in jobs[] array, or during socket event on notify

## Socket
### /ws
You can connect to websocket for job notifications
<br>
Socket url is /ws?accesstoken=yourAccessToken

### /onJobCompleeted
Emmited on job completed. JOb states could be failed/completed/rerunable

