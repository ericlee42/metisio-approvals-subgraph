ERC20/ERC721 Token Approvals


## Start graph-node

```
docker-compose up -d
```

ipfs webui: http://127.0.0.1:5001
graph index node playground: http://127.0.0.1:8030/graphql/playground

## Build subgraph

```
yarn build
```

## Create subgraph

```
yarn create-local
```

## Deploy subgraph

```
yarn deploy-local
```

## Subgraph graphql playground

http://localhost:8000/subgraphs/name/metisio/approvals/graphql

```graphql
query {
  tokens(subgraphError: deny, first: 100) {
    id
    symbol
    type
  }
}
```

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x034d0732c70c1b5e8dd8e2b8b9221a1744681280",
        "symbol": "GLP:WMETIS-GIVE",
        "type": "ERC20"
      },
      {
        "id": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
        "symbol": "WMETIS",
        "type": "ERC20"
      },
      {
        "id": "0x8667566d080abce4934d9c6c5c1fd720aceb3f60",
        "symbol": "MetaCraftItem",
        "type": "ERC721"
      },
      {
        "id": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "symbol": "Metis",
        "type": "ERC20"
      },
      {
        "id": "0xfe3f3a1f5b91eeb9c85255a71f3d1a99f01ec3ec",
        "symbol": "GIVE",
        "type": "ERC20"
      }
    ]
  }
}
```

## Get subgraph status

Open graph index node playground and input flowing graphl request

```graphql
{
  indexingStatusForCurrentVersion(subgraphName: "metisio/approvals") {
    synced
    health
    fatalError {
      message
      block {
        number
        hash
      }
      handler
    }
    chains {
      chainHeadBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}
```

```json
{
  "data": {
    "indexingStatusForCurrentVersion": {
      "chains": [
        {
          "chainHeadBlock": {
            "number": "1924116"
          },
          "latestBlock": {
            "number": "10146"
          }
        }
      ],
      "fatalError": null,
      "health": "healthy",
      "synced": false
    }
  }
}
```