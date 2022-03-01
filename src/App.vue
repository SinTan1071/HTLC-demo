<template>
  <div id="app">
    chain:
    <el-select v-model="chain"
               style="width: 100%"
               clearable
               :value-key="'label'"
               @change="changeChain">
      <el-option
          v-for="(chain, key) in chains"
          :key="key"
          :label="chain.label+': '+chain.url"
          :value="chain"
      />
    </el-select>
    &nbsp;
    <router-view :htlcAddr="htlcAddr"
                 :web3="web3"
                 :accounts="accounts"
                 :resetRes="resetRes"
                 :resSuccess="resSuccess"
                 :resError="resError"/>
    &nbsp;
    <el-card v-if="resShow" :class="resClass">
      <div slot="header" class="clearfix">
        <span>{{ resTitle }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="resetRes">close</el-button>
      </div>
      <div v-if="resType === 'sendType'" class="text item">
        <p>txHash: {{ res.transactionHash }}</p>
        <p>blockHash: {{ res.blockHash }}</p>
        <p>events: <br/>
          <span v-for="(event, eventName) in res.events"
                :key="eventName">
            {{ eventName }}:
            <li v-for="(paramValue, paramName) in event.returnValues"
                v-if="isNaN(paramName)"
                :key="paramName">
              {{ paramName }}: {{ paramValue }}
            </li>
          </span>
        </p>
      </div>
      <div v-else class="text item">
        <pre>{{ res }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script>
export default  {
  name:  'App',
  data() {
    return {
      chains: [],
      chain: null,
      htlcAddr: null,
      web3: null,
      accounts: [],

      resShow: false,
      resClass: null,
      resTitle: null,
      resType: null,
      res: null,
    }
  },
  created() {
    this.chains = this.web3s
  },
  methods: {
    changeChain(selection) {
      this.web3 = selection.web3
      this.htlcAddr = selection.htlcAddr
      this.getAccounts()
    },
    getAccounts() {
      this.accounts = []
      this.web3.eth.getAccounts().then(res => {
        this.accounts = res || []
      })
    },
    resSuccess(res, resType) {
      this.resShow = true
      this.resClass = 'success-bg'
      this.resTitle = 'success'
      this.resType = resType
      this.res = res
    },
    resError(e) {
      this.resShow = true
      this.resClass = 'danger-bg'
      this.resTitle = 'error'
      this.resType = null
      this.res = e
    },
    resetRes() {
      this.resShow = false
      this.resClass = null
      this.resTitle = null
      this.resType = null
      this.res = null
    }
  },
}
</script>
<style scoped>
.danger-bg {
  background-color: #ffeded !important;
}

.success-bg {
  background-color: #f0f9eb !important;
}
</style>
