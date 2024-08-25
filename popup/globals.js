export const websites = [
	["all", "All"],
	["qqdocs", "QQ docs", "https://docs.qq.com"],
	["luogu", "luogu", "https://www.luogu.com.cn"],
	["codeforces", "Codeforces", "https://codeforces.com"],
	["atcoder", "Atcoder", "https://atcoder.jp"],
	["iai", "iai", "https://iai.sh.cn"],
	["vjudge", "vjudge", "https://vjudge.net"],
	["cf_gym", "CF GYM", "https://codeforces.com/gym"],
	["luogu_training", "LG_training", "https://www.luogu.com.cn/training"],
	["poj", "POJ", "http://poj.org"]
];

export const websites_get_name = [
	[
		/https:\/\/www\.luogu\.com\.cn\/problem\/[PB]\d+/,
		"luoguPB",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1 > span",
		function(response, url) {
			return "luogu_" + response.trim();
		}
	],
	[
		/https:\/\/www\.luogu\.com\.cn\/problem\/[^\/]+/,
		"luoguElse",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1 > span",
		function(response, url) {
			return "luogu_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/https:\/\/codeforces\.com\/contest\/\d+\/problem\/[^\/]+/,
		"codeforces",
		"#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title",
		function(response, url) {
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
		/https:\/\/codeforces\.com\/contest\/\d+/,
		"codeforcesContest",
		"#sidebar > div:nth-child(1) > table > tbody > tr:nth-child(1) > th > a",
		function(response, url) {
			return "CF_Contest-" + response.trim();
		}
	],
	[
		/https:\/\/atcoder\.jp\/contests\/[^\/]+\/tasks\/[^\/]+/,
		"atcoder",
		"#main-container > div.row > div:nth-child(2) > span.h2",
		function(response, url) {
			let temp = response.trim().split("-");
			temp.shift();
			return "AT_" + url.split("/").pop() + temp.join("-");
		}
	],
	[
		/https:\/\/iai\.sh\.cn\/problem\/\d+/,
		"iai",
		"#__next > div > div > div.pageBody > div > div.ant-col.ant-col-18 > div:nth-child(1) > div > div:nth-child(1) > h2",
		function(response, url) {
			return "iai_" + url.split("/").pop() + " " + response.trim();
		}
	],
	[
		/https:\/\/vjudge\.net\/problem\/[^\/]+/,
		"vjudge",
		"#prob-title > h2",
		function(response, url) {
			return "vjudge_" + url.trim().split("#")[0].split("/").pop() + " " + response.trim();
		}
	],
	[
		/https:\/\/codeforces\.com\/gym\/\d+\/problem\/[^\/]+/,
		"codeforcesGym",
		"#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title",
		function(response, url) {
			let temp = url.split("/");
			let ans = temp.pop();
			temp.pop();
			ans = temp.pop() + ans;
			temp = response.trim().split(".");
			temp.shift();
			return "CF_GYM-" + ans + temp.join(".");
		}
	],
	[
		/https:\/\/codeforces\.com\/gym\/\d+/,
		"codeforcesGymDashboard",
		"#sidebar > div:nth-child(1) > table > tbody > tr:nth-child(1) > th > a",
		function(response, url) {
			return "CF_GYM_Dashboard-" + response.trim();
		}
	],
	[
		/https:\/\/www\.luogu\.com\.cn\/training\/\d+.*/,
		"luoguTraining",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1",
		function(response, url) {
			return "LG_training-" + url.split("#")[0].split("/").pop() + " " + response.trim();
		}
	],
	[
		/http:\/\/poj\.org\/problem\?id=\d+/,
		"poj",
		"body > table:nth-child(3) > tbody > tr > td > div.ptt",
		function(response, url) {
			return "poj_" + url.split("=").pop() + " " + response.trim();
		}
	],
	[
		/https:\/\/www\.luogu\.com\.cn\/contest\/\d+.*/,
		"luoguContest",
		"#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1",
		function(response, url) {
			return "LG_Contest-" + url.split("#")[0].split("/").pop() + " " + response.trim();
		}
	],
];