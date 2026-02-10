SHELL := /bin/bash

.PHONY: up down backend frontend db seed

up: db frontend backend seed

db:
	@docker-compose up -d db

frontend:
	@docker-compose up -d frontend

backend:
	@docker-compose up -d backend

seed:
	@docker-compose exec db bash -c "your-seed-command-here"

down:
	@docker-compose down
