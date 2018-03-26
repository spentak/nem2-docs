/*
 *
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const nem2Sdk = require("nem2-sdk");
const Account = nem2Sdk.Account,
    Deadline = nem2Sdk.Deadline,
    NetworkType = nem2Sdk.NetworkType,
    TransferTransaction = nem2Sdk.TransferTransaction,
    TransactionHttp = nem2Sdk.TransactionHttp,
    PlainMessage = nem2Sdk.PlainMessage,
    XEM = nem2Sdk.XEM,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    Address = nem2Sdk. Address;

// Replace with the cosignatory private key
const cosignatoryPrivateKey = process.env.COSIGNATORY_1_PRIVATE_KEY;

// Replace with the multisig public key
const multisigAccountPublicKey = '202B3861F34F6141E120742A64BC787D6EBC59C9EFB996F4856AA9CBEE11CD31';

// Replace with recipient address
const recipientAddress = 'SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54';

const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, NetworkType.MIJIN_TEST);

const transferTransaction= TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(recipientAddress),
    [XEM.createRelative(10)],
    PlainMessage.create('sending 10 nem:xem'),
    NetworkType.MIJIN_TEST
);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        transferTransaction.toAggregate(multisigAccount),
    ],
    NetworkType.MIJIN_TEST,
    []
);

//Signing the aggregate transaction
const signedTransaction = cosignatoryAccount.sign(aggregateTransaction);

//Creating the lock funds transaction and announce it


const transactionHttp = new TransactionHttp('http://localhost:3000/');


transactionHttp.announce(signedTransaction).subscribe(x => console.log(x));