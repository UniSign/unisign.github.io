# 介绍
欢迎使用 UniSign。

UniSign 是在 Web3 世界中连接你的私钥和 Dapp 的链接器。它包括一个浏览器插件和对应的[协议](../protocol/README.md)。
本文档的目的是指引你如何构建一个和 UniSign 交互的 Dapp。

## 背景
Web3.0 不只是区块链，区块链不只是 EVM 兼容。

MetaMask 给 Dapp 暴露的接口已经成为了事实上的标准，EVM 生态的应用开发者和钱包开发者因此得以高效率的协作。但这套接口并未涉及到 EVM 之外的更广泛 Web3.0 生态。

为了让更广泛的 Web3.0 生态之间能互相联动，我们开发了 UniSign。

## 导航
- 你可以在我们的[官网](https://unisign.org)下载最新版的 UniSign 插件。
- 我们的代码在 [Github](https://github.com/UniSign/unisign-extension) 开源
- 对本文档有任何修改、建议，请查看[文档源码](https://github.com/UniSign/unisign.github.io)

## 概述
UniSign 由两部分组成：UniSign 插件和 UniSign 协议。

#### UniSign 插件
UniSign 插件是一个 Chrome 插件，用户只需要简单地安装即可初始化或者导入一个钱包（或者称为私钥管理器）。

Dapp 开发者通过调用 [UniSign 协议](../protocol/README.md)就可以和用户的私钥进行交互，包括签名、验签等等。

**目前插件支持的公链：**
- BTC
- DOGE
- CKB

> 下载插件：[UniSign 官网](https://unisign.org)

#### UniSign 协议

> 查看协议: [UniSign Protocol](../protocol/README.md)