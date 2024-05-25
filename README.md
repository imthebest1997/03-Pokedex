<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex App

## Execute in Development
1. Clone the repository
2. Run the command 
```
yarn install
```
3. Verify if Nest Cli is installed; otherwise, install it using the command
```
  npm i -g @nestjs/cli
```
4. Start up the database.
```
docker-compose up -d
```

5. Clone the file __.env.template__ and rename the copy to __.env__

6. Fill the environment variables defined in the ```.env```

7. Run the app in dev mode:
```
yarn run start:dev
```

8. Rebuild the database with the seed
```
  http://localhost:3000/api/v2/seed  
```


# Production Build
1. Create the file ```env.prod```
2. Fill in the environment variables of prod.
3. Create the new image 
```
Build:
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

Run
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

## Stack used
* MongoDB
* Nest