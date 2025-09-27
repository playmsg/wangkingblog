---
title: "coldfusion K2SERVER 索引错误的解决"
description: "最近服务器频繁发生索引不生效的问题，今天仔细检查了一下，发现是硬盘空间不够造成的"
pubDate: "Jun 11 2008"
heroImage: "/blog-placeholder.jpg"
---
最近服务器频繁发生索引不生效的问题，今天仔细检查了一下，发现是硬盘空间不够造成的。

服务器商对服务器硬盘的分区默认C盘是20G左右，而CF8也默认是安装在了C盘。有一点我一直没有注意到，K2产生的索引文件蛮大的，一个5万条左右记录的索引，占据接近1个G的空间，而我有好几个这样的索引。

这样比较简单的解决方案，就是删除索引，在另一个盘上重建，但是这样出现了问题，就是删除索引后，重建时出现“Verity Error CFMX8 VdkError\_PathNotFound“错误。一开始以为是权限问题，后来发现不是。研究了一下后，停止CFSEARCH SERVICE，删除CFusionMX8VerityDataservicesColdFusionK2\_indexserver1ws目录下一堆乌七八糟的目录后，重启K2，搞定。

今天大盘又底眼了，干。
