FROM ubuntu

WORKDIR /certbot

RUN apt-get update
RUN apt-get -y install certbot

#COPY ./generate-certificate.sh /certbot

EXPOSE 80
CMD ["sh", "generate-certificate.sh"]
