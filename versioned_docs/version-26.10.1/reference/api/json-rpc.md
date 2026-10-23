---
description: Use for signing execution layer payloads 
sidebar_position: 1
---

# Web3Signer JSON-RPC API

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- markdownlint-disable-file -->

:::note
- All JSON-RPC HTTP examples use the default host and port endpoint `http://127.0.0.1:8545`.
- The examples use Besu, but you can use any Ethereum execution client.
:::

## `eth_accounts`

Returns the account address with which Web3Signer is signing transactions.

Returns multiple accounts if multiple signers are configured.

### Parameters

None

### Returns

`Array of data` - Account address with which Web3Signer is signing transactions

<Tabs>

  <TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://127.0.0.1:8545
```

  </TabItem>
  <TabItem value="JSON result" label="JSON result" >

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": ["0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"]
}
```

  </TabItem>
</Tabs>

## `eth_sign`

Calculates an Ethereum specific signature using
`sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)))."`

Adds a prefix to the message that makes the calculated signature recognizable as an Ethereum
specific signature.
This prevents malicious dapps from signing arbitrary data (for example, a transaction) and using the
signature to impersonate the victim.

### Parameters

`DATA` - 20-byte account address

`DATA` - Data string to sign

### Returns

`DATA` - Signature

<Tabs>

  <TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sign","params":["0x78e6e236592597c09d5c137c2af40aecd42d12a2", "0x2eadbe1f"], "id":1}' http://127.0.0.1:8545
```

  </TabItem>
  <TabItem value="JSON result" label="JSON result" >

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xa6122e277f46fea78f3e97d3354a03ad20b2296733dfefbadc7305c80e70ce9826d44f12ab5aa488689744657491c70d3b654d7f60f8f50beefac9abcf02a4cf1b"
}
```

  </TabItem>
</Tabs>

## `eth_signTransaction`

Signs a transaction that you can submit to Besu at a later time using
[`eth_sendRawTransaction`](https://besu.hyperledger.org/public-networks/reference/api#eth_sendrawtransaction).

### Parameters

Transaction object:

| Key | Type | Required/Optional | Value |
| --- | :-- | --- | --- |
| `from` | Data, 20&nbsp;bytes | Required | Address of the sender. |
| `to` | Data, 20&nbsp;bytes | Optional for contract creation | Address of the receiver. `null` if this is a contract creation transaction. |
| `gas` | Quantity | Optional | Gas provided by the sender. The default is `90000`. |
| `gasPrice` | Quantity | Optional | Gas price provided by the sender in Wei. The default is `0`. Used only in non [EIP-1559] transactions. |
| `maxPriorityFeePerGas` | Quantity | Optional | Maximum fee, in Wei, the sender is willing to pay above the base fee. Used only in [EIP-1559] transactions. |
| `maxFeePerGas` | Quantity | Optional | Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay. Used only in [EIP-1559] transactions. |
| `nonce` | Quantity | Optional | Number of transactions made by the sender before this one. |
| `value` | Quantity | Optional | Value transferred in Wei. |
| `data` | Quantity | Optional | Compiled contract code or hash of the invoked method signature and encoded parameters. |

### Returns

`result` : `data` - The signed transaction object.

<!-- markdownlint-disable -->

<Tabs>

  <TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_signTransaction","params":[{"from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567","gas": "0x7600","gasPrice": "0x9184e72a000","value": "0x9184e72a", "nonce":"0x46"}], "id":1}' http://127.0.0.1:8545
```

  </TabItem>
  <TabItem value="JSON result" label="JSON result" >

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}
```

  </TabItem>
</Tabs>

## `eth_signTypedData`

`eth_signTypedData` is the same as `ethsign` except a typed data structure is specified
as the object to be signed instead of a data string.

Calculates an Ethereum specific signature using
`sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)))."`

Adds a prefix to the message that makes the calculated signature recognizable as an Ethereum
specific signature.
This prevents malicious dapps from signing arbitrary data (for example, a transaction) and using the
signature to impersonate the victim.

The JSON schema for the typed data structure to sign is:

```json
{
  type: 'object',
  properties: {
    types: {
      type: 'object',
      properties: {
        EIP712Domain: {type: 'array'},
      },
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            type: {type: 'string'}
          },
          required: ['name', 'type']
        }
      },
      required: ['EIP712Domain']
    },
    primaryType: {type: 'string'},
    domain: {type: 'object'},
    message: {type: 'object'}
  },
  required: ['types', 'primaryType', 'domain', 'message']
}
```

### Parameters

`DATA` - 20-byte account address

`TYPEDDATA` - Typed data structure to sign

### Returns

`DATA` - Signature

<!-- markdownlint-disable -->

<Tabs>

  <TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_signTypedData","params":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826", {"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":1,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}],"id":1}'
```

  </TabItem>
  <TabItem value="JSON result" label="JSON result" >

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c"
}
```

  </TabItem>
</Tabs>

## `eth_sendTransaction`

Creates and signs a transaction using the signing key.

Web3Signer submits the signed transaction to Besu using
[`eth_sendRawTransaction`](https://besu.hyperledger.org/public-networks/reference/api#eth_sendrawtransaction).

### Parameters

Transaction object:

| Key | Type | Required/Optional | Value |
| --- | :-- | --- | --- |
| `from` | Data, 20&nbsp;bytes | Required | Address of the sender. |
| `to` | Data, 20&nbsp;bytes | Optional for contract creation | Address of the receiver. `null` if this is a contract creation transaction. |
| `gas` | Quantity | Optional | Gas provided by the sender. The default is `90000`. |
| `gasPrice` | Quantity | Optional | Gas price provided by the sender in Wei. The default is `0`. Used only in non [EIP-1559] transactions. |
| `maxPriorityFeePerGas` | Quantity | Optional | Maximum fee, in Wei, the sender is willing to pay above the base fee. Used only in [EIP-1559] transactions. |
| `maxFeePerGas` | Quantity | Optional | Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay. Used only in [EIP-1559] transactions. |
| `nonce` | Quantity | Optional | Number of transactions made by the sender before this one. |
| `value` | Quantity | Optional | Value transferred in Wei. |
| `data` | Quantity | Optional | Compiled contract code or hash of the invoked method signature and encoded parameters. |

:::tip

Submitting a transaction with the same nonce as a pending transaction and a higher gas price replaces the pending transaction with the new one.

:::

### Returns

`result` : `data` - 32-byte transaction hash

<Tabs>

  <TabItem value="curl HTTP request" label="curl HTTP request" default>

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from": "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73","to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567","gas": "0x7600","gasPrice": "0x9184e72a000","value": "0x9184e72a"}], "id":1}' http://127.0.0.1:8545
```

  </TabItem>
  <TabItem value="JSON result" label="JSON result" >

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x6052dd2131667ef3e0a0666f2812db2defceaec91c470bb43de92268e8306778"
}
```

  </TabItem>
</Tabs>

<!--links-->

[EIP-1559]: https://eips.ethereum.org/EIPS/eip-1559
