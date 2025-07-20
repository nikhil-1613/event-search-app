# backend/Dockerfile
FROM python:3.7-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
