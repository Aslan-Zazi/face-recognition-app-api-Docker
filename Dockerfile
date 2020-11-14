FROM node:lts-buster

WORKDIR /user/src/face-recognition-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]