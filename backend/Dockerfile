FROM python:3.7-slim

# Set working directory
WORKDIR /app

# Install curl and other utilities
RUN apt-get update && apt-get install -y curl

# Install dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend code
COPY backend /app

# Expose the port
EXPOSE 8000

# Run the Django development server (for dev only)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]