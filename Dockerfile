###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine

ARG PORT

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@0.31.0 && \
  corepack enable && \
  corepack prepare pnpm@9.15.4 --activate
RUN apk --no-cache --virtual build-dependencies add protobuf

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running yarn install on every code change.
COPY --chown=node:node package.json pnpm-lock.yaml ./
# Install app dependencies using the clean install option.
RUN pnpm install --frozen-lockfile 

# Bundle app source
COPY --chown=node:node . .

RUN pnpm build

EXPOSE ${PORT}

ENV NODE_ENV=production
ENV PONDER_TELEMETRY_DISABLED=true

CMD [ "pnpm", "start", "--indexer", "adventures" ]