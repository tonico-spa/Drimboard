# ---- Builder Stage ----
FROM python:3.12.10 AS builder

# Set the working directory inside the container
WORKDIR /app

# Update pip to the latest version
RUN python -m pip install --no-cache-dir --upgrade pip


COPY . .


RUN pip install --no-cache-dir -e .

# Explicitly install uvicorn[standard] and gunicorn if they are not
# already specified in your pyproject.toml's dependencies section.
# It's best practice to list all production dependencies in pyproject.toml.
# This line can be removed if they are already in pyproject.toml.
RUN pip install --no-cache-dir uvicorn[standard] gunicorn

# ---- Final Stage ----
FROM python:3.12.10-slim

# Set a non-root user for security
# adduser --system creates a user without a login shell, ideal for services
RUN adduser --system --group appuser

# Set the working directory for the application
WORKDIR /home/appuser/code

# Copy the installed Python packages (dependencies) from the builder stage.
# This copies everything installed by pip into the /usr/local environment.
COPY --from=builder /usr/local/ /usr/local/
# Copy your entire application code into the /home/appuser/code directory.
# Ensure appuser owns these files for proper permissions.
COPY --chown=appuser:appuser . /home/appuser/code/

# Switch to the non-root user
USER appuser

# Expose the port where your FastAPI app will listen
EXPOSE 8000

# Command to run the FastAPI application with Gunicorn managing Uvicorn workers.
# 'app:app' assumes your FastAPI app instance is named 'app' in 'app.py'
# located at the root of your WORKDIR (/home/appuser/code/app.py).
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "app.app:app"]