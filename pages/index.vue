<template>
  <div class="main_content_container">
    <div class="header">
      <div><img src="~assets/images/hypr_full_white.svg" alt="Hypr" height="40" /></div>
      <div class="subtitle">$HYPR Revenue Share</div>
      <div class="etherscan_link"><a href="https://etherscan.io/address/0xA422342342342342n23422342356456n59" target="_blank">https://etherscan.io/address/0xA422342342342342n23422342356456n59</a></div>
    </div>
    <div class="main_content">
      <div class="inner_content" v-if="!loading">
        
        <div class="alert_container">
          <div v-if="!hasMetamask" class="alert"><img src="~assets/images/alert.svg" /> You need Metamask to use this app</div>
          <div v-else-if="wrongNetwork" class="alert"><img src="~assets/images/alert.svg" /> You need to use the {{ networkName }} network</div>
        </div>

        <div class="connect_button_container" v-if="hasMetamask && !wrongNetwork && !address">
          <button @click="connect" type="button" class="connect_button">
            <img src="~assets/images/metamask.svg" width="30" />Connect Metamask
          </button>
        </div>

        <div v-if="!wrongNetwork && hasMetamask && address">
          <div>
            <div>
              <div class="status_label">Your address</div>
              <div class="black_box">{{ address }}</div>
              <div class="status_label">Your ETH balance</div>
              <div class="black_box">{{ Number(balance).toFixed(2) }} ETH</div>
            </div>
            
            <div>
              <div class="claim_container">
                <div class="reward_title">Claimable Balance</div>
                <div class="reward_balance">{{ Number(claimBalance).toFixed(3) }} ETH</div>
                <div class="reward_button_container">
                  <button @click="doClaim" type="button" class="claim_button" v-if="claimBalance > 0">
                    Claim
                  </button>
                </div>
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
import ERC20 from '../abis/ERC20.json'

export default {
  data() {
    return {
      loading: true,
      hasMetamask: false,
      address: null,
      balance: 0,
      chainId: 60005,
      networkName: 'Hypr Testnet',
      wrongNetwork: false,
      claimBalance: 0.15293394483
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
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
    },
    async getBalance() {
      const balance = await ethereum.request({method: 'eth_getBalance', params: [this.address, "latest"]})
      this.balance = ethers.utils.formatEther(balance)
    },
    async doClaim() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const USDTContract = new ethers.Contract('0x4BC17E401158512AcE512E92592dc270466a7328', ERC20, signer)
      const sup = await USDTContract.totalSupply()
      console.log(Number(sup))
    },
    async didAccountChange() {
      this.isConnected()
    },
    async didNetworkChange() {
      const chainId = await window.ethereum.request({method: 'eth_chainId'})
      if (Number(chainId) !== Number(this.chainId)) {
        this.wrongNetwork = true
        return
      }
      this.wrongNetwork = false
      this.isConnected()
    }
  },
  mounted() {
    if (process.client && window.ethereum) {
      this.hasMetamask = true
      this.didNetworkChange()
      this.isConnected()

      window.ethereum.on("accountsChanged", (accounts) => {
        this.didAccountChange()
      })

      window.ethereum.on("networkChanged", (accounts) => {
        this.didNetworkChange()
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

.alert_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .alert {
    background-color: #bcbcbc;
    color: black;
    font-size: 18px;
    font-weight: 500;
    padding: 15px;
    width: 70%;
    border-radius: 10px;
    border: none;
    text-align: center;
    margin-top: 200px;

    img {
      width: 20px;
      vertical-align: middle;
      position: relative;
      bottom: 1px;
      margin-right: 5px;
    }
  }
}

.connect_button_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 200px;
}
.connect_button {
  background-color: $secondary-color;
  color: white;
  font-size: 18px;
  font-weight: 500;
  padding: 15px;
  width: 50%;
  box-shadow: none;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  img {
    width: 30px;
    vertical-align: middle;
    position: relative;
    bottom: 2px;
    margin-right: 10px;
  }
}

.connect_button:hover {
    opacity: 0.8;
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
  cursor: pointer;
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