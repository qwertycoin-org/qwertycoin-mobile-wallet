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

import {
    AppState
} from '../model/AppState';
import {
    DestructableView
} from "../lib/numbersLab/DestructableView";
import {
    DependencyInjectorInstance
} from "../lib/numbersLab/DependencyInjector";
import {
    Wallet
} from "../model/Wallet";
import {
    Constants
} from "../model/Constants";
import {
    VueClass, VueVar, VueWatched
} from "../lib/numbersLab/VueAnnotate";

let wallet: Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

class ElectionPageView extends DestructableView {

    @VueVar([]) elections!: any[];
    @VueVar([]) electionCategories!: any[];
    @VueVar('') totalDonations!: string;

    rawElectionData !: any;

    private intervalRefreshElections = 0;

    constructor(container: string) {
        super(container);
        AppState.enableLeftMenu();

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


    refreshElections() {
        this.getElections();
    }

    getElections() {
        let self = this;
        let Url = config.electionApiUrl;
        
        $.ajax({
            url: Url
        }).done(function(data: any) {
            self.totalDonations = data.totalDonations;
            self.elections = data.elections;
            self.electionCategories = data.categories;
        });

         
    }

    vote() {
        let self = this;
        blockchainExplorer.getHeight().then((blockchainHeight: number) => {
            let amount;
        })
    }
}

if (!wallet !== null && blockchainExplorer !== null) {
    new ElectionPageView('#app');
} else {
    window.location.href = '#index';
}