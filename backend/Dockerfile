FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring zip pcntl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . /app

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --ignore-platform-reqs

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "touch database/database.sqlite && php artisan migrate --force --no-interaction && php artisan serve --host=0.0.0.0 --port=${PORT}"]
