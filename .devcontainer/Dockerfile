FROM mcr.microsoft.com/devcontainers/python:1-3.11-bullseye

RUN touch ../av

RUN pip3 install --upgrade pip && pip3 install Django && pip3 install psycopg2-binary && pip3 install -U 'channels[daphne]'

RUN django-admin startproject backend

RUN touch ap

COPY .devcontainer/settings.py backend/backend/settings.py

ENV DJANGO_SUPERUSER_PASSWORD 1234
ENV DJANGO_SUPERUSER_USERNAME admin
ENV DJANGO_SUPERUSER_EMAIL admin@adminLOL.ch

ENV PYTHONUNBUFFERED 1

#RUN python3 backend/manage.py createsuperuser --noinput

# [Optional] If your requirements rarely change, uncomment this section to add them to the image.
# COPY requirements.txt /tmp/pip-tmp/
# RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
#    && rm -rf /tmp/pip-tmp

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
