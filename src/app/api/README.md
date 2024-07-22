dashboard, user -> session 쳐박기

## Common Action
# Error Code
- code: 0 -> success
- code: 1000~ -> Internal Error(Account, Assertion etc)
    - 1400 -> Bad Request(Param, etc)
    - 1401 -> Unauthorized(permission error)
    - 1403 -> Forbidden(permission error)
    - 1405 -> Method not allowed(POST, GET)
    - 1500 -> Internal Server Error
- code: 2000~ -> DB Error(Injection or connection)
- else -> Unknown Error


/api/auth/login
/api/auth/logout
## Common Response
- code: int
- message: string

## ADMIN Action
POST /api/addUser
- request parameter
    - name: string
    - 
- response parameter
    - 
POST /api/removeUser
- request parameter
- response parameter
POST /api/

## TM Action


## SALES Action
POST /api/changeScheduleState
- request parameter
    - scheduleId: string
    - workingState: string
- response parameter
    - code: 0 success

POST /api/changeAddCommnet comment 필요?



role==='admin'

role===
