<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>==refund==</span>
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
        txId:
        <el-input v-model="txId"/>

        <el-button @click="refund">refund</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {newSecretHashPair, sendContract} from '@/utils/index'

export default {
  name: 'HTLC-Refund',
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
    },
  },
  created() {
    this.resetRes()
  },
  data() {
    return {
      sender: null,
      txId: null
    }
  },
  methods: {
    refund() {
      this.resetRes()
      if (!this.web3) {
        this.msgInfo('no chain selected')
        return
      }
      if (!this.sender || !this.txId) {
        this.msgInfo('not enough params')
        return
      }
      const op = {
        web3: this.web3,
        from: this.sender,
      }
      sendContract(op, this.htlcAddr, this.htlc, "refund",
          this.txId,
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
