![NFT Tabletop Dice](https://hackerlink.s3.amazonaws.com/static/files/PolyDice_Header_960x480.png)

# PolyDice

[dice.partavate.com](https://dice.partavate.com)

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

## Production Deployment

Build the Docker image

```
docker login registry.gitlab.com
docker build -t registry.gitlab.com/partavate/nft-dice-roller/client:0.2 .
docker push registry.gitlab.com/partavate/nft-dice-roller/client:0.2
```

### Update the Kubernetes Deployment

1. Update the image tag in `deployment/polydice-deployment.yaml`
2. Publish the updated deployment:
 
```
kubectl -f deployment/polydice-deployment.yaml
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

Traefik should configure a new router to [https://dice.partavate.com](https://dice.partavate.com).

Verify by checking [https://traefik.partavate.com/dashboard/#/http/routers](https://traefik.partavate.com/dashboard/#/http/routers)