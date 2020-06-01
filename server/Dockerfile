FROM node:12-alpine

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY package.json ./
COPY yarn.lock ./
USER node

RUN yarn 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

# EXPOSE 4000

CMD [ "yarn", "dev" ]