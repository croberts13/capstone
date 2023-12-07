print:
	cat Makefile

migrate-refresh: ## recrete the database
	npx sequelize-cli db:migrate:undo:all

seed: migrate-refresh: ## recrete the database
	npx sequelize-cli db:seed:all