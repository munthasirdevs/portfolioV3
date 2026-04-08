###############################################################################
# Backend Dockerfile — Laravel 11 + PHP 8.3 + Octane (Swoole)
###############################################################################

# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Base image with PHP 8.3 and common dependencies
# ──────────────────────────────────────────────────────────────────────────────
FROM php:8.3-fpm AS base

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    libssl-dev \
    libnghttp2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Swoole for Octane
RUN pecl install swoole && \
    docker-php-ext-enable swoole

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files (will be overridden by volume mount in dev)
COPY . /var/www/html 2>/dev/null || true

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Development environment
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS development

# Install additional dev tools
RUN apt-get update && apt-get install -y \
    vim \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Laravel dependencies
RUN composer install --no-interaction --optimize-autoloader

# Generate application key
RUN php artisan key:generate --ansi 2>/dev/null || true

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8081

# Default command for development
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8081", "--watch"]

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: Production build
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS production

# Copy application files
COPY --chown=www-data:www-data . /var/www/html

# Install dependencies (optimized for production)
RUN composer install \
    --no-dev \
    --no-interaction \
    --optimize-autoloader \
    --classmap-authoritative \
    --no-scripts

# Optimize Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan event:cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8081/api/health || exit 1

# Start Octane in production
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8081", "--workers=4", "--task-workers=6"]
