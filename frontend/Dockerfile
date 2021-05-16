#Stage-1 the build process
FROM node:15 as build-deps
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN yarn 
COPY . ./
RUN yarn build

#Stage-2 the production env
FROM nginx:1.16-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
