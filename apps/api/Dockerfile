FROM python:3.11-slim


ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONUNBUFFERED=1


RUN apt-get update && apt-get install -y --no-install-recommends \
build-essential \
libpq-dev \
&& rm -rf /var/lib/apt/lists/*


WORKDIR /app
COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install -e .


COPY src ./src
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic


EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]