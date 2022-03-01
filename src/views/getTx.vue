<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>==getTx==</span>
      </div>
      <div class="text item">
        caller:
        <el-select v-model="caller"
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

        <el-button @click="getTransaction">getTransaction</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//txId: 0xe140891f802e25eeb05897f1a8eb71c9bf56fc3cfa82a0dc978208c9aacfb7c0
import {callContract} from '@/utils/index'

export default {
  name: 'HTLC-GetTx',
  components: {},
  props:{
    htlcAddr: {
      type: String,
      default: ''
    },
    web3: {
      type: Object,
      default: () => {}
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
      this.caller = null
    },
  },
  created() {
    this.resetRes()
  },
  data() {
    return {
      caller: null,
      txId: null,
    }
  },
  methods: {
    getTransaction() {
      this.resetRes()
      if (!this.web3) {
        this.msgInfo('no chain selected')
        return
      }
      if (!this.caller || !this.txId) {
        this.msgInfo('not enough params')
        return
      }
      const op = {
        web3: this.web3,
        from: this.caller,
      }
      callContract(op, this.htlcAddr, this.htlc, "getTransaction",
          this.txId,
      ).then(res => {
        this.resSuccess(res)
      }).catch(e => {
        this.resError(e)
      })
    },
  },

}
</script>

<style scoped>
</style>
