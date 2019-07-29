/*
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {VueClass,VueRequireFilter,VueVar} from "../lib/numbersLab/VueAnnotate";
import {	DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {AppState} from "../model/AppState";
import {Transaction, TransactionIn} from "../model/Transaction";
import {Functions} from "../model/Functions";
import {Currency} from "../model/Currency";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

declare let cordova: any;

class AccountView extends DestructableView {
	@VueVar([]) transactions!: Transaction[];
	@VueVar(0) walletAmount!: number;
	@VueVar(0) walletAmountCurrency!: number;
	@VueVar(0) unlockedWalletAmount!: number;

	@VueVar(0) currentScanBlock!: number;
	@VueVar(0) blockchainHeight!: number;
	@VueVar(Math.pow(10, config.coinUnitPlaces)) currencyDivider!: number;

	@VueVar('btc') countrycurrency !: string;

	intervalRefresh: number = 0;

	constructor(container: string) {
		super(container);
		let self = this;
		AppState.enableLeftMenu();
		this.intervalRefresh = setInterval(function () {
			self.refresh();
		}, 1 * 1000);
		this.refresh();
	}

	destruct(): Promise < void > {
		clearInterval(this.intervalRefresh);
		return super.destruct();
	}

	refresh() {
		let self = this;
		blockchainExplorer.getHeight().then(function (height: number) {
			self.blockchainHeight = height;
		});
		self.refreshWallet();
	}

	moreInfoOnTx(transaction: Transaction) {
		let explorerUrlHash = config.testnet ? config.testnetExplorerUrlHash : config.mainnetExplorerUrlHash;
		let explorerUrlBlock = config.testnet ? config.testnetExplorerUrlBlock : config.mainnetExplorerUrlBlock;
		let transFee = 100000000; //TODO

		let feesHtml = '';
		if (transaction.getAmount() < 0)
			feesHtml = `<div>` + i18n.t('accountPage.txDetails.feesOnTx') + `: ` + (transFee / Math.pow(10, config.coinUnitPlaces)) + `</a> ` + config.coinSymbol + `</div>`;

		let paymentId = '';
		if (transaction.paymentId !== '') {
			paymentId = `<div>` + i18n.t('accountPage.txDetails.paymentId') + `: ` + transaction.paymentId + `</a></div>`;
		}

		let unlockStatus = '';
		let unlckStatus = '';
		let transHeight = transaction.blockHeight + config.txMinConfirms;
		let actualHeight = this.currentScanBlock;

		if (transHeight >= actualHeight) {
			unlckStatus = (((transHeight - actualHeight) - 11) * -1).toString() + '/' + config.txMinConfirms + ' Confirmations';
		} else {
			unlckStatus = config.txMinConfirms + '/' + config.txMinConfirms + ' Confirmations';
		}
		unlockStatus = `<div>` + i18n.t('accountPage.txDetails.unlockStatus') + `: ` + unlckStatus + `</a></div>`;

		let txPrivKeyMessage = '';
		let txPrivKey = wallet.findTxPrivateKeyWithHash(transaction.hash);
		if (txPrivKey !== null) {
			txPrivKeyMessage = `<div>` + i18n.t('accountPage.txDetails.txPrivKey') + `: ` + txPrivKey + `</a></div>`;
		}

		swal({
			title: i18n.t('accountPage.txDetails.title'),
			html: `
<div class="tl" >
	<div>` + i18n.t('accountPage.txDetails.txHash') + `: <a href="` + explorerUrlHash.replace('{ID}', transaction.hash) + `" target="_blank">Check on Explorer</a></div>
	` + paymentId + `
	` + unlockStatus + `
	` + feesHtml + `
	` + txPrivKeyMessage + `
	<div>` + i18n.t('accountPage.txDetails.blockHeight') + `: <a href="` + explorerUrlBlock.replace('{ID}', '' + transaction.blockHeight) + `" target="_blank">` + transaction.blockHeight + `</a></div>
</div>`
		});
	}

	moreInfoOnTx2(transaction: Transaction) {
		let explorerUrlHash = config.testnet ? config.testnetExplorerUrlHash : config.mainnetExplorerUrlHash;
		let explorerUrlBlock = config.testnet ? config.testnetExplorerUrlBlock : config.mainnetExplorerUrlBlock;
		let transFee = 100000000; //TODO

		let feesHtml = '';
		if (transaction.getAmount() < 0)
			feesHtml = `<div class="swal2-p">${i18n.t('accountPage.txDetails.feesOnTx')}: &nbsp;<strong>${(transFee / Math.pow(10, config.coinUnitPlaces))} ${config.coinSymbol}</strong></div>`;

		let paymentId = '';
		if (transaction.paymentId !== '') {
			paymentId = `<div class="swal2-p">${i18n.t('accountPage.txDetails.paymentId')}: &nbsp;<strong>${transaction.paymentId}</strong></div>`;
		}

		let unlockStatus = '';
		let unlckStatus = '';
		let transHeight = transaction.blockHeight + config.txMinConfirms;
		let actualHeight = this.currentScanBlock;

		if (transHeight >= actualHeight) {
			unlckStatus = (((transHeight - actualHeight) - 11) * -1).toString() + '/' + config.txMinConfirms + ' Confirmations';
		} else {
			unlckStatus = config.txMinConfirms + '/' + config.txMinConfirms + ' Confirmations';
		}
		unlockStatus = `<div class="swal2-p">${i18n.t('accountPage.txDetails.unlockStatus')}: &nbsp;<strong>${unlckStatus}</strong></div>`;

		let txPrivKeyMessage = '';
		let txPrivKey = wallet.findTxPrivateKeyWithHash(transaction.hash);
		if (txPrivKey !== null) {
			txPrivKeyMessage = `<div class="swal2-p">${i18n.t('accountPage.txDetails.txPrivKey')}: &nbsp;<strong>${txPrivKey}</strong></div>`;
		}

		let timestamp = '';
		if (transaction.blockHeight > 0) {
			timestamp = `<div class="swal2-p"> ${i18n.t('accountPage.txDetails.timestamp')}: &nbsp;<strong>${i18n.d(new Date(transaction.timestamp * 1000), 'long') }</strong></div>`;
		} else {
			timestamp = `<div class="swal2-p"> <strong>${i18n.t('accountPage.historyBlock.pendingTxStatus')} ... </strong></div>`;
		}

		swal({
			title: i18n.t('accountPage.txDetails.title'),
			html: `
<div class="tl" >
	<div class="swal2-p">${i18n.t('accountPage.txDetails.txHash')}: &nbsp;<strong><a class="swal2-a" href="${explorerUrlHash.replace('{ID}', transaction.hash)}" target="_blank">Check on Explorer</a></strong></div>
	${feesHtml}
	${timestamp}
	${unlockStatus}
	${paymentId}
	${txPrivKeyMessage}
	<div class="swal2-p">${i18n.t('accountPage.txDetails.blockHeight')}: &nbsp;<strong><a class="swal2-a" href="${explorerUrlBlock.replace('{ID}', '' + transaction.blockHeight)}" target="_blank">${transaction.blockHeight}</a></strong></div>
</div>`
		});
	}


	refreshWallet() {
		let self = this;
		
		this.currentScanBlock = wallet.lastHeight;
		this.walletAmount = wallet.amount;
		this.unlockedWalletAmount = wallet.unlockedAmount(this.currentScanBlock);
		if (wallet.getAll().length + wallet.txsMem.length !== this.transactions.length) {
			this.transactions = wallet.txsMem.concat(wallet.getTransactionsCopy().reverse());
		}

		Currency.getCurrency().then((currency : string) => {
			if(currency == null)
				currency = 'btc';
			this.countrycurrency = currency;
		});

		let randInt = Functions.randInt();
		$.ajax({
			url: config.apiUrl[randInt] + 'price.php?currency=' + self.countrycurrency
		}).done(function (data: any) {
			self.walletAmountCurrency = wallet.amount * data.value;
		})
	}
}

if (wallet !== null && blockchainExplorer !== null)
	new AccountView('#app');
else
	window.location.href = '#index';
