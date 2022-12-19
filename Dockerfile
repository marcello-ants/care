# syntax=docker/dockerfile:1.2
FROM care-docker-bronze-local.artifactory.gold.mgmt.carezen.net/docker/base-node:14 AS builder

WORKDIR /usr/src/app
RUN chown jenkins:jenkins /usr/src/app && \
    mkdir -p /home/jenkins/.cache/yarn && \
    chown -R jenkins:jenkins /home/jenkins/.cache
USER jenkins

COPY --chown=jenkins:jenkins package.json yarn.lock ./

RUN --mount=type=cache,id=enrollment-mfe-yarn-cache,sharing=locked,target=/home/jenkins/.cache/yarn,uid=1427,gid=1427 \
    yarn install --frozen-lockfile

COPY --chown=jenkins:jenkins . .

# mount the sentry auth token as a file readable by the `jenkins` user and group (1427)
# https://github.com/care-dot-com/docker-base-node/blob/main/Dockerfile#L5-L6
RUN --mount=type=secret,id=sentryKey,uid=1427,gid=1427 yarn build

FROM care-docker-bronze-local.artifactory.gold.mgmt.carezen.net/docker/base-node:14 AS production

WORKDIR /usr/src/app
RUN chown jenkins:jenkins /usr/src/app
USER jenkins

COPY --from=builder --chown=jenkins:jenkins /usr/src/app/package.json /usr/src/app/yarn.lock /usr/src/app/
COPY --from=builder --chown=jenkins:jenkins /usr/src/app/.next /usr/src/app/.next
COPY --from=builder --chown=jenkins:jenkins /usr/src/app/dist /usr/src/app/dist
COPY --from=builder --chown=jenkins:jenkins /usr/src/app/node_modules /usr/src/app/node_modules

RUN --mount=type=cache,id=enrollment-mfe-yarn-cache,sharing=locked,target=/home/jenkins/.cache/yarn,uid=1427,gid=1427 \
    du -sk node_modules && \
    yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile && \
    du -sk node_modules

FROM care-docker-bronze-local.artifactory.gold.mgmt.carezen.net/docker/base-runtime-node:14

# Don't require write access to filesystem - more secure to copy as root
USER root

# Copy only files we need at runtime - don't need docker, harness, readme, .git, etc.
COPY --from=builder --chown=root:root /usr/src/app/*.js /usr/src/app/package.json /usr/src/app/yarn.lock /usr/src/app/
COPY --from=production --chown=root:root /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder --chown=root:root /usr/src/app/src /usr/src/app/src
COPY --from=builder --chown=root:root /usr/src/app/public /usr/src/app/public
COPY --from=builder --chown=root:root /usr/src/app/.next /usr/src/app/.next
COPY --from=builder --chown=root:root /usr/src/app/dist /usr/src/app/dist

USER node

CMD ["node", "dist/server/index.js"]
