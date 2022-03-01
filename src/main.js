import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import Web3 from "web3";

import router from './router'
import App from './App.vue';

const web3 = new Web3()

Vue.prototype.web3s = [{
    label: 'chainA',
    url: process.env.VUE_APP_WEB3A_URL,
    web3: new Web3('http://'+window.location.host+'/web3A'),
    htlcAddr: process.env.VUE_APP_HTLC_ADDRA, // hashed time lock contract address on chainA
},{
    label: 'chainB',
    url: process.env.VUE_APP_WEB3B_URL,
    web3: new Web3('http://'+window.location.host+'/web3B'),
    htlcAddr: process.env.VUE_APP_HTLC_ADDRB, // hashed time lock contract address on chainB
}]
Vue.prototype.htlc = {
    abi:[
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "txId",
                    "type": "bytes32"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "hashlock",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timelock",
                    "type": "uint256"
                }
            ],
            "name": "LogNewTransaction",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "txId",
                    "type": "bytes32"
                }
            ],
            "name": "LogRefund",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "txId",
                    "type": "bytes32"
                }
            ],
            "name": "LogWithdraw",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_receiver",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "_hashlock",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "_timelock",
                    "type": "uint256"
                }
            ],
            "name": "newTransaction",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "txId",
                    "type": "bytes32"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_txId",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "_key",
                    "type": "bytes32"
                }
            ],
            "name": "withdraw",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_txId",
                    "type": "bytes32"
                }
            ],
            "name": "refund",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_txId",
                    "type": "bytes32"
                }
            ],
            "name": "getTransaction",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "hashlock",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "timelock",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "withdrawn",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "refunded",
                    "type": "bool"
                },
                {
                    "internalType": "bytes32",
                    "name": "key",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ],
}
Vue.prototype.oneEther = web3.utils.toWei(web3.utils.toBN(1), 'ether')
Vue.prototype.msgInfo = function (msg) {
    this.$message.info(msg);
}

locale.use(lang)
Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});