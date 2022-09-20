<p align="left">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## API STORE

Generic API with the functionality of adding products to a cart and making purchases

## Installation

1. Install Yarn

```bash
  $ yarn install
```

2. According the .env.example file create a new file with the same variables

## Running the app in docker

1. Create network containers

```bash
$ docker-compose up
```

2. In the CLI of the container run:

```bash
$ npx prisma migrate deploy --preview-feature
```

3.  Generate the models

```bash
$ npx prisma generate
```
