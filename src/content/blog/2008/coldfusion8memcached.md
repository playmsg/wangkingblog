---
title: "coldfusion8+memcached"
description: "今天调试成功，不过是基于win32的"
pubDate: "Dec 22 2008"
heroImage: "/blog-placeholder.jpg"
---
今天调试成功，不过是基于win32的。OPENBD实际上已经实现了，CF8还需要自己实现。

另外，安装memcached for win32他那个命令行不能指定内存，端口等，非常操蛋。

正确的做法，是采用SC命令：

sc create memcached12345 binPath= "d:memcachedmemcached.exe -d runservice -p 12345 -m 512" start= auto DisplayName= "MemCached 12345"

以上命令建立名为memcached12345的系统服务，使用12345端口，内存使用512M。
