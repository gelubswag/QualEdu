FROM python:3.12
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

COPY . .

RUN pip3 install --upgrade pip && pip3 install --no-cache-dir --upgrade -r requirements.txt

RUN apt update
