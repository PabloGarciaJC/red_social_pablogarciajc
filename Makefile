DOCKER_COMPOSE = docker-compose -f docker-compose.yml

CURRENT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

## Inicia el sistema desde cero
.PHONY: init-app
init-app: | up composer-update

.PHONY: composer-update
composer-update: ## Cambia la propiedad y ejecuta composer update
	docker exec -it php-apache-pablogarciajc bash -c "\
		composer update && \
		chown -R www-data:www-data /var/www/html/storage && \
		chown -R www-data:www-data /var/www/html/bootstrap/cache"
	@echo "Instalacion de la app completado"

# Objetivo para levantar los contenedores
.PHONY: up
up:
	$(DOCKER_COMPOSE) up -d

# Objetivo para bajar los contenedores
.PHONY: down
down:
	$(DOCKER_COMPOSE) down

# Objetivo para reiniciar los contenedores
.PHONY: restart
restart:
	$(DOCKER_COMPOSE) restart

# Objetivo para ver el estado de los contenedores
.PHONY: ps
ps:
	$(DOCKER_COMPOSE) ps

# Objetivo para ver los logs de los contenedores
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs

# Objetivo para construir imágenes
.PHONY: build
build:
	$(DOCKER_COMPOSE) build

# Objetivo para detener los contenedores
.PHONY: stop
stop:
	$(DOCKER_COMPOSE) stop
