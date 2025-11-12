FROM python:3.11-slim

WORKDIR /app

# Copy pyproject.toml and install dependencies
COPY pyproject.toml ./
COPY README.md ./

# Install build dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Copy the rest of the application
COPY . .
COPY .env .

# Expose the port Flask will run on
EXPOSE 8000

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]