# VUMC vpn-control

Frontend/portal for Fortigate VPN connection manager

## Docker development environment

To run the application along with MongoDB, LDAP, and Fortigate services, use Docker:

```
docker compose up --build
```

This uses the included `Dockerfile` and `docker-compose.yml` to provision all services.

## Building and running

1. Get this repo, obviously
2. Get meteor (via Chocolatey on Windows)
3. Get MongoDB 
   * meteor actually bundles it but the setup at VUMC didn't agree with that 
   * so instead you install it separately (make sure to add its `bin` folder to your path) and set the `MONGO_URL` environment variable (the default for a new Mongo install is `mongodb://localhost:27017`)
4. replace the values in `settings/settings.json` with sensible ones (based on whether or not you have a real Fortigate and/or LDAP setup to test with)
   * you may want to cruft up your own LDAP instance for local dev purposes; this is left as an exercise to the reader (I used `ldapjs` for the server and OpenLDAP to query it)
5. from the directory of this readme, run:
`meteor npm --add-python-to-path='true' install --global windows-build-tools`
   * if the VS Build Tools installer hangs while waiting for a log file, open a second terminal, navigate to `%%USER_HOME%%/.windows-build-tools` and run:
   `.\vs_BuildTools.exe > build-tools-log.txt`
   * when it asks you to select what to install, only select Microsoft Visual Studio C++ Build tools
   * the first terminal should pick up the activity and installation should  complete as normal
6. still from this directory, run `meteor npm install`
7. provided nothing has exploded so far, run `meteor --settings=settings/settings.json`
   * first time build will be slow due to initial package downloads etc 

## Hacking

Server-side code is perhaps obviously in `server/main.js`; client-side code is found mostly in `imports` because this is React and we're all encapsulated and componentized. You shouldn't have to mess with anything else.
