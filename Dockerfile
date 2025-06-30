FROM nginx:1.13.8

COPY ./docker/configs/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/configs/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist/bota-front /usr/share/nginx/html

RUN  sed -i "s|rel=stylesheet|rel=stylesheet type=text/css |g" /usr/share/nginx/html/index.html
# Application and Environment Startup Script
# COPY ./nginx/env_setup.sh /root
# RUN chmod +x /root/env_setup.sh

# Configure environment and start nginx
# CMD ["/root/env_setup.sh"]
