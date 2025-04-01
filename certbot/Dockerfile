FROM ubuntu

WORKDIR /certbot
COPY ./generate-certificate.sh /certbot

RUN apt-get update
RUN apt-get -y install certbot

EXPOSE 80
CMD ["sh", "generate-certificate.sh"]
