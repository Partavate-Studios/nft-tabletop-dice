![NFT Tabletop Dice](https://hackerlink.s3.amazonaws.com/static/files/PolyDice_Header_960x480.png)

# PolyDice

[dice.partavate.com](https://polydice.app)

## NFT Tabletop Dice
NFT Tabletop Dice are dice both a dice rolling dApp for tabletop gamers and collectable ERC721 NFTs. Dice you can roll and dice you can own.

## But why?
NFT Tabletop Dice were conceptualized as an Entry for EthDenver 2022.

## Technology Involved
- Solidity
- Hardhat
- VueJS
- EthersJS
- Polygon

Works best in metamask.

## Demo Video

[![Watch on YouTube](https://img.youtube.com/vi/SUipc_FUhSE/0.jpg)](https://www.youtube.com/watch?v=SUipc_FUhSE)


## Contract Deployment

Note that `hh` is an alias to `npx hardhat`. Use it for great good!

```
hh deploy --network mumbai
hh verify-published --network mumbai
```

This will update `evm/addresses/published-addresses.json`, allowing client builds (`docker build`) to reference the correct contract version.

## Web Client Build & Deploy

Deployments have three "stages", and all three can happen automatically on GitLab's CI, or manually via the CLI.
See `.gitlab-ci.yml` for the GitLab CI configuration.

This deploys changes to the **client only**. Contract changes must be deployed to their chains using Hardhat (See the above README section).

### Build

The PolyDice.app website (client) runs fully containerized, and is build from source using the `Dockerfile`.

This image is stored in our GitLab Docker registry, and loaded into the Kubernetes cluster.

The image build happens automatically in GitLab when triggered by a new or updated Merge Request, or a commit/merge to the default branch (`development`).

To manually build and upload to the registry:

```
# {some-tag} is usually a version number. `latest` should only be used for production releases.
docker login registry.gitlab.com
docker build -t registry.gitlab.com/partavate/nft-dice-roller/client:some-tag .
docker push registry.gitlab.com/partavate/nft-dice-roller/client:some-tag
```

## Staging Deployment

### Automated CI (One-Click)
GitLab will provide the ability to one-click trigger a staging deployment at https://gitlab.com/partavate/nft-dice-roller/-/pipelines, 
once as image has been successfully built due to a merge request action.

### Manually deployment
This updates the production Kubernetes service, and starts it up. Set the image tag to match the above:

```
TAGGED_IMAGE=registry.gitlab.com/partavate/nft-dice-roller/client:some-tag
kubectl set image --namespace websites deployment/polydice-client-staging polydice-client=${TAGGED_IMAGE}
kubectl rollout restart  deployment/polydice-client-staging -n websites
```

## Production Deployment

### Automated CI (One-Click)
GitLab will provide the ability to one-click trigger a production deployment at https://gitlab.com/partavate/nft-dice-roller/-/pipelines, 
once as image has been successfully built after commit or merge to the default branch (`development`).

### Manually deployment
This updates the production Kubernetes service, and starts it up. Set the image tag to match the above:

```
TAGGED_IMAGE=registry.gitlab.com/partavate/nft-dice-roller/client:some-tag
kubectl set image --namespace websites deployment/polydice-client polydice-client=${TAGGED_IMAGE}
kubectl rollout restart  deployment/polydice-client -n websites
```

## Initial Kubernetes Setup

Assumes the Linode LKE Cluster defined in the `Infrastructure` repo is up.

Load the KUBECONFIG env, pointing the LKE cluster.

```
export KUBECONFIG=$HOME/.kube/linode
```

Deploy all the things! (Staging, then production)

```
# Replace staging with production for prod deploy

kubectl apply -f deployment/staging/polydice-service.yaml
kubectl apply -f deployment/staging/polydice-deployment.yaml
kubectl apply -f deployment/staging/polydice-ingressroute.yaml
```

Traefik should configure a new router to [https://staging.polydice.app](https://staging.polydice.app) or [https://polydice.app](https://polydice.app).

Verify by checking [https://traefik.partavate.com/dashboard/#/http/routers](https://traefik.partavate.com/dashboard/#/http/routers)
