# server/Dockerfile
FROM python:3.10

# Set working directory
WORKDIR /app

# Install dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI code
COPY server/ .

# Expose port and run the server
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
