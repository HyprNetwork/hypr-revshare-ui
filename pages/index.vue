<template>
  <div class="main_content_container">
    <div class="header">
      <div><img src="~assets/images/hypr_full_white.svg" alt="Hypr" height="40" /></div>
      <div class="subtitle">$HYPR Revenue Share</div>
      <div class="etherscan_link"><a href="https://etherscan.io/address/0xA422342342342342n23422342356456n59" target="_blank">https://etherscan.io/address/0xA422342342342342n23422342356456n59</a></div>
    </div>
    <div class="main_content">
      <div class="inner_content">
        <div v-if="!loading">
          <div v-if="!hasMetamask" class="no_metamask">
            You need Metamask to use this app
          </div>
          
          <div v-else>
            <div class="status_label">Your address</div>
            <div class="black_box">{{ address }}</div>
            <div class="status_label">Your ETH balance</div>
            <div class="black_box">{{ Number(balance).toFixed(2) }} ETH</div>
          </div>
          
          <div v-if="!address && !loading">
            <button @click="connect" type="button" v-if="hasMetamask">
              Connect Metamask
            </button>
          </div>
          <div v-else>
            <div class="claim_container">
              <div class="reward_title">Claimable Balance</div>
              <div class="reward_balance">0.1032 ETH</div>
              <div class="reward_button_container">
                <button @click="getBalance" type="button" class="claim_button">
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div><a href="https://www.hypr.network" target="_blank"><img src="~assets/images/hypr_full_white.svg" alt="Hypr" height="20" /></a></div>
      <div>
        <a href="https://www.hypr.network" target="_blank">Learn about the $HYPR revenue share program</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

if (process.client && window.ethereum) {
  window.ethereum.on('connect', () => {
    console.log("Metamask connected")
  })
}

export default {
  data() {
    return {
      loading: true,
      hasMetamask: false,
      address: null,
      provider: null,
      balance: 0
    }
  },
  methods: {
    async isConnected() {
      const accounts = await ethereum.request({method: 'eth_accounts'})
      if (accounts.length) {
        this.address = accounts[0]
        this.getBalance()
      }
    },
    async connect() {
      await this.provider.send("eth_requestAccounts", []);
    },
    async getBalance() {
      const balance = await ethereum.request({method: 'eth_getBalance', params: [this.address, "latest"]})
      this.balance = ethers.utils.formatEther(balance)
    },
    async contract() {
      // const infura_provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/{this.$config.API_BASE_URL}`)
      // const balance = await infura_provider.getBalance(this.address)
    },
    didConnect() {
      this.isConnected()
    }
  },
  mounted() {
    if (process.client && window.ethereum) {
      this.hasMetamask = true
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.isConnected()

      window.ethereum.on("accountsChanged", (accounts) => {
        this.didConnect()
      })
    }

    this.loading = false
  }
}
</script>

<style lang="scss" scoped>

$primary-color: #be3144;
$secondary-color: #d25062;
$link-color: #979797;

.main_content_container {
  width: 100%;
  max-width: 700px;
}

.no_metamask {
  text-align: center;
  font-size: 20px;
}

.header {
  margin-top: 20px;

  .etherscan_link {
    font-size: 12px;
    margin-top: 5px;
    a, a:hover {
      color: $link-color;
    }
  }
}

.subtitle {
  font-size: 16px;
  margin-top: 10px;
}
.main_content {
  width: 100%;
  min-width: 300px;
  height: 500px;
  background-color: $primary-color;
  border-radius: 12px;
  margin-top: 20px;
}

.inner_content {
  padding: 20px;
}

.black_box {
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-family: 'Courier New', Courier, monospace;
}

.status_label {
  font-weight: 500;
  margin-bottom: 10px;
}

.claim_button {
  background-color: $secondary-color;
  color: white;
  font-size: 18px;
  font-weight: 500;
  padding: 15px;
  width: 100%;
  box-shadow: none;
  border-radius: 10px;
  border: none;
}

.claim_container {
  border-top: 1px solid $secondary-color;
  margin-top: 50px;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .reward_title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .reward_balance {
    font-size: 30px;
    background-color: black;
    padding: 10px;
    border-radius: 10px;
    font-family: 'Courier New', Courier, monospace;
  }

  .reward_button_container {
    margin-top: 30px;
    width: 50%;
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  }
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  div {
    margin-bottom: 10px;
  }
  a, a:hover {
    color: $link-color;
    text-decoration: none;
  }
}
</style>