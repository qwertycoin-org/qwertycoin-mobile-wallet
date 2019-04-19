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
/**
  *  Contacts: 
  *  "Contacts": [
  *      {"ExploShot": "QWC1Nsegh9NRyaSH7A1hch59VpvsjjwZwGRFvEUXFbs9QMj145gXJQDbdcR5r6rTQPX6hPy1ij5SCTr2SFkrnuNBAH1Gh2EshP"}
  *  ]
*/

import {DestructableView} from "../lib/numbersLab/DestructableView";
import { VueVar } from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {Constants} from "../model/Constants";
import { Storage } from './../model/Storage';

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class AddContactView extends DestructableView {
    @VueVar('') contactName !: string;
    @VueVar('') contactAddress !: string;

    constructor(container : string) {
        super(container);
    }

    static hasOneStored(): Promise<boolean> {
        return Storage.getItem('qwcContacts', null).then(function(contacts: any[]) {
            return contacts !== null;
        });
    }

    addContact() {
        let contact = { Name: this.contactName, Address: this.contactAddress }
        if(AddContactView.hasOneStored()) {
            swal({
                type:'success',
                title: `We have Contacts`,
                confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
            });
            return Storage.getItem('qwcContacts', null).then((existingContacts) => {
                if (existingContacts !== null) {
                    let tempContacts: any[] = JSON.parse(existingContacts);
                    tempContacts.push(contact);
                    return Storage.setItem('qwcContacts', JSON.stringify(tempContacts)).then((contacties: any) => {
                        swal({
                            type:'success',
                            title: `We have saved Contacts: ${JSON.parse(contacties).length}`,
                            confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                        });
                        return window.location.href = '#contactPage';
                    });
                } else {
                    swal({
                        type:'error',
                        title: `Oh heavy shitload happened`,
                        confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
                    });
                    let newContacts: any[] = [];
                    newContacts.push(contact);
                    return Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(() => {
                        return window.location.href = '#contactPage';
                    });
                }
            });
        } else {
            let newContacts: any[] = [];
            swal({
                type:'success',
                title: `We have no Contacts`,
                confirmButtonText:i18n.t('changeWalletPasswordPage.modalSuccess.confirmText'),
            });
            newContacts.push(contact);
            return Storage.setItem('qwcContacts', JSON.stringify(newContacts)).then(() => {
                return window.location.href = '#contactPage';
            });
        }
    }

}

if(wallet !== null && blockchainExplorer !== null)
	new AddContactView('#app');
else
	window.location.href = '#index';