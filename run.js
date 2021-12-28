'use strict'
require('colors');
const assert = require('assert');
const { Client } = require('jayson/promise');
const { env: ENV } = require('process');
const crypto = require('crypto');
const ethjs = require('ethereumjs-util');
const ARTIFACT = require('./artifacts/FakeContract.output.json');

const VITALIK = '0xab5801a7d398351b8be11c439e05c5b3259aec9b';
const TARGET = ethjs.bufferToHex(crypto.randomBytes(20));
const CALL_DATA = ethjs.bufferToHex(ethjs.keccak256(Buffer.from('returnsOne()')).slice(0, 4));

(async () => {
    const c = new Client.http(ENV.NODE_RPC);
    const tx = {
        from: VITALIK,
        to: TARGET,
        data: CALL_DATA,
        gas: '0x186a0',
        gasPrice: '0x0',
        value: '0x0',
    };
    const r = await c.request('eth_call', [
        tx,
        'latest',
        {
            [TARGET]: {
                code: ARTIFACT.deployedBytecode,
            },
        },
    ]);
    assert.strictEqual(r.result, '0x0000000000000000000000000000000000000000000000000000000000000001');
    console.info('✅ looks good'.green);
})();
