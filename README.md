# AlgorithmTaskFavorite
AlgorithmTaskFavorite 是一个收藏算法题的Chromium插件。

AlgorithmTaskFavorite 可以收藏网站，类似浏览器里的收藏夹。收藏特定网站的题目时插件可以自动识别题目名称和标识，并可以按照不同网站分类。

## 使用方法
可以下载Releases里的`AlgorithmTaskFavorite.zip`文件，在 `chrome://extensions`(chrome) 或 `edge://extensions`(edge) 中加载（需要打开开发者模式）。

也可以直接clone这个project，`make`(windows可以直接点击`make.bat`,要安装mingw(原本应该是可以直接用tar命令压缩的,但我不知道为什么我压缩后会有问题))，就会打包出一个`AlgorithmTaskFavorite.zip`文件，可以在 `chrome://extensions`(chrome) 或 `edge://extensions`(edge) 中加载（需要打开开发者模式）。

## 功能
再找到题目后，点击浏览器右上角插件的图标，会打开一个小页面。点击`添加题目(顶)`或`添加题目(底)`会将你正在打开的页面加入到收藏夹内。

点击第二个框内元素会只显示所有选择网站的题目。

第三个框会显示所有你收藏的题目。左边数字是标号，如果你选择除`all`以外的任意标签会有一个括号，括号外是在选择网站的题目内的排名，括号内是在所有题目内的排名。右边是题目标签点击文字部分会跳转至相应网页，后面两个图标分别是**编辑**和**删除**。

编辑页面上面`重命名`和`修改url`显示的是当前的名称和url，修改后按确认立即生效，url如果没加协议名(如https、http等)自动加上https://。下面是修改位置前面的框显示的是当前位置及其上下题目，红色的是当前题目，下面的输入框可以直接输入位置，按确认立即生效，后面的上和下分别可以使题目上升和下降一位。

## 支持网站
|网站											|分类标签	|自动识别题目	|
|-----------------------------------------------|-------|-----------|
|[QQ docs](https://docs.qq.com)					|✔		|❌			|
|[洛谷](https://www.luogu.com.cn)				|✔		|✔			|
|[Codeforces](https://codeforces.com)			|✔		|✔			|
|[AtCoder](https://atcoder.jp)					|✔		|✔			|
|[iai](https://iai.sh.cn)						|✔		|✔			|
|[vjudge](https://vjudge.net)					|✔		|✔			|
|[Codeforces GYM](https://codeforces.com/gyms)	|✔		|✔			|

## LICENSE
Copyright 2024 xyj-curry.

MIT LICENSE