<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->


<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# Lazy Kindler

## 目标用户
喜欢看mobi和azw3类型kinde电子书的用户.

## 要解决的问题
从网上下载好几 Gb kindle电子书以后，如何高效的管理这些电子书？
批量下载电子书的渠道很多，数千本一起打包下载也很常见，电子书的质量参差不齐, 有普通作家写的，也有世界文学大家写的, 种类也很多，有科幻类、言情类、玄幻类等等，每个人都有自己的阅读偏好，有必要对这些电子书进行管理，方便我们快速找到想看的好书.

## 功能介绍
### 书籍相关
#### 书籍导入
支持导入mobi和azw3格式的电子书, 目前平台不支持电子书格式转换。其实要找指定格式的电子书很容易，我一般在这个网站找电子书 http://www.fast8.cc。这个网站的好处是书籍全，同时下载时提供了多种格式选择，墙裂推荐
#### 书籍信息解析
导入电子书以后，平台自动从受支持的电子书文件里提取电子书的元数据信息以及电子书封面，用于页面展示和管理
#### 集合
比如我们可以创建 科幻小书集合、奇幻小说集合、言情小说集合等等，每个集合都可以从书库中选择并添加书籍
#### 展示
为了让书籍从不同维度进行多种多样的展示，我们可以给书籍打分和添加标签，还可以修改作者以及出版社，书籍可以从评分、标签、作者、出版社等不同角度进行展示。集合可以从评分和标签等角度进行展示.
#### 处理流程
在 书籍=>书库 页面下展示的书籍属于我们正式存储的书籍，刚导入的书籍会被展示在 书籍=>临时导入 页面下。书籍被添加到指定集合以后，会被自动转移到 书籍=>书库 页面下.

### kindle
#### 导入kindle clippings文件内容
这个功能目前只支持mac平台使用。kindle连接电脑后，平台会自动把 kindle的My Clippings.txt导入到系统，用于统一管理和多维度展示. 当kindle的My Clippings.txt文件发生变化后，平台会自动导入My Clippings.txt文件里新增的部分，不会重复导入.

## 依赖
python 3.10.4 \
nodejs v14.19.1 \
其他版本未经测试

## 启动服务
### 安装依赖
在项目 backend 目录执行
```
pip3 install -r requirements.txt
```
在项目 frontend 目录执行
```
yarn install
```
### 启动服务
在项目 backend 目录执行
```
python3 app.py
```
在项目 frontend 目录执行
```
yarn start
```
然后浏览器访问 http://localhost:8000

### 注意
1. 平台并没有登陆注册等功能，仅为个人需求设计

# 平台展示

<img width="1551" alt="Snipaste_2022-02-07_23-38-30" src="https://user-images.githubusercontent.com/16133390/152820853-033b1229-f666-4fca-90ac-a2e5329260e6.png">
<img width="1551" alt="Snipaste_2022-02-07_23-33-55" src="https://user-images.githubusercontent.com/16133390/152820863-52bfb241-33c5-4c79-bea5-21ebc04dd322.png">
<img width="1552" alt="Snipaste_2022-02-07_23-38-05" src="https://user-images.githubusercontent.com/16133390/152820869-642779c8-82df-405f-8478-6084f981bf20.png">
<img width="1438" alt="Snipaste_2022-03-04_18-45-40" src="https://user-images.githubusercontent.com/16133390/156749508-db0c952b-1395-4609-af33-939d576b607e.png">
![Xnip2022-05-02_11-45-05](https://user-images.githubusercontent.com/16133390/166182011-09a7897b-7566-426f-a535-ac09c95e0f0a.jpg)


# 其他
用于kindle的第三方工具最有名的应该是calibre，但是这个软件的功能偏向于 "编辑"，对于大量电子书的多维度展示做的相对简陋，因此才打算自己写一个方便管理大量电子书的工具.
目前正在抽空开发，如果您也喜欢看电子书，并且对管理电子书有功能建议，不妨提一下issue，谢谢
