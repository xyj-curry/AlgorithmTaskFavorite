export const gdata = {
	nowlabelid: 0,
	noweditid: -1,
	task_name_list: [],
	task_url_list: []
}

export const websites = [
	["all", "All", ""],
	["qqdocs", "QQ docs", "https://docs.qq.com"],
	["luogu", "luogu", "https://www.luogu.com.cn"],
	["codeforces", "Codeforces", "https://codeforces.com"],
	["atcoder", "Atcoder", "https://atcoder.jp"],
	["iai", "iai", "https://iai.sh.cn"],
	["vjudge", "vjudge", "https://vjudge.net"],
	["cf_gym", "CF GYM", "https://codeforces.com/gym"],
	["luogu_training", "LG training", "https://www.luogu.com.cn/training"],
	["poj", "POJ", "http://poj.org"],
	["nowcoder", "nowcoder", "https://ac.nowcoder.com"],
	["qoj", "QOJ", "https://qoj.ac"],
	["cnblog", "cnblog", "https://www.cnblogs.com"]
];

export const websites_get_name = [
	[
		/^https:\/\/www\.luogu\.com\.cn\/problem\/[^\/]+$/,
		"luogu",
		"#app > div.main-container.lside-nav > header > div > div > h1",
		function (response, url) {
			return "luogu_" + response.trim();
		}
	],
	[
		/^https:\/\/codeforces\.com\/contest\/\d+\/problem\/[^\/]+$/,
		"codeforces",
		"#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title",
		function (response, url) {
			url = url.trim().split("#")[0];
			let temp = url.split("/");
			let ans = temp.pop();
			temp.pop();
			ans = temp.pop() + ans;
			temp = response.trim().split(".");
			temp.shift();
			return "CF_" + ans + temp.join(".");
		}
	],
	[
		/^https:\/\/codeforces\.com\/contest\/\d+$/,
		"codeforcesContest",
		"#sidebar > div:nth-child(1) > table > tbody > tr:nth-child(1) > th > a",
		function (response, url) {
			return "CF-Contest_" + response.trim();
		}
	],
	[
		/^https:\/\/atcoder\.jp\/contests\/[^\/]+\/tasks\/[^\/]+$/,
		"atcoder",
		"#main-container > div.row > div:nth-child(2) > span.h2",
		function (response, url) {
			let temp = response.trim().split("-");
			temp.shift();
			url = url.trim().split("#")[0];
			return "AT_" + url.split("/").pop() + temp.join("-");
		}
	],
	[
		/^https:\/\/iai\.sh\.cn\/problem\/\d+$/,
		"iai",
		"#__next > div > div > div.pageBody > div > div.ant-col.ant-col-18 > div:nth-child(1) > div > div:nth-child(1) > h2",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "iai_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/^https:\/\/vjudge\.net\/problem\/[^\/]+$/,
		"vjudge",
		"#prob-title > h2",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "vjudge_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/^https:\/\/codeforces\.com\/gym\/\d+\/problem\/[^\/]+$/,
		"codeforcesGym",
		"#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title",
		function (response, url) {
			url = url.trim().split("#")[0];
			let temp = url.split("/");
			let ans = temp.pop();
			temp.pop();
			ans = temp.pop() + ans;
			temp = response.trim().split(".");
			temp.shift();
			return "CF-GYM_" + ans + temp.join(".");
		}
	],
	[
		/^https:\/\/codeforces\.com\/gym\/\d+$/,
		"codeforcesGymDashboard",
		"#sidebar > div:nth-child(1) > table > tbody > tr:nth-child(1) > th > a",
		function (response, url) {
			return "CF-GYM-Dashboard_" + response.trim();
		}
	],
	[
		/^https:\/\/www\.luogu\.com\.cn\/training\/\d+(#[a-zA-Z]*)?$/,
		"luoguTraining",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "LG-training_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/^http:\/\/poj\.org\/problem\?id=\d+$/,
		"poj",
		"body > table:nth-child(3) > tbody > tr > td > div.ptt",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "poj_" + url.split("=").pop() + " " + response.trim();
		}
	],
	[
		/^https:\/\/www\.luogu\.com\.cn\/contest\/\d+(#[a-zA-Z]*)?$/,
		"luoguContest",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "LG-Contest_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/^https:\/\/ac\.nowcoder\.com\/acm\/problem\/\d+$/,
		"nowcoder",
		"body > div.nk-container.nk-acm-container > div.header-bar > div.header-left > div",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "NC_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/^https:\/\/ac\.nowcoder\.com\/acm\/contest\/\d+\/[a-zA-Z]+$/,
		"nowcoder",
		"body > div.nk-container.nk-acm-container > div.header-bar > div.header-left > div",
		function (response, url) {
			url = url.trim().split("#")[0];
			let temp = url.split("/");
			let ans = temp.pop();
			ans = temp.pop() + ans;
			return "NC_" + ans + " " + response.trim();
		}
	],
	[
		/^https:\/\/qoj\.ac\/problem\/\d+$/,
		"qoj",
		"body > div.container > div.uoj-content > h1",
		function (response, url) {
			let temp = response.split(".");
			temp.shift();
			url = url.trim().split("#")[0];
			return "qoj_" + url.split("/").pop() + " " + temp.join(".").trim();
		}
	],
	[
		/^https:\/\/qoj\.ac\/contest\/\d+\/problem\/\d+$/,
		"qoj",
		"body > div.container > div.uoj-content > div.page-header.row > h1.col-md-7.text-center",
		function (response, url) {
			let temp = response.split(".");
			temp.shift();
			url = url.trim().split("#")[0];
			return "qoj_" + url.split("/").pop() + " " + temp.join(".").trim();
		}
	],
	[
		/^https:\/\/www\.cnblogs\.com\/[^\/]+\/(p)|(articles)\/\d+$/,
		"cnblog",
		"#cb_post_title_url",
		function (response, url) {
			url = url.trim().split("#")[0];
			return "cnblog_" + url.split("/")[3] + " " + response.trim();
		}
	]
];