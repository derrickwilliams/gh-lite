# GH Lite
Simple Angular-driven app that talks to Github API

## Use locally

### Clone this repository
```git clone git@github.com:derrickwilliams/gh-lite.git```

```cd gh-lite```

checkout the latest tag (currently - `v0.0.1`)

### setup .env file
1. in github create a personal access token that has at least these privileges: `read:org, repo, user`
2. create .env file in root of project
3. add entry for GH_API_TOKEN=*****GENERATED TOKEN FROM STEP 1*****

### build project
1. `npm install`
2. `./node_modules/.bin/gulp build`

### Start node server
```node server.js``` 

#### Visit
http://localhost:9999/#/user/*****GITHUB USERNAME*****
