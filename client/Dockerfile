# Build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# CRA aborts the production build on ESLint issues — including a broken
# eslint-config-react-app/jest config ("Environment key 'jest/globals' is
# unknown"). Linting shouldn't gate a deploy build, so skip it here.
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false

RUN npm run build

# Serve with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
