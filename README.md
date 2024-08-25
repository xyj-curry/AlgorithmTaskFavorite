# AlgorithmTaskFavorite
AlgorithmTaskFavorite 是一个收藏算法题的Chromium插件。

AlgorithmTaskFavorite 可以收藏网站，类似浏览器里的收藏夹。收藏特定网站的题目时插件可以自动识别题目名称和标识，并可以按照不同网站分类。

## 使用方法
可以下载Releases里的`AlgorithmTaskFavorite.zip`文件，在 `chrome://extensions`(chrome) 或 `edge://extensions`(edge) 中加载（需要打开开发者模式）。

也可以直接clone这个project，`make`(windows可以直接点击`make.bat`或运行`./make`,要安装mingw(原本应该是可以直接用tar命令压缩的,但我不知道为什么我压缩后会有问题))，就会打包出一个`AlgorithmTaskFavorite.zip`文件，可以在 `chrome://extensions`(chrome) 或 `edge://extensions`(edge) 中加载（需要打开开发者模式）。

## 功能
再找到题目后，点击浏览器右上角插件的图标，会打开一个小页面。点击`添加题目(顶)`或`添加题目(底)`会将你正在打开的页面加入到收藏夹内(如果已经有一道题的题目名称和url都一样就不会添加)。

点击第二个框内元素会只显示所有选择网站的题目，灰色为当前选择的网站。

第三个框会显示所有你收藏的题目。左边数字是标号，如果你选择除`all`以外的任意标签会有一个括号，括号外是在选择网站的题目内的排名，括号内是在所有题目内的排名。右边是题目标签点击文字部分会跳转至相应网页，后面两个图标分别是**编辑**和**删除**。

编辑页面上面`重命名`和`修改url`显示的是当前的名称和url，修改后按确认或回车立即生效，url如果没加协议名(如https、http等)自动加上https://。下面是修改位置前面的框显示的是当前位置及其上下题目，红色的是当前题目，下面的输入框可以直接输入位置，按确认或回车立即生效，当前题目变成输入的文字，输入的位置及以下的题目下降一位。后面的上和下分别可以使题目上升和下降一位。

第四个框可以导入导出所有题目，点击导出会导出一个包含所有题目的json文件。导入分覆盖和插入，覆盖会删除掉之前的所有题目在导入新的题目列表，插入会插入到选择的位置，从选择的位置开始是导入的题目列表，后面的题目在顺着接下去，如果有重复的题目优先保留先出现的。

## 支持网站
|网站														|分类标签	|自动识别题目	|
|-----------------------------------------------------------|-------|-----------|
|[QQ docs](https://docs.qq.com)								|✔		|❌			|
|[洛谷](https://www.luogu.com.cn)							|✔		|✔			|
|[Codeforces](https://codeforces.com)						|✔		|✔			|
|[AtCoder](https://atcoder.jp)								|✔		|✔			|
|[iai](https://iai.sh.cn)									|✔		|✔			|
|[vjudge](https://vjudge.net)								|✔		|✔			|
|[Codeforces GYM](https://codeforces.com/gyms)				|✔		|✔			|
|[luogu training](https://www.luogu.com.cn/training/list)	|✔		|✔			|
|[poj](http://poj.org)										|✔		|✔			|

## LICENSE
Copyright 2024 xyj-curry.

MIT LICENSE