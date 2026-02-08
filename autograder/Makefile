SHELL := /bin/bash

.PHONY: up down backend frontend db

up: db

db:
	@docker-compose up -d db
	@echo "Postgres started."

down:
	@docker-compose down

backend:
	@cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	@cd frontend && npm run dev
