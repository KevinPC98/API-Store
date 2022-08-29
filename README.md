<p align="left">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## API STORE

Generic API with the functionality of adding products to a cart and making purchases

## Pre Installation

- Create the categories

```bash
INSERT INTO "roles" VALUES ('fc8d37bc-8f71-4b50-b870-cd4fedcbe48f', 'ADMIN'), ('ab59b02f-0842-4e5c-a25b-f9dd1236a7de', 'CLIENT');
```

- Create admin (email: admin@gmail.com, password: 123456)

```bash
INSERT INTO users (uuid, first_name, last_name, user_name, email, password, created_at, role_uuid)
VALUES ('d8ae4145-edec-40a6-a592-018491ac9a3f', 'admin', 'admin', 'admin', 'admin@gmail.com', '$2a$10$Z/kM8LKiS8WmhQND2kkNhedj3VyBCmwwdKDZzMzc57tirop4KRWd6' ,NOW(), 'fc8d37bc-8f71-4b50-b870-cd4fedcbe48f');
```

- Create categories

```bash
insert into categories values
('05db5659-cc3e-47b7-8d76-1acb7f96742b', 'food'),
('e329d954-d24f-487c-a2c4-44b290282ddb', 'home'),
('d125bd05-cb48-4592-907f-12cf4587d15c', 'tech');
```

## Installation

1. Install Yarn

```bash
  $ yarn install
```

2. According the .env.example file create a new file with the same variables

3. Run the migrations

```bash
$ yarn start prisma:migrate:run
```

4.  Generate the models

```bash
$ yarn start prisma:generate
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```
