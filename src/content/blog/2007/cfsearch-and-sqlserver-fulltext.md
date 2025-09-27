---
title: "关于CFSEARCH和数据库搜索"
description: "最近做的一个项目，因为需要兼容以前google收录的页面，所以采用了一个小小的技巧：当旧的URL过来，把其中一部分URL（涉及到产品名称）提取出来，作为关键字，通过网站的搜索系统搜索一下，返回一个搜索到的产品列表"
pubDate: "Oct 31 2007"
heroImage: "/blog-placeholder.jpg"
---
最近做的一个项目，因为需要兼容以前google收录的页面，所以采用了一个小小的技巧：当旧的URL过来，把其中一部分URL（涉及到产品名称）提取出来，作为关键字，通过网站的搜索系统搜索一下，返回一个搜索到的产品列表。

　　这个技巧本身很简单，没有什么问题，但是开始上线后，别的问题出现了：随着访问量的增大，sql server的CPU负载达到100%，服务器反应速度严重下降。通过后台监测SQL语句，发现除了复杂的联合查询影响了速度外（这是另外一个优化问题），剩下的就是大量的搜索-like %xxx%这种东西了。

　　这个就很好理解了。我们的程序员么，一般没有特殊说明，显然是用like这种SQL查询来解决搜索的问题，开发测试也没什么问题（看起来我们没做过正经的压力测试）。但是上线之后，like的问题就显现了。我们的记录数虽然只有不到5万条，不过每天1万的访问量已经足够挂掉sqlserver2000了。基于这个原因，我开始寻找更好的解决方案。第一个出现在眼前的，显然是大人小孩都喜欢的sqlserver的全文搜索。这东西是微软出的，当然很简单。花了10分钟看看文档，再用20分钟写些测试，搞定，然后安排程序员部署，修改程序，页面，耗时1个人日。最终的方案是用freetext方法来搜索制定关键字，搜索结果粗看上去不错。但是用了1个月之后，问题再次显现：虽然这种方法对服务器压力很低，但是搜索结果相当不靠谱，相关度很低，你需要看的东西，往往在最后几页。

　　这就让人忍不住干声连连。微软的东西也靠不住啊。于是我转而寻求第三方的解决方案，比如[lucene](http://lucene.apache.org/)等等。经过测试，这些产品的搜索效果相当不错，但是主要的问题是和我们的网站衔接麻烦：我们本身的网站都是采用coldfusion开发的，虽然可以调用java，但是这个过程相当费劲，我又不想消耗2个工作日以上处理这个问题。

　　最后，作为仅剩的选择，cfsearch出现在我眼前。为啥一直不用cfsearch这个cf开发者首先会想到的东西呢？很简单。在long long time ago,我用过这东西。当时可能是CF4或者5或者MX，在增加了语言包以后可以搜索中文，但搜索结果极烂，对服务器压力极大，所以留给我很恶劣的一个印象。另外还有一个原因，就是以前我没有注意到这东西可以对数据库进行索引，而这次仔细看了CFSEARCH文档，发现其实是可以对QUERY回来的结果集进行索引的，这样一来，就解决了对数据库索引的问题。事实上，不少第三方搜索引擎也是采用类似的方法来实现索引的数据库无关性：先取出一个结果集，然后对结果集生成对应的索引文件。

下面罗列一下代码：

<cfquery name="getalldat" datasource="ds"> select top 100 \* from foo </cfquery>

<cfindex query="getalldat" collection="gsw" action="update" type="Custom" key="softwareid\_int" title="softwarename\_varchar" body="softwaretitle\_varchar,DescriptionLong\_varchar" urlpath="softwareid\_int" custom1="softwarename\_varchar" custom2="softwaretitle\_varchar" >

简单说明一下：第一个QUERY把表里所有数据取出来（一个标准的QUERY，当然你可以用任何SQL）；第2个CFINDEX针对上个QUERY产生的结果集，生成索引，放置在gsw这个索引文件中。注意，CFINDEX的type需要设置成Custom，因为是索引一个结果集，而不是不同的索引一大堆文件。key就是ID，body就是你打算进行索引的字段，custom,title等，你可以放置打算在CFSEARCH中返回的某条记录的附加值（比如除了记录的ID，你很可能还要返回记录的一些其他内容）。

CFSEARCH就比较简单，不提了。

最终的结果：看起来很美，打算用一个月看看。

免费赠送一个结果集排序的小技巧：

<cfset columnId = mysearchRes.findColumn("RANK")> <cfset mysearchRes.sort(columnId, false)>
