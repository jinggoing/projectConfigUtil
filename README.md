# 配置文件和域值参数修改工具

标签（空格分隔）： 域值参数 配置文件 修改工具

---

 1. 概述
 功能：方便开发人员对域值参数文件的修改和调试，节省手动单独修改的时间
工具介绍：该工具是使用nodejs开发的一个简易的web应用，使用相关的文件读写工具对文件进行操作。

---
2. 工具安装

> -- 首先需要在本地安装nodejs
> 
> -- 下载安装文件 下载地址：官网http://www.nodejs.org/download/ 选择对应的文件进行下载 ![此处输入图片的描述][1]   
windows：
> -- 然后一路next 中间选择安装目录就ok了
> -- 打开cmd 输入node -v 如果显示的版本号 说明安装成功了 
linux : 
> -- 详见 ：[https://my.oschina.net/blogshi/blog/260953][2]
> -- 同样命令行输入 node -v 如果显示的版本号 说明安装成功了
> 
> node 安装成功后 接下来从github
> https://github.com/jinggoing/projectConfigUtil.git 把项目 clone 下来
> 
> > cd  projectConfigUtil --------------// cd 到此目录下
> > npm install --------------------------// 使用node的npm 安装项目需要的包
> > node app  ----------------------------// 启动此node应用 

在浏览器打开localhost:9990
![2016-10-18 12-05-27屏幕截图.png-146.7kB][3]
> 如果正常的话应该就可以看到此页面了

---
3. 操作介绍
上传zip文件 
.zip压缩包内容类似这样的:
![2016-10-18 14-21-09屏幕截图.png-43.8kB][4]
文件夹的结构如下：
![2016-10-18 14-19-20屏幕截图.png-69.9kB][5]
选择zip文件后点击按钮提交 正常的话即可看到上传的文件的内容了
![2016-10-18 12-05-27屏幕截图.png-146.7kB][3]
然后可根据需要修改需要的内容值然后点击下面的绿色按钮下载即可
---
> 
> **需要注意的几个点**
> **1.文件夹名称不能有空格 且只能是字母命名 可以用 “-” 符号分隔单词**
> **2.配置文件和域值参数文件内容必须格式正确否则无法解析文件字符串内容**









  


  [1]: http://images.cnitblog.com/blog/327530/201301/08090233-afeb00bc7bf640f7a431d3e648eb068c.jpg
  [2]: https://my.oschina.net/blogshi/blog/260953
  [3]: http://static.zybuluo.com/wique/vem9e4bq4q6wkbgpk8fytsq2/2016-10-18%2012-05-27%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png
  [4]: http://static.zybuluo.com/wique/aiu4iyrz3xoifam9ba5gbd6k/2016-10-18%2014-21-09%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png
  [5]: http://static.zybuluo.com/wique/19jbuphltqtztl8ump13doz6/2016-10-18%2014-19-20%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png
