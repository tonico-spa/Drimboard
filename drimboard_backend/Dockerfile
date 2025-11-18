# ---- Builder Stage ----
FROM python:3.12.10 AS builder

WORKDIR /app

# Update pip
RUN python -m pip install --upgrade pip

# Copy everything needed for installation
COPY . .

# Install project dependencies (make sure gunicorn is in pyproject.toml)
RUN pip install --no-cache-dir -e .

# ---- Final Stage ----
FROM python:3.12.10-slim

# Set a non-root user for security
RUN useradd --create-home appuser

WORKDIR /home/appuser/code

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/local /usr/local

# Copy the entire project content
COPY --chown=appuser:appuser . /home/appuser/code/

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 8000

# Use Gunicorn for Flask (WSGI) apps
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app.app:app"]