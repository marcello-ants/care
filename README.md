# Enrollment Micro Front-End [![Build Status](https://jenkins.stg.omni.carezen.net/buildStatus/icon?job=SC%2Fenrollment-mfe%2Fmaster)](https://jenkins.stg.omni.carezen.net/job/SC/job/enrollment-mfe/job/master/)

## Table of Contents

* [To Contribute to this Repository](#to-contribute-to-this-repository)
* [Deployment](#Deployment)
* [Installation](#Installation)
* [Development](#Development)
* [Generate Static GraphQL TypeScript Types](#GraphQl)

## To Contribute to this Repository <a name="to-contribute-to-this-repository"></a>
### Commit format <a name="commit-format"></a>
The commit format must follow the below naming convention
```angular2html
feat/fix/chore(JIRA-number): short description
```
Some examples
```
feat(SC-1309): add HDYHAU field for SALC account form
feat(SC-1002): show up to 5 caregivers for L&C
```
<br>

### Commit description <a name="commit-description"></a>
Contributors need to demonstrate local testing of any given feature. There needs to be instructions around local testing of any given feature, so that reviewers can take the new code for a spin.


### PR Hygiene <a name="pr-hygiene"></a>
The community reserves the right to decline any PR that is 3 days or older. This is to preserve resources, shorten build time, make it easier on the eyes of the approver. Declining a PR is
rather inconsequential, because one can always reopen the PR when they are ready to do so.

## Deployment <a name="Deployment"></a>
We encourage every contributor to deploy their commits right after a merge. However, if they fail to do so, this app gets deployed at least once a day (while we are on our journey to a 1 commit / 1 deploy model). 
Be prepared for the daily deployments to happen any time, we will generally shoot for releasing to PROD no later than noon EST. The app gets deployed by the GROWTH team's rotation on Mon / Wed / Fri of each week, 
and by the Sr Care rotation Tues / Thurs of each week. Go to the [support-enrollment-mfe](https://caredotcom.slack.com/archives/C01AETRHZGR) channel to see who is on rotation on a given week.

### Deployment procedures <a name="deployment-procedures"></a>
Use the [SignalFX k8s Metrics dashboards](https://care.signalfx.com/#/dashboard/EZ3T5qmAgAA?groupId=EZ3L6vUAgAA&configId=EZ3T5vJAYAE&startTime=-1h&endTime=Now&density=4&variables%5B%5D=namespace%3Dkubernetes_namespace:&variables%5B%5D=k8s%20cluster%3Dkubernetes_cluster:%5B%22omni-prod-useast1%22%5D&variables%5B%5D=service%3Dcontainer_spec_name:%5B%22enrollment-mfe%22%5D) 
to see which version of the application is deployed in an environment.  All merges to the "master" branch should automatically result in a release deployment to dev/stg.
1) Locate the tag of the version you'd like to deploy
2) Log into Harness (should be listed in your [apps](https://myapplications.microsoft.com/))
3) From the sidebar, select "Deployments".
4) Click the blue "Start New Deployment" button (located in the top right).
5) In the "Start New Deployment" modal:
   1) Ensure "Deploy by executing a Pipeline" is selected (this should be defaulted)
   2) Set Application to "k8s-services".
   3) Set Pipeline to your desired environments (note that if deploying to prod, it must also deploy to stg or dev & stg)
   4) Under "Workflow Variables":
      * Set **Service** to "enrollment-mfe"
      * Depending on which environments were selected for the **Pipeline**, there'll be an **Infrastructure_<env>** field, be sure to select the option that ends with "-useast1".
      * Set **GIT_REF** to either a git tag (ex: "v0.467.1") or a git ref from the repo (unless you are needing to test a CDK or harness config change, just set this to the latest release/commit in `master`).
      * Post to [support-enrollment-mfe](https://caredotcom.slack.com/archives/C01AETRHZGR) (especially helpful for production deployments, so a peer can quickly click on the deployment URL and approve the deployment).
      * Set any remaining **Infrastructure_<env>** fields to the options that end with "-useast1".
   5) Under "Artifacts":
      * Set the desired **Build / Version** (this is where you'd either select a release version or a PR build you'd like to deploy).
   6) If doing a production deployment, be sure to drop a message in [support-enrollment-mfe](https://caredotcom.slack.com/archives/C01AETRHZGR) notifying folks that you're about to deploy "enrollment-mfe@X.Y.Z"
   7) Back in the "Start New Deployment" modal, click the **Submit** button.
6) Use [SignalFX k8s Metrics dashboards](https://care.signalfx.com/#/dashboard/EZ3T5qmAgAA?groupId=EZ3L6vUAgAA&configId=EZ3T5vJAYAE&startTime=-1h&endTime=Now&density=4&variables%5B%5D=namespace%3Dkubernetes_namespace:&variables%5B%5D=k8s%20cluster%3Dkubernetes_cluster:%5B%22omni-prod-useast1%22%5D&variables%5B%5D=service%3Dcontainer_spec_name:%5B%22enrollment-mfe%22%5D) and the deployment status in Harness to monitor the deployment
   * Also keep an eye on the [SignalFx Operational Metrics dashboard](https://care.signalfx.com/#/dashboard/EUZnIqUAcAA?variables%5B%5D=Environment%3Dsf_environment:%5B%22prod%22%5D&variables%5B%5D=Service%3Dsf_service:%5B%22enrollment-mfe%22%5D&groupId=EUZnBBRAgAA&configId=EUZnTI2AYAE&startTime=-1h&endTime=Now), Sentry, etc...
7) For Production deployments, there's an approval step that requires a peer to log into Harness and click an Approve button.




## Installation <a name="Installation"></a>

### Prerequisites <a name="Prerequisites"></a>

- Node LTS (>= 14.16.0)
- [Yarn](https://yarnpkg.com/)
  ```bash
  npm install -g yarn
  ```

### Install dependencies

```bash
yarn install
```

## Development <a name="Development"></a>

First, make sure the Docker is running. (Also be on VPN so the Docker images can be fetched from the Docker registry.)
Then run the development server:

```bash
yarn dev:carelocal
```

Open [https://www.local.carezen.net/app/enrollment](https://www.local.carezen.net/app/enrollment) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the
file.

### Secrets

Application secrets (e.g., API keys, passwords, etc...) are loaded at runtime via a readonly volume
mount loaded by Kubernetes at `/etc/secrets`. To add a new secret, work with the Ops team as
described in
[the Secrets section of the Kubernetes Architecture docs](https://carecom.atlassian.net/wiki/spaces/prodops/pages/6908655521/Kubernetes+Architecture#KubernetesArchitecture-Secrets).

When running locally, the secrets path is overridden to load secrets from `./src/secrets` rather
than `/etc/secrets`. This local path should always be kept up to date the dev-specific version of
each secret.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## Generate Static GraphQL TypeScript Types <a name="GraphQl"></a>

The application uses static TypeScript types to ensure its GraphQL queries and mutations are using the correct GraphQL schema.
Follow the steps below to regenerate these static types to reflect changes made in the GraphQL schema. 

Install the Apollo CLI globally if you haven't already: 

```npm
npm install -g apollo
```

Follow the instructions in [this pinned message in #support-graphql](https://caredotcom.slack.com/archives/C012VD017M3/p1629987927000800) to join our Apollo organization as a **Consumer** and create an associated personal API key. 

Add your personal API key as an env var named `APOLLO_KEY` in your local shell, e.g. `~/.bashrc`, `~/.zshrc`, etc..., and restart your terminal.  The Apollo CLI will use this key automatically on all subsequent commands.

### Generate Types From the `prod` Schema

Run the following command to generate the TypeScript types using the `prod` GraphQL schema:

```yarn
yarn typesTypeGen
```

The command above will run `apollo client:codegen` to scan the queries and mutations used within the app and generate static types based on the parts of the schema we're using.

NOTE: Custom scalars must be manually defined in [`globalScalars.d.ts`](https://github.com/care-dot-com/core-enrollment-mfe/blob/main/globalScalars.d.ts).

### Generate Types From the `stg` or `dev` Schema

You may occasionally need to generate types based on a GraphQL schema that hasn't yet been published to `prod`.
When doing this, be sure that the corresponding `api-care-graphql` changes have been published to `prod` BEFORE the application changes are released to `prod`.
Otherwise, the application's GraphQL requests may fail in `prod` because they depend on schema changes that haven't yet been published to that env.

To generate types based on the `stg` or `dev` schema, change the `--variant=prod` option in `package.json` to either `--variant=stg` or `--variant=dev` and then run `yarn typesTypeGen`. 

### Generate Types From a `local` Schema

In even rarer cases, you may need to generate types based on a GraphQL schema that hasn't yet been published to `stg` or `dev`, e.g. a schema that only exists in a branch or PR.

Follow the instructions in the [`api-care-graphql`](https://github.com/care-dot-com/platform-api-care-graphql) repo to get that project running locally.

Check out the branch with the GraphQL schema changes you want to use and after you've verified you can see those changes in the GraphQL Playground at [`localhost:8081/graphql`](http://localhost:8081/graphql), modify the `typesTypeGen` command in `package.json` to use an `--endpoint` option rather than `--variant` to pull the schema from a custom endpoint.  

For example: 

```json
"typesTypeGen": "apollo client:codegen --graph=caredotcom-federated --endpoint=http://localhost:8081/graphql ..."
```

Run the `yarn typesTypeGen` command and it will generate types using your local GraphQL schema.
