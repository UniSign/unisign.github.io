---
sidebarDepth: 4
---
# UniSign Protocol

## 初衷
Web3.0 不只是区块链，区块链不只是 EVM 兼容。MetaMask 给 Dapp 暴露的接口已经成为了事实上的标准，EVM 生态的应用开发者和钱包开发者因此得以高效率的协作。但这套接口并未涉及到 EVM 之外的更广泛 Web3.0 生态。

UniSign Protocol 旨在为更广泛的 Web3.0 生态（包括 EVM 兼容链，非 EVM 兼容链以及其他非对称公私钥系统）设计一套接口规范，以使得应用（包括中心化应用和去中心化应用）可以与管理这些私钥的工具进行交互。尽管目前运行在非 EVM 上的应用较少，但我们认为这只是现状。提出这样一套接口规范，有助于应用开发者，钱包开发者，公链开发者等一系列生态角色之间更好的进行协作，加速 Web3.0 生态的繁荣。

## 术语
**UniSign Protocol**，指本文中所列举一系列接口规范。

**Signer**，指实现了 UniSign Protocol 的私钥管理器。一般为硬件钱包、浏览器插件、App 钱包、桌面钱包，其他硬件等，也可以是任何其他遵循了 UniSign Protocol 协议的产品。这些产品管理着用户的一个或者多个私钥，并响应 Application  的接口调用，使用私钥对来自应用的消息进行签名。

**Application**，泛指中心化应用以及去中心化应用。

**Key Object**，对某种类型的公钥/地址的结构化描述，它是一个JSON 结构：
```json5
{
"key":"15wx...XtwM",
"type":"blockchain",
"meta": {
"coinType":"0", // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
"chainId":"", // https://chainlist.org/
"chainName": "Bitcoin",
"symbol": "BTC",
}
}
// 对于 blockchain 类型而言，keyInfo 中 coinType 和 chainId 为必选字段。
```

## 基本假设及原则
1. 一个 Signer 中管理着 N 种类型的 M 个私钥。如一个钱包中同时管理了2个比特币私钥，3个以太坊私钥，5个狗狗币私钥。私钥类型并不局限于区块链。
2. 一个 Application 可以使用多种类型的私钥。
3. Signer 管理着多个私钥，但任何时候，只有一个私钥处于当前选中状态。Application 只能和当前选中的私钥进行交互。
4. 基于安全，切换选中的私钥的动作，只能由用户在 Signer 内操作。
5. 基于隐私，Application 不能直接获取到 Signer 内的所有的 Key 列表。Application 永远只能向用户请求授权当前选中的 Key。
6. UniSign Protocol 并不只适用于区块链所使用的公私钥，因此它并不约束 Signer 是否要为应用提供公链相关的 RPC 接口。

接口协议的设计，遵循以上假设和原则。

## 接口协议
UniSign Protocol 的接口包含两大类：
- 签名相关接口
- Signer 环境相关接口。
  对于 Web 环境而言，实现了UniSign Protocol 的私钥管理器，会向 Web 环境添加一个 window.unisign 对象。该对象是 UniSign 协议相关接口的总入口。

## Singer 环境相关接口
Application 调用环境相关的接口，或监听环境相关的事件通知，可获取到与当前私钥管理相关的信息。总共 7 个接口和 2 个事件通知：
1. [unisign.signer](#unisign-signer)
2. [unisign.isConnected](#unisign-isconnected)
3. [unisign.isUnlocked](#unisign-isunlocked)
4. [unisign.getCurrentKeyType](#unisign-getcurrentkeytype)
5. [unisign.requestPermissionsOfCurrentKey](unisign-requestpermissionsofcurrentkey)
6. [unisign.getCurrentKey](#unisign-getcurrentkey)
7. [unisign.getPermittedKeys](#unisign-getpermittedkeys)
8. [unisign.on("currentKeyChanged")](#unisign-on-currentkeychanged)
9. [unisign.on("lockStatusChanged")](#unisign-on-lockstatuschanged)

### unisign.signer
**描述**：私钥管理器应根据其自身情况，如实的提供 `unisign.signer` 对象。
```js
unisign.signer = {
   supportedKeyTypes: [ //列举当前 Key Manager 的支持的 Key 类型
      {
         "type":"blockchain",
         "meta": {
            "coinType":"0",
            "chainId":"",
            "chainName": "Bitcoin",
            "symbol": "BTC",
         }
      },{
         type:"OpenPGP",
         meta:{}
      }
   ],
   protocolVersion:"0.0.1",//明确为 protocolVersion，避免与下面的 Brands 的 version 混淆
   userAgent:{ //参考了浏览器的字段设计 https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
      brand:"imtoken",
      version:"2.0.1"
   }
}
```

### unisign.isConnected
**描述**：获取当前 Signer 是否已经连接正常，并且可以调用接口  
**入参**：无  
**返回**：`Promise<boolean>`  
**使用规范**：  
如果 Signer 没有正常连接，Application 需要刷新当前页面以使得 Signer 重新连接。

### unisign.isUnlocked
**描述**：获取当前 Signer 是否处于锁定状态。  
**入参**：无  
**返回**：`Promise<boolean>`  
**使用规范**：  
Application 调用相关接口之前，应始终先判断用户是否已经解锁 Signer，并监听 `lockStatusChanged` 事件。若 Signer 处于锁定状态，应在 Application 内引导用户解锁之后，再调用相关接口。
   
对于 Signer，如果 Signer 已被锁定，则对 Application 的任何其他接口调用都作失败处理。


#### unisign.getCurrentKeyType
**描述**：获取 Signer 中用户当前所选中的 Key 的类型。  
**入参**：无  
**返回**：不含 `key` 字段的 KeyObject；`null`  
```json5
{
   "key":"15wx...XtwM",
   "type":"blockchain",
   "meta": {
      "coinType":"0",
      "chainId":"",
      "chainName":"Bitcoin",
      "symbol": "BTC",
   }
}
```
**使用规范：**
1. 只要 Signer 未被锁定，该接口都应该响应。
2. Application 调用该接口时，无需获得其他权限。
3. 返回 `null` 表示 Signer 内没有任何 Key。


#### unisign.requestPermissionsOfCurrentKey
**描述：** Application 向用户请求当前 Key 的授权
**入参：**
```json5
{
   "permissions": ["getCurrentKey","signTypedMessage","signTransaction"], // 可填 “*” 表示请求所有权限
   "type":"blockchain",
   "meta": {
      "coinType":"0",
      "chainId":"",
   }
}
```
**返回：**
```json5
{
   "permittedPermissions": ["getCurrentKey", "signPlainMessage","signTypedMessage","signTransaction"],
   "deniedPermissions":[]
}
```
**使用规范：**
1. Application 调用该接口前，应先调用 `unisign.getCurrentKeyType` 接口，获取用户当前使用的 Key 的类型信息，并将类型信息作为参数的一部分传递给 `unisign.requestPermissionsOfCurrentKey`。
2. Signer 会匹配用户当前的 Key 类型是否与 Application 的传参一致，如果不一致就返回类型不匹配的错误。这样设计的原因在于，Signer 往往管理了多种类型的私钥，而 Application 往往只适用于少数类型的私钥。协议的设计上需要保证，Application 获得的 Key 授权，是有意义的授权。
3. Signer 应给用户提供授权和拒绝授权的界面，并在允许用户可以在界面中取消勾选权限选项。
4. Application 可以传递 `"permissions": "*"`，表示请求所有权限
5. `"deniedPermissions"`中放置由 Application 申请的，但是被用户手动取消勾选的权限。
6. Application 可以分多次请求不同的权限，用户新授权的权限采用增量追加的方式记录到 Signer 内部。用户拒绝新的授权，不影响之前已经授权的权限。
7. 用户选择授权，仅表示用户对于 Application 授权了当前这个特定 Key 的特性权限。 Application 并不会因此获得 Signer 内的其他 Key 的权限。



#### unisign.getCurrentKey
**描述：** 获取用户当前所使用的 Key 的信息。  
**入参：** 无  
**返回：**
```json5
{
   "key":"15wx...XtwM",
   "type":"blockchain",
   "meta": {
      "coinType":"0",
      "chainId":"",
      "chainName": "Bitcoin",
      "symbol": "BTC",
   }
}
```

**使用规范：**
Application 调用该接口之前应先调用unisign.requestPermissionsOfCurrentKey获得对应的权限，否则将获得一个错误。

### unisign.getPermittedKeys
**描述：** 查询当前 Application 已经获得的所有的 key 权限明细  
**入参：** 无  
**返回：**
```json5
{
   "invoker": "https://did.id",
   "keys": [
      {
         "key":"15wx...XtwM",
         "type":"blockchain",
         "meta": {
            "coinType":"0",
            "chainId":"",
            "chainName": "Bitcoin",
            "symbol": "BTC",
         },
         "permissions": ["*"]
      },
      {
         "key": "123...abc",
         "type": "openPGP",
         "meta":{
         }
      }
   ]
}
```


### unisign.on("currentKeyChanged")
**描述：** 用户切换当前 Key 的事件通知  
```typescript
unisign.on('currentKeyChanged', handler: (key: KeyTypeObject) => void);
```

**使用规范：**
1. 应用应监听该事件，并做出对应的响应，以提升用户体验。
2. 若应用拥有新的 Key 的某些权限，则应该在事件对象中返回这个 Key 的详细信息和应用所拥有的权限。否则应在事件对象中告知应用，它不具备新 Key 的任何权限（待定）。

#### unisign.on("lockStatusChanged")
```typescript
uniSign.on('lockStatusChanged', handler: (lock: bool) => void);
```

## 签名相关接口
UniSign Protocol 的核心目标是衔接应用（Application）和私钥管理器（Signer）。因此，签名接口以及签名实现使其最为核心的部分。总共包含三个接口：
1. [signPlainMessage](#signplainmessage)
2. [signTypedMessage](#signstructmessage)
3. [signTransaction](#signtransaction)

### signPlainMessage
**描述：** 签署任意的非结构化的消息。
**入参：**
```json5
{
   "key": {// 明确要使用哪个 Key 进行签名
      "key":"15wx...XtwM",
      "type":"blockchain",
      "meta": {
         "coinType":"0",
         "chainId":"",
      }
   },
   "message": "" // 明文
}
```
**返回：**
```json5
{
   "key": {
      "key":"15wx...XtwM",
      "type":"blockchain",
      "meta": {
         "coinType":"0",
         "chainId":"",
         "chainName": "Bitcoin",
         "symbol": "BTC",
      }
   },
   "signedMessage": ""
}
```
**使用规范：**
1. 若 Application 签名所要求的 Key 并不是用户当前所选择的 Key，那么返回 Key 不匹配的消息。 Application 发现不匹配，应引导用户切换到指定的 Key。事实上 Application 应始终监听 `currentKeyChanged` 事件，确保 Application 内记录的 Key 与用户的当前选择保持同步。
2. UniSign 协议的范围不光是接口的定义，还应包括对签名的具体过程给出明确的约束，确保相同的入参在不同的 Signer 中都有相同的签名结果。因此，对于签名过程，UniSign 遵循 Bitcoin 的消息签名共识。若未来默认的签名过程不能满足业务需求，`signPlainMessage` 接口可以接受一个可选参数。
3. UniSign 遵循 Bitcoin 的消息签名共识，所以 Signer 内部实现时，会对应用传入的待签名消息加一个 Magic 前缀，然后再做两次 sha256 Hash 之后，再签名。

**Python 实现如下：**

```python
# python 3.9.7
import hashlib
import struct
def plainSign(magic, msg):
digest0 = hashlib.sha256(msg).digest()
digest0_len = str(len(digest0)).encode("utf-8")
# 先加前缀，基本格式采用 LV （Length-Value）格式：
msg_for_sign = struct.pack('B', len(magic)) + magic + digest0_len + digest0
# 再做两次 hash
digest1 = hashlib.sha256(msg_for_sign).digest()
digest2 = hashlib.sha256(digest1).digest()
return digest2

# 使用方法
digest = "0x528b1b6e39293b6ac71b0392358340ce6acb1bf2fccaecff643facbaf0f577a9"
msg = "I agree with xxx" + digest
magic = "Bitcoin Signed Message:\n"
msg_for_sign = plainSign(magic.encode("utf-8"), msg.encode("utf-8"))
# 使用现有库里的 sign 函数签名
signer.sign(msg_for_sign, privateKey)
```


### signStructMessage

**描述：** 签署结构化消息。  
**入参：**  
```json5
{
   "key": {// 明确要使用哪个 Key 进行签名
      "key":"15wx...XtwM",
      "type":"blockchain",
      "meta": {
         "coinType":"0",
         "chainId":"",
      }
   },
   "message":{
      "protocolVersion": "",
      "signFrom": "",//谁发起的签名请求，web应用应填写当前的应用所在的域名；其他场景应用不做要求。
      "appName": "DAS",
      "subject": "transfer owner of alice.bit to 0x1837ldu378gdhdark",//对该签名将会发生的时间的概要描述
      "signer": "",
      "digest": "",//业务测的防重放参数，应该叫做 nonce？
      "content": {}//应用的业务字段
   }
}
```
**返回：**
```json5
{
   "key": {
      "key":"15wx...XtwM",
      "type":"blockchain",
      "meta": {
         "coinType":"0",
         "chainId":"",
         "chainName": "Bitcoin",
         "symbol": "BTC",
      }
   },
   "signedMessage": ""
}
```

**使用规范：**
1. 在 Web 环境中，Signer 应将 signFrom 和实际发起请求的 Application 所在的域名进行对比，如果不一致则直接返回错误。
2. 在 Web 环境中，Signer 应将 appName，subject，content字段明确的展示给用户，让用户清楚当前的签署动作是针对什么 Application 的什么操作。
3.  Application （智能合约部分）应校验 subject 中的描述与 content 中的复杂的业务行为是否一致，不一致则拒绝执行。


### signTransaction
**描述：** 签署区块链交易。仅适用于 blockchain 类型的 Key。  
**入参：** 待签名的交易数据  
**返回：** 签名后结果  
**使用规范：**
1. 在 Web 环境中，Signer 应分析入参，明确告知用户签署该交易后，多少数量的什么币种会分别转出多少到哪些地址。
2. 该接口仅提供签名，不负责交易构造以及签名后交易的发送。Signer 是否提供其他接口为 Application 完成交易构造和发送，取决于 Signer 开发者自己的考虑。协议并不对此做出约束。