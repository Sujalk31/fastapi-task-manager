# 1. Base Python image
FROM python:3.12-slim
 
# 2. Don't create .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
 
# 3. Print Python logs immediately
ENV PYTHONUNBUFFERED=1
 
# 4. Working directory inside container
WORKDIR /app
 
# 5. Copy requirements first
COPY requirements.txt .
 
# 6. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
 
# 7. Copy application code
COPY . .
 
# 8. Application port
EXPOSE 8000
 
# 9. Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]