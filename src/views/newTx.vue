<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>==newTx==</span>
      </div>
      <div class="text item">
        sender:
        <el-select v-model="sender"
                   style="width: 100%"
                   clearable>
          <el-option
              v-for="(address, key) in accounts"
              :key="key"
              :label="address"
              :value="address"
          />
        </el-select>
        receiver:
        <el-select v-model="receiver"
                   style="width: 100%"
                   clearable>
          <el-option
              v-for="(address, key) in accounts"
              :key="key"
              :label="address"
              :value="address"
          />
        </el-select>
        hashlock:
        <el-input v-model="hashlock"/>
        timelock:
        <el-date-picker v-model="time"
                        style="width: 100%"
                        type="datetime"
                        size="large"/>
        value(ether):
        <el-input v-model="value" type="number"/>

        <el-button @click="newTransaction">newTransaction</el-button>
      </div>
    </el-card>
    <div>
      <li>hash: {{ hash }}</li>
      <li style="color: red">hashSecret(please remember this!! And DO NOT tell anyone!!): {{ hashSecret }}</li>
      <el-button @click="genHashAndSecret">genHashAndSecret</el-button>
    </div>
  </div>
</template>

<script>
import {newSecretHashPair, sendContract} from '@/utils/index'

export default {
  name: 'HTLC-NewTx',
  components: {},
  props: {
    htlcAddr: {
      type: String,
      default: ''
    },
    web3: {
      type: Object,
      default: () => {
      }
    },
    accounts: {
      type: Array,
      default: () => []
    },
    resetRes: {
      type: Function,
      default: function () {
      },
    },
    resSuccess: {
      type: Function,
      default: function () {
      },
    },
    resError: {
      type: Function,
      default: function () {
      },
    },
  },
  watch: {
    htlcAddr(val) {
      this.sender = null
      this.receiver = null
      this.value = null
    },
  },
  created() {
    this.resetRes()
  },
  data() {
    return {
      hash: null,
      hashSecret: null,
      sender: null,
      receiver: null,
      hashlock: null,
      time: null,
      timelock: null,
      value: null,
    }
  },
  methods: {
    genHashAndSecret() {
      let hashPair = newSecretHashPair()
      this.hash = hashPair.hash
      this.hashSecret = hashPair.secret
      this.hashlock = this.hash
    },
    newTransaction() {
      this.resetRes()
      if (!this.web3) {
        this.msgInfo('no chain selected')
        return
      }
      if (!this.receiver || !this.hashlock || !this.time || !this.value) {
        this.msgInfo('not enough params')
        return
      }
      if (this.receiver === this.sender) {
        this.msgInfo('receiver and sender can not be same')
        return
      }
      this.timelock = Math.floor(Date.parse(this.time) / 1000)
      const op = {
        web3: this.web3,
        from: this.sender,
        value: this.value * this.oneEther
      }
      sendContract(op, this.htlcAddr, this.htlc, "newTransaction",
          this.receiver,
          this.hashlock,
          this.timelock,
      ).then(receipt => {
        this.resSuccess(receipt, 'sendType')
      }).catch(e => {
        console.error(e)
        this.resError(e)
      })
    },
  },

}
</script>

<style scoped>
</style>
