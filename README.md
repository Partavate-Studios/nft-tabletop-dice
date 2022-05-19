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

## Production Deployment

This deploys changes to the **client only**. Contract changes must be deployed to their chains using Hardhat.

Build the Docker image, from inside `./client`

```
cd client
docker login registry.gitlab.com
docker build -t registry.gitlab.com/partavate/nft-dice-roller/client:0.2 .
docker push registry.gitlab.com/partavate/nft-dice-roller/client:0.2
```

### Update the Kubernetes Deployment

Load the KUBECONFIG env, pointing the LKE cluster.

```
export KUBECONFIG=$HOME/.kube/linode
```

1. Update the image tag in `deployment/polydice-deployment.yaml`
2. Publish the updated deployment:

```
kubectl apply -f deployment/polydice-deployment.yaml
```

If the value of `image:` did not change in `/polydice-deployment.yaml`, you'll need to redeploy simply by restarting the container:

```
kubectl rollout restart  deployment/polydice-client -n partavate-websites
```


## Initial Kubernetes Setup:

Assumes the Linode LKE Cluster defined in the `Infrastructure` repo is up.

Load the KUBECONFIG env, pointing the LKE cluster.

```
export KUBECONFIG=$HOME/.kube/linode
```

Deploy all the things!

```
kubectl apply -f deployment/polydice-service.yaml
kubectl apply -f deployment/polydice-deployment.yaml
kubectl apply -f deployment/polydice-ingressroute.yaml
```

Traefik should configure a new router to [https://polydice.app](https://polydice.app).

Verify by checking [https://traefik.partavate.com/dashboard/#/http/routers](https://traefik.partavate.com/dashboard/#/http/routers)
