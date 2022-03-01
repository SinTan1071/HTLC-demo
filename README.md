# A HTLC Demo

> @author: https://github.com/SinTan1071
>
> This is a hashed time lock demo with simple web client and solidity contract for EVM based blockchain

## Getting started

#### Prepare Environment

* Ganache

First of all you need to install [Ganache](https://trufflesuite.com/ganache/), by

```shell
npm install -g ganache-cli
```

* Truffle

Then you have to install [Truffle](https://trufflesuite.com/docs/truffle/), by

```shell
npm install -g truffle
```

#### Install

Open the root directory of the project and run commad

```shell
npm install
```

#### Run Blockchain

You can open a terminal window and go to the root directory of the project and run commad

```shell
npm run ganache-chainA
```

Then open another terminal window and go to the root directory of the project and run commad

```shell
npm run ganache-chainB
```

#### Unit Test

After running a test blockchain, you can open the root directory of the project and run commad

```shell
npm run test
```

## Tutorial

#### Run The Dapp

The web client is writen by VUE,  It provides an easy way to swap tokens between two different EVM based blockchain by using the HTLC, after running two test blockchain (A and B), then you have to deploy HTLC on those two blockchain, you can go to the root directory of the project and update the file `truffle-config.js` , you have to post your two blockchains' info on this file like this

```js
module.exports = {
    networks: {
        /// chainA
        development: {
            host: "localhost",
            port: 1723,
            network_id: "74"
        },

        /// chainB
        // development: {
        //     host: "localhost",
        //     port: 8545,
        //     network_id: "1337"
        // }
    }
}
```

then you can run command to deploy HTLC on chainA

```shell
truffle deploy
```

and record the HTLC contract address(A)

```
...

2_deploy_contracts.js
=====================

   Replacing 'HashedTimeLock'
   --------------------------
   > transaction hash:    0x3a8df85d9c6d8126abe60cd2dfcbb667830e8abfb82dff39a5f8cb9e57a510b9
   > Blocks: 0            Seconds: 0
   > contract address:    0x098F96758eD2d3dFCB25B887012Ac0a16aD9c7ee  <-- //YOU HAVE TO RECORD THIS
   > block number:        3
   > block timestamp:     1646118900
   > account:             0xf20a133f2392AA95C8c2751aa394813F3fc84081
   > balance:             99.97486862
   > gas used:            988969 (0xf1729)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01977938 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.01977938 ETH

...

```

then you have to update the `truffle-config.js` file again, like this

```js
module.exports = {
    networks: {
        /// chainA
        // development: {
        //     host: "localhost",
        //     port: 1723,
        //     network_id: "74"
        // },

        /// chainB
        development: {
            host: "localhost",
            port: 8545,
            network_id: "1337"
        }
    }
}
```

and run `truffle deploy` again, record the HTLC contract address(B)

after all those steps above, you have to update the file `.env.development`

```
NODE_ENV='development'

VUE_APP_WEB3A_URL='http://127.0.0.1:1723' # this is chainA's web3 url
VUE_APP_WEB3B_URL='http://127.0.0.1:8545' # chainB
VUE_APP_HTLC_ADDRA='0x11b46DdBA36bd432ED68b92a1A3c76c1F887b2E6' # this is chainA's HTLC contract address
VUE_APP_HTLC_ADDRB='0xB5Befbc3cdbf952a62d5f5fF1102D8f9e0d64553' # chainB

```

then run command at the root directory of the project

```shell
npm run dev
```

If every thing works ok, you may see a notice like this:

> DONE  Compiled successfully in 5084ms
>                                                                                              
>  App running at:
>
>  - Local:   http://localhost:1025/ 
>  - Network: http://172.16.30.21:1025/

Then you can open the link in your browser, there are 4 routes that correspond to different functions:

> * /newTx
> * /getTx
> * /withdraw
> * /refund

## Usage

Alice have `addressA1` on chainA, `addressA2` on chainB, Bob have `addressB1` on chainA, `addressB2` on chainB, each of their addresses have enough ether to process the transaction next

#### /newTx

1. Alice open '/newTx' route and select `chainA`  as *chain*
2. Alice select her address `addressA1` as *sender*
3. Alice select Bob's address `addressB1` as *receiver*
4. Alice click `genHashAndSecret` button to generate *hashlock* `hashlockAB` and *hashSecret* `hashsecretABXX`
5. Alice MUST record and remember `hashlockAB` and `hashsecretABXX`
6. Alice select a future time `T1` as *timelock*
7. Alice input the amount `valueA` of ether on chainA
8. Alice click the button `newTransaction` and gets a receipt
9. Alice record the *txId* `txIdA` from the receipt
10. Alice give Bob *hashlock* `hashlockAB` and *timelock* `T1` and *txId* `txIdA`
11. Bob open '/newTx' route and select `chainB`  as *chain*
12. Bob select his address `addressB2` as *sender*
13. Bob select Alice's address `addressA2` as *receiver*
14. Bob input `hashlockAB` as *hashlock*
15. Bob select a future time `T2` which is less than `T1` as *timelock*
16. Bob input the amount `valueB` of ether on chainB
17. Bob click the button `newTransaction` and gets a receipt
18. Bob record the *txId* `txIdB` from the receipt
19. Bob give Alice *timelock* `T2` and *txId* `txIdB`

#### /withdraw

20. Alice open '/withdraw' route and select `chainB`  as *chain*
21. Alice select her address `addressA2` as *sender*
22. Alice input *txId* `txIdB`
23. Alice input *hashSecret* `hashsecretABXX` 
24. Alice click the button `withdraw` and get amount `valueB` of ether on chainB before time `T2`

#### /getTx

25. Bob notice that Alice has withdrawn the `valueB` ether on chainB though HTLC contract's event
26. Bob open '/getTx' route and select `chainA`  as *chain*
27. Bob select his address `addressB1` as *caller*
28. Bob input *txId* `txIdA`
29. Bob click the button `getTransaction` and get key `hashsecretABXX` as *hashSecret*
30. Bob can open '/withdraw' route and select `chainA`  as *chain*
31. Bob can select his address `addressB1` as *sender*
32. Bob can input *txId* `txIdA`
33. Bob can input *hashSecret* `hashsecretABXX` 
34. Alice can click the button `withdraw` and get amount `valueA` of ether on chainA before time `T1`

#### /refund

35. If after time `T1` and the `valueA` of ether on chainA still not withdrawn, Alice can open '/refund' route and select `chainA`  as *chain*
36. Alice can select her address `addressA1` as *sender*
37. Alice can input *txId* `txIdA`
38. Alice can click the button `refund` and get amount `valueA` of ether on chainA after time `T1`
39. If after time `T2` and the `valueB` of ether on chainA still not withdrawn, So does Bob can refund too

##### 
