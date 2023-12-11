# capstone

PointSync will be an application that helps people organize their appointments for times that fit them. Doctors will be able to select their times their free and patients will be able to view those times and select them.
Doctors will be able to take the data from the reasons that patients are seeing them to see what is prevalent in the community.

Frontend: react-vite/mui
Backend: springboot/pgsql

# Project outline:

- Frontent(vite-react): setup view/routes, add mui

- Backend(express): backend express, sequelize(orm) pgsql, routes/models,dto,daos, connection

- Personas: Doctors, patients, timeBlocks

Todos
- [x] fix sequelize connection,
- [-x] fix auth register/login
- [x] fixing client navigation
- [x] atempt basic seeder
- [x] add models for patiets, appointments
- [x] add move client views
- [x] store logged in user in rtk
- [x] show profile page/component and populate with profile info
- [x] get logged in user appointments
- [x] get open appoitnments
- [x] create/delete appointments
- [] update appoitnments
- [] fix client jwt refreshing with queryclient