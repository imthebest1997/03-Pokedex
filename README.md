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
5. Rebuild the database with the seed
```
  http://localhost/3000/api/v2/seed  
```


## Stack used
* MongoDB
* Nest