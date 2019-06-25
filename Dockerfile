FROM bdhwan/ionic-maria-pm2:1.3
LABEL maintainer=”bdhwan@gmail.com”

USER root

# WORKDIR /home
ADD . /home/appflow
WORKDIR /home/appflow

RUN rm -rf admin
RUN git clone https://github.com/bdhwan/appflow-admin-deploy.git
RUN mv appflow-admin-deploy admin

RUN rm -rf config/config.js
RUN npm install

WORKDIR /home/appflow

HEALTHCHECK --interval=30s CMD node healthcheck.js
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "check.sh"]

