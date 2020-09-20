/**
 *     Copyright (c) 2019, ExploShot
 *     Copyright (c) 2019, The Qwertycoin Project
 *
 *     All rights reserved.
 *     Redistribution and use in source and binary forms, with or without modification,
 *     are permitted provided that the following conditions are met:
 *
 *     ==> Redistributions of source code must retain the above copyright notice,
 *         this list of conditions and the following disclaimer.
 *     ==> Redistributions in binary form must reproduce the above copyright notice,
 *         this list of conditions and the following disclaimer in the documentation
 *         and/or other materials provided with the distribution.
 *     ==> Neither the name of Qwertycoin nor the names of its contributors
 *         may be used to endorse or promote products derived from this software
 *          without specific prior written permission.
 *
 *     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *     "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *     LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *     A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 *     CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *     EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *     PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *     PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *     LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar} from "../lib/numbersLab/VueAnnotate";
import {TransactionsExplorer} from "../model/TransactionsExplorer";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Constants} from "../model/Constants";
import {Wallet} from "../model/Wallet";
import {Url} from "../utils/Url";
import {AppState} from "../model/AppState";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {WalletWatchdog} from "../model/WalletWatchdog";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer: BlockchainExplorer = BlockchainExplorerProvider.getInstance();

AppState.enableLeftMenu();

class ElectionDetailsView extends DestructableView {
    @VueVar('') questionID!: string;
    @VueVar('') question!: string;
    @VueVar('') description!: string;
    @VueVar([]) answers!: any[];
    @VueVar('') qwcPerVote!: string;
    @VueVar('') neededBTC!: string;
    @VueVar('') minimumVotes!: string;

    @VueVar('') qwcPerVote2!: string;
    @VueVar('') neededBTC2!: string;
    @VueVar('') minimumVotes2!: string;

    @VueVar('') paymentId !: string;


    @VueVar([]) elections!: any[];
    @VueVar([]) electionCategories!: any[];
    @VueVar('') totalDonations!: string;
    @VueVar() election!: any;

    private intervalRefreshElections = 0;

    constructor(container: string) {
        super(container);

        this.questionID = Url.getHashSearchParameter('questionID').replace(/%20/g, " ");

        let self = this;
        self.intervalRefreshElections = setInterval(() => {
            this.getElections();
        }, 30 * 1000);
        this.getElections();
    }

    destruct(): Promise<void> {
        clearInterval(this.intervalRefreshElections);
        return super.destruct();
    }

    getElections() {
        let self = this;
        let Url = config.electionApiUrl;

        $.ajax({
            url: Url
        }).done(function (data: any) {
            self.totalDonations = data.totalDonations;
            self.elections = data.elections;
            self.electionCategories = data.categories;

            let temp = self.elections.find(function (election) {
                return election.questionID == self.questionID;
            });

            self.question = temp.question;
            self.answers = temp.answers;
            self.description = temp.description.replace(/<br\/>/g, " ");
            self.qwcPerVote = temp.qwcPerVote;
            self.neededBTC = temp.neededBTC;
            self.minimumVotes = temp.minimumVotes;
        });


    }

    send(address: string) {
        let self = this;
        blockchainExplorer.getHeight().then(function (blockchainHeight: number) {
            let amount = parseFloat(self.qwcPerVote);
            if (address !== null) {
                //todo use BigInteger
                if (amount * Math.pow(10, config.coinUnitPlaces) > wallet.unlockedAmount(blockchainHeight)) {
                    swal({
                        type: 'error',
                        title: i18n.t('sendPage.notEnoughMoneyModal.title'),
                        text: i18n.t('sendPage.notEnoughMoneyModal.content'),
                        confirmButtonText: i18n.t('sendPage.notEnoughMoneyModal.confirmText'),
                    });
                    return;
                }

                //TODO use biginteger
                let amountToSend = amount * Math.pow(10, config.coinUnitPlaces);
                let destinationAddress = address;

                swal({
                    title: i18n.t('sendPage.creatingTransferModal.title'),
                    html: i18n.t('sendPage.creatingTransferModal.content'),
                    onOpen: () => {
                        swal.showLoading();
                    }
                });
                TransactionsExplorer.createTx([{
                        address: destinationAddress,
                        amount: amountToSend
                    }], self.paymentId, wallet, blockchainHeight,
                    function (numberOuts: number): Promise<any[]> {
                        return blockchainExplorer.getRandomOuts(numberOuts);
                    },
                    function (amount: number, feesAmount: number): Promise<void> {
                        if (amount + feesAmount > wallet.unlockedAmount(blockchainHeight)) {
                            swal({
                                type: 'error',
                                title: i18n.t('sendPage.notEnoughMoneyModal.title'),
                                text: i18n.t('sendPage.notEnoughMoneyModal.content'),
                                confirmButtonText: i18n.t('sendPage.notEnoughMoneyModal.confirmText'),
                                onOpen: () => {
                                    swal.hideLoading();
                                }
                            });
                            throw '';
                        }

                        return new Promise<void>(function (resolve, reject) {
                            setTimeout(function () { //prevent bug with swal when code is too fast
                                swal({
                                    title: i18n.t('sendPage.confirmTransactionModal.title'),
                                    html: i18n.t('sendPage.confirmTransactionModal.content', {
                                        amount: amount / Math.pow(10, config.coinUnitPlaces),
                                        fees: feesAmount / Math.pow(10, config.coinUnitPlaces),
                                        total: (amount + feesAmount) / Math.pow(10, config.coinUnitPlaces),
                                    }),
                                    showCancelButton: true,
                                    confirmButtonText: i18n.t('sendPage.confirmTransactionModal.confirmText'),
                                    cancelButtonText: i18n.t('sendPage.confirmTransactionModal.cancelText'),
                                }).then(function (result: any) {
                                    if (result.dismiss) {
                                        reject('');
                                    } else {
                                        swal({
                                            title: i18n.t('sendPage.finalizingTransferModal.title'),
                                            html: i18n.t('sendPage.finalizingTransferModal.content'),
                                            onOpen: () => {
                                                swal.showLoading();
                                            }
                                        });
                                        resolve();
                                    }
                                }).catch(reject);
                            }, 1);
                        });
                    }).then(function (rawTxData: {
                    raw: {
                        hash: string,
                        prvkey: string,
                        raw: string
                    },
                    signed: any
                }) {
                    blockchainExplorer.sendRawTx(rawTxData.raw.raw).then(function () {
                        //save the tx private key
                        wallet.addTxPrivateKeyWithTxHash(rawTxData.raw.hash, rawTxData.raw.prvkey);

                        //force a mempool check so the user is up to date
                        let watchdog: WalletWatchdog = DependencyInjectorInstance().getInstance(WalletWatchdog.name);
                        if (watchdog !== null)
                            watchdog.checkMempool();

                        let promise = Promise.resolve();
                        if (
                            destinationAddress === 'QWC1L4aAh5i7cbB813RQpsKP6pHXT2ymrbQCwQnQ3DC4QiyuhBUZw8dhAaFp8wH1Do6J9Lmim6ePv1SYFYs97yNV2xvSbTGc7s' ||
                            destinationAddress === 'QWC1K6XEhCC1WsZzT9RRVpc1MLXXdHVKt2BUGSrsmkkXAvqh52sVnNc1pYmoF2TEXsAvZnyPaZu8MW3S8EWHNfAh7X2xa63P7Y'
                        ) {
                            promise = swal({
                                type: 'success',
                                title: i18n.t('sendPage.thankYouDonationModal.title'),
                                text: i18n.t('sendPage.thankYouDonationModal.content'),
                                confirmButtonText: i18n.t('sendPage.thankYouDonationModal.confirmText'),
                            });
                        } else
                            promise = swal({
                                type: 'success',
                                title: i18n.t('sendPage.transferSentModal.title'),
                                confirmButtonText: i18n.t('sendPage.transferSentModal.confirmText'),
                            });
                    }).catch(function (data: any) {
                        swal({
                            type: 'error',
                            title: i18n.t('sendPage.transferExceptionModal.title'),
                            html: i18n.t('sendPage.transferExceptionModal.content', {
                                details: JSON.stringify(data)
                            }),
                            confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                        });
                    });
                    swal.close();
                }).catch(function (error: any) {
                    if (Constants.DEBUG_STATE) {
                        console.log(error);
                    }
                    if (error && error !== '') {
                        if (typeof error === 'string')
                            swal({
                                type: 'error',
                                title: i18n.t('sendPage.transferExceptionModal.title'),
                                html: i18n.t('sendPage.transferExceptionModal.content', {
                                    details: error
                                }),
                                confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                            });
                        else
                            swal({
                                type: 'error',
                                title: i18n.t('sendPage.transferExceptionModal.title'),
                                html: i18n.t('sendPage.transferExceptionModal.content', {
                                    details: JSON.stringify(error)
                                }),
                                confirmButtonText: i18n.t('sendPage.transferExceptionModal.confirmText'),
                            });
                    }
                });
            } else {
                swal({
                    type: 'error',
                    title: i18n.t('sendPage.invalidAmountModal.title'),
                    html: i18n.t('sendPage.invalidAmountModal.content'),
                    confirmButtonText: i18n.t('sendPage.invalidAmountModal.confirmText'),
                });
            }
        });
    }
}

if (wallet !== null && blockchainExplorer !== null)
    new ElectionDetailsView('#app');
else {
    AppState.askUserOpenWallet(false).then(function () {
        wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
        if (wallet === null)
            throw 'e';
        new ElectionDetailsView('#app');
    }).catch(function () {
        window.location.href = '#index';
    });
}
