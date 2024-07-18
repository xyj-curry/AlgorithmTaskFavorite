var nowid = "all";
var noweditid = -1;

const websites = [
	["all", "All"],
	["qqdocs", "QQ docs", "https://docs.qq.com"],
	["luogu", "luogu", "https://www.luogu.com.cn"],
	["codeforces", "Codeforces", "https://codeforces.com"],
	["atcoder", "Atcoder", "https://atcoder.jp"],
	["iai", "iai", "https://iai.sh.cn"],
	["vjudge", "vjudge", "https://vjudge.net"]
]

function get_name(url, tabs, callback) {
	if (/https:\/\/www\.luogu\.com\.cn\/problem\/[PB]\d+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "luogu",
			selector: "#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1 > span"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				callback("luogu_" + response.trim());
			}
		});
	} else if (/https:\/\/www\.luogu\.com\.cn\/problem\/[^\/]+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "luogu",
			selector: "#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > h1 > span"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				callback("luogu_" + url.split("/").pop() + " " + response.trim());
			}
		});
	} else if (/https:\/\/codeforces\.com\/contest\/\d+\/problem\/[^\/]+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "codeforces",
			selector: "#pageContent > div.problemindexholder > div.ttypography > div > div.header > div.title"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				let temp = url.split("/");
				let ans = temp.pop();
				temp.pop();
				ans = temp.pop() + ans;
				temp = response.trim().split(".");
				temp.shift();
				callback("CF_" + ans + temp.join("."));
			}
		});
	} else if (/https:\/\/atcoder\.jp\/contests\/[^\/]+\/tasks\/[^\/]+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "atcoder",
			selector: "#main-container > div.row > div:nth-child(2) > span.h2"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				let temp = response.trim().split("-");
				temp.shift();
				callback("AT_" + url.split("/").pop() + temp.join("-"));
			}
		});
	} else if (/https:\/\/iai\.sh\.cn\/problem\/\d+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "iai",
			selector: "#__next > div > div > div.pageBody > div > div.ant-col.ant-col-18 > div:nth-child(1) > div > div:nth-child(1) > h2"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				callback("iai_" + url.split("/").pop() + " " + response.trim());
			}
		});
	} else if (/https:\/\/vjudge\.net\/problem\/[^\/]+/.test(url)) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "gethtml",
			web: "vjudge",
			selector: "#prob-title > h2"
		}, function(response) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
			if (response.trim() == "") {
				callback(tabs[0].title);
			} else {
				callback("vjudge_" + url.split("/").pop() + " " + response.trim());
			}
		});
	} else {
		callback(tabs[0].title);
	}
}

function add_task(pos) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		let url = tabs[0].url;
		get_name(url, tabs, function(name) {
			chrome.storage.local.get({
				task_url_list: {},
				task_name_list: {}
			}, function(result) {
				let new_task_url_list = result.task_url_list;
				let new_task_name_list = result.task_name_list;
				let have = false;
				for (let key in new_task_url_list) {
					if (new_task_url_list[key] == url && new_task_name_list[key] == name) {
						have = true;
						break;
					}
				}
				if (!have) {
					if (pos == "head") {
						for (let i = Object.keys(new_task_url_list).length; i >= 1; i--) {
							new_task_name_list[i + 1] = new_task_name_list[i];
							new_task_url_list[i + 1] = new_task_url_list[i];
						}
						new_task_url_list[1] = url;
						new_task_name_list[1] = name;
					} else {
						new_task_url_list[Object.keys(new_task_url_list).length + 1] = url;
						new_task_name_list[Object.keys(new_task_name_list).length + 1] =
							name;
					}
				}
				chrome.storage.local.set({
					task_name_list: new_task_name_list,
					task_url_list: new_task_url_list
				});
			});
		});
	});
}

function add_task_head() {
	add_task("head")
}

function add_task_tail() {
	add_task("tail");
}


function back() {
	document.getElementById("add-task-head").style.display = "";
	document.getElementById("add-task-tail").style.display = "";
	document.getElementById("label-list").style.display = "flex";
	document.getElementById("task-list").style.display = "flex";
	document.getElementById("edit-task").style.display = "none";
	noweditid = -1;
}

function make_edit_task_list() {
	if (noweditid == -1) {
		return;
	}
	let editid = parseInt(noweditid);
	let edit_task_list = document.getElementById("edit-task-list");
	edit_task_list.innerHTML = "";
	chrome.storage.local.get({
		task_name_list: {}
	}, function(result) {
		let task_name_list = result.task_name_list;
		if (editid != 1) {
			let new_task = document.createElement("div");
			new_task.style = "display: flex;";
			new_task.innerHTML = `<div style="font-size: 20px; width: 45px">${editid-1}、</div>
			<div class="edit-task-name">${task_name_list[editid-1]}</div>`
			edit_task_list.appendChild(new_task);
		}
		let new_task = document.createElement("div");
		new_task.style = "display: flex;";
		new_task.innerHTML = `<div style="font-size: 20px; color: red; width: 45px">${editid}、</div>
			<div class="edit-task-name" style="color: red;">${task_name_list[editid]}</div>`
		edit_task_list.appendChild(new_task);
		if (editid != Object.keys(task_name_list).length) {
			let new_task = document.createElement("div");
			new_task.style = "display: flex;";
			new_task.innerHTML = `<div style="font-size: 20px; width: 45px">${editid+1}、</div>
			<div class="edit-task-name">${task_name_list[editid+1]}</div>`
			edit_task_list.appendChild(new_task);
		}
	});
}

function make_task_list(task_url_list, task_name_list) {
	chrome.storage.local.get({
		task_url_list: {},
		task_name_list: {}
	}, function(result) {
		let task_url_list = result.task_url_list;
		let task_name_list = result.task_name_list;
		let len = 0;
		document.getElementById("task-list").innerHTML = "";
		for (let key in task_url_list) {
			let con = false;
			for (let i = 1; i < websites.length; i++) {
				if (nowid == websites[i][0] && (!task_url_list[key].startsWith(websites[i][2]))) {
					con = true;
					break;
				}
			}
			if (con) {
				continue;
			}

			function jump_to_page() {
				chrome.tabs.create({
					url: task_url_list[key]
				});
			}

			function delete_task() {
				chrome.storage.local.get({
					task_url_list: {},
					task_name_list: {}
				}, function(result) {
					let new_task_url_list = result.task_url_list;
					let new_task_name_list = result.task_name_list;
					let have = false;
					for (let nkey in new_task_url_list) {
						if (new_task_url_list[nkey] == task_url_list[key] && new_task_name_list[
								nkey] ==
							task_name_list[key]) {
							have = true;
						}
						if (have) {
							new_task_name_list[parseInt(nkey)] = new_task_name_list[parseInt(nkey) +
								1];
							new_task_url_list[parseInt(nkey)] = new_task_url_list[parseInt(nkey) +
								1];
						}
					}
					delete new_task_name_list[Object.keys(new_task_name_list).length];
					delete new_task_url_list[Object.keys(new_task_url_list).length];
					chrome.storage.local.set({
						task_name_list: new_task_name_list,
						task_url_list: new_task_url_list
					});
				});
			}

			function edit_task() {
				document.getElementById("add-task-head").style.display = "none";
				document.getElementById("add-task-tail").style.display = "none";
				document.getElementById("label-list").style.display = "none";
				document.getElementById("task-list").style.display = "none";
				document.getElementById("edit-task").style.display = "flex";
				noweditid = key;
				document.getElementById("change-name").value = task_name_list[key];
				document.getElementById("change-url").value = task_url_list[key];
				document.getElementById("change-pos").value = "";
				make_edit_task_list();
			}

			len++;
			let new_task = document.createElement("div");
			new_task.style = "display: flex;";
			new_task.innerHTML = `<div style="font-size: 20px; word-wrap: break-word; width: 45px">${nowid=="all"?key:`${len}(${key})`}、</div>
			<div class="task">
				<span class="task-name"}>${task_name_list[key]}</span>
				<img class="task-edit" src="../images/edit.jpg" alt="edit"/>
				<img class="task-delete" src="../images/delete.jpeg" alt="delete"/>
			</div>`;
			new_task.getElementsByClassName("task-name")[0].addEventListener("click", jump_to_page);
			new_task.getElementsByClassName("task-edit")[0].addEventListener("click", edit_task);
			new_task.getElementsByClassName("task-delete")[0].addEventListener("click", delete_task);
			document.getElementById("task-list").appendChild(new_task);
		}
	});
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
	make_task_list();
	make_edit_task_list();
});

let label_list = document.getElementById("label-list");
for (let i = 0; i < websites.length; i++) {
	let new_label = document.createElement("div");
	new_label.id = websites[i][0];
	new_label.className = "label";
	new_label.innerHTML = websites[i][1];

	function change_label() {
		nowid = websites[i][0];
		make_task_list();
	}
	new_label.addEventListener("click", change_label);
	label_list.appendChild(new_label);
}


function change_name() {
	chrome.storage.local.get({
		task_name_list: {}
	}, function(result) {
		let new_task_name_list = result.task_name_list;
		new_task_name_list[noweditid] = document.getElementById("change-name").value;
		chrome.storage.local.set({
			task_name_list: new_task_name_list
		});
	});
}


function change_url() {
	chrome.storage.local.get({
		task_url_list: {}
	}, function(result) {
		let new_task_url_list = result.task_url_list;
		let next_url = document.getElementById("change-url").value;
		if (!(/.:\/\/./.test(next_url))) {
			next_url = "https://" + next_url;
		}
		document.getElementById("change-url").value = next_url;
		new_task_url_list[noweditid] = next_url;
		chrome.storage.local.set({
			task_url_list: new_task_url_list
		});
	});
}

function change_pos(next_pos, canalert) {
	chrome.storage.local.get({
		task_url_list: {},
		task_name_list: {}
	}, function(result) {
		let new_task_url_list = result.task_url_list;
		let new_task_name_list = result.task_name_list;
		if (parseInt(next_pos) > parseInt(Object.keys(new_task_name_list).length)) {
			if (canalert) {
				alert("输入的数请小于题目数量");
			}
			return;
		}
		let have = false;
		let now_name = new_task_name_list[noweditid];
		let now_url = new_task_url_list[noweditid];
		let editid = parseInt(noweditid);
		if (next_pos < editid) {
			for (let i = editid; i > next_pos; i--) {
				new_task_name_list[i] = new_task_name_list[i - 1];
				new_task_url_list[i] = new_task_url_list[i - 1];
			}
			new_task_name_list[next_pos] = now_name;
			new_task_url_list[next_pos] = now_url;
		} else {
			for (let i = editid; i < next_pos; i++) {
				new_task_name_list[i] = new_task_name_list[i + 1];
				new_task_url_list[i] = new_task_url_list[i + 1];
			}
			new_task_name_list[next_pos] = now_name;
			new_task_url_list[next_pos] = now_url;
		}
		noweditid = next_pos;
		chrome.storage.local.set({
			task_name_list: new_task_name_list,
			task_url_list: new_task_url_list
		});
	});
}

function pos_up() {
	if (noweditid == "1") {
		return;
	}
	change_pos(parseInt(noweditid) - 1, true);
}

function pos_down() {
	change_pos(parseInt(noweditid) + 1, false);
}

function submit_change_pos() {
	let next_pos = document.getElementById("change-pos").value;
	if (!(/^[0-9]+$/.test(next_pos))) {
		alert("请输入一个正整数");
		return;
	}
	next_pos = parseInt(next_pos);
	if (next_pos <= 0) {
		alert("请输入一个正整数");
		return;
	}
	if (next_pos == parseInt(noweditid)) {
		return;
	}
	change_pos(next_pos, true);
}

document.getElementById("add-task-head").addEventListener("click", add_task_head);
document.getElementById("add-task-tail").addEventListener("click", add_task_tail);
document.getElementById("back").addEventListener("click", back);
document.getElementById("submit-change-name").addEventListener("click", change_name);
document.getElementById("submit-change-url").addEventListener("click", change_url);
document.getElementById("pos-up").addEventListener("click", pos_up);
document.getElementById("pos-down").addEventListener("click", pos_down);
document.getElementById("submit-change-pos").addEventListener("click", submit_change_pos);

make_task_list();