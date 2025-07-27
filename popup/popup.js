import {
	gdata,
	websites_get_name
} from "./globals.js";

import {
	back_to_task_list,
	make_task_list,
	make_edit_task_list,
	make_label_list
} from "./ui.js";

function task_list_include(id, name, url) {
	for (let i = 0; i < id; i++) {
		if (gdata.task_name_list[i] === name && gdata.task_url_list[i] === url) {
			return true;
		}
	}
	return false;
}

function unique_task_list() {
	for (let i = gdata.task_name_list.length - 1; i >= 0; i--) {
		if (task_list_include(i, gdata.task_name_list[i], gdata.task_url_list[i])) {
			gdata.task_name_list.splice(i, 1);
			gdata.task_url_list.splice(i, 1);
		}
	}
}

function get_name(tabs, callback) {
	for (let i = 0; i < websites_get_name.length; i++) {
		if (websites_get_name[i][0].test(tabs[0].url)) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "gethtml",
				web: websites_get_name[i][1],
				selector: websites_get_name[i][2]
			}, (response) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
					callback(tabs[0].title);
					return;
				}
				if (typeof (response) != "string" || response.trim() == "") {
					callback(tabs[0].title);
				} else {
					callback(websites_get_name[i][3](response, tabs[0].url));
				}
			});
			return;
		}
	}
	callback(tabs[0].title);
}

function add_task(pos) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, (tabs) => {
		if (!tabs.length) {
			console.error("未找到活跃标签页");
			return;
		}
		let url = tabs[0].url;
		get_name(tabs, (name) => {
			if (!task_list_include(gdata.task_name_list.length, name, url)) {
				if (pos == "head") {
					gdata.task_name_list.unshift(name);
					gdata.task_url_list.unshift(url);
				} else {
					gdata.task_name_list.push(name);
					gdata.task_url_list.push(url);
				}
				chrome.storage.local.set({
					task_name_list: gdata.task_name_list,
					task_url_list: gdata.task_url_list
				});
			}
		});
	});
}

function add_task_head() {
	add_task("head")
}

function add_task_tail() {
	add_task("tail");
}

function change_name() {
	gdata.task_name_list[gdata.noweditid] = document.getElementById("change-name").value;
	chrome.storage.local.set({
		task_name_list: gdata.task_name_list
	});
}

function change_url() {
	let next_url = document.getElementById("change-url").value.trim();
	if (!next_url) return;
	try {
		new URL(next_url);
	} catch {
		next_url = `https://${next_url}`;
		try {
			new URL(next_url);
		} catch {
			alert("URL格式无效");
			return;
		}
	}
	document.getElementById("change-url").value = next_url;
	gdata.task_url_list[gdata.noweditid] = next_url;
	chrome.storage.local.set({
		task_url_list: gdata.task_url_list
	});
}

function change_pos(next_pos) {
	let now_name = gdata.task_name_list[gdata.noweditid];
	let now_url = gdata.task_url_list[gdata.noweditid];
	gdata.task_name_list.splice(gdata.noweditid, 1);
	gdata.task_url_list.splice(gdata.noweditid, 1);
	gdata.task_name_list.splice(next_pos, 0, now_name);
	gdata.task_url_list.splice(next_pos, 0, now_url);
	gdata.noweditid = next_pos;
	chrome.storage.local.set({
		task_name_list: gdata.task_name_list,
		task_url_list: gdata.task_url_list
	});
}

function pos_up() {
	if (gdata.noweditid == 0) {
		return;
	}
	change_pos(gdata.noweditid - 1);
}

function pos_down() {
	if (gdata.noweditid == gdata.task_name_list.length - 1) {
		return;
	}
	change_pos(gdata.noweditid + 1);
}

function submit_change_pos() {
	let next_pos = document.getElementById("change-pos").value;
	next_pos = parseInt(next_pos);
	if (isNaN(next_pos) || next_pos <= 0) {
		alert("请输入一个正整数");
		return;
	}
	if (next_pos > gdata.task_name_list.length) {
		alert(`输入的位置请小于等于${gdata.task_name_list.length}`);
		document.getElementById("change-pos").value = gdata.task_name_list.length;
		return;
	}
	next_pos--;
	if (next_pos == gdata.noweditid) {
		return;
	}
	change_pos(next_pos);
}

function export_task_list() {
	let task_list = {
		"task_name_list": gdata.task_name_list,
		"task_url_list": gdata.task_url_list
	};
	const blob = new Blob([JSON.stringify(task_list)], {
		"type": "application/json"
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "task_list.json";
	a.style = "display: none";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function import_task_list_cover() {
	const input = document.createElement("input");
	input.type = "file";
	input.style = "display: none";
	input.accept = ".json";
	input.addEventListener("change", () => {
		const file = input.files[0];
		const reader = new FileReader();
		reader.addEventListener("loadend", () => {
			let task_list;
			try {
				task_list = JSON.parse(reader.result);
			} catch (e) {
				alert("导入失败：JSON格式错误");
				console.error("解析错误：", e);
				return;
			}
			if (!Array.isArray(task_list.task_url_list) || !Array.isArray(task_list.task_url_list)) {
				alert("导入数据格式错误：缺少任务列表");
				return;
			}
			if (task_list.task_url_list.length !== task_list.task_url_list.length) {
				alert("导入数据错误：名称与URL数量不匹配");
				return;
			}
			gdata.task_url_list = task_list.task_url_list;
			gdata.task_name_list = task_list.task_name_list;
			unique_task_list();
			chrome.storage.local.set({
				task_name_list: gdata.task_name_list,
				task_url_list: gdata.task_url_list
			});
		});
		reader.readAsText(file);
	});
	document.body.appendChild(input);
	input.click()
	document.body.removeChild(input);
}

function import_task_list_insert() {
	const input = document.createElement("input");
	input.type = "file";
	input.style = "display: none";
	input.accept = ".json";
	input.addEventListener("change", () => {
		const file = input.files[0];
		const reader = new FileReader();
		reader.addEventListener("loadend", () => {
			let task_list;
			try {
				task_list = JSON.parse(reader.result);
			} catch (e) {
				alert("导入失败：JSON格式错误");
				console.error("解析错误：", e);
				return;
			}
			if (!Array.isArray(task_list.task_url_list) || !Array.isArray(task_list.task_url_list)) {
				alert("导入数据格式错误：缺少任务列表");
				return;
			}
			if (task_list.task_url_list.length !== task_list.task_url_list.length) {
				alert("导入数据错误：名称与URL数量不匹配");
				return;
			}
			let index = document.getElementById("import-task-list-index").value;
			index = parseInt(index);
			if (isNaN(index) || index <= 0) {
				alert("请输入一个正整数");
				return;
			}
			if (index > gdata.task_name_list.length) {
				alert(`输入的位置请小于等于${gdata.task_name_list.length}`);
				return;
			}
			gdata.task_name_list.splice(index - 1, 0, ...task_list.task_name_list)
			gdata.task_url_list.splice(index - 1, 0, ...task_list.task_url_list)
			unique_task_list();
			chrome.storage.local.set({
				task_name_list: gdata.task_name_list,
				task_url_list: gdata.task_url_list
			});
		});
		reader.readAsText(file);
	});
	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);
}

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName !== "local") {
		return;
	}
	const hasRelevantChange = changes.task_name_list || changes.task_url_list;
	if (hasRelevantChange) {
		if (gdata.noweditid === -1) {
			make_task_list();
		} else {
			make_edit_task_list();
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("add-task-head").addEventListener("click", add_task_head);
	document.getElementById("add-task-tail").addEventListener("click", add_task_tail);
	document.getElementById("back-to-task-list").addEventListener("click", back_to_task_list);
	document.getElementById("submit-change-name").addEventListener("click", change_name);
	document.getElementById("change-name").addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			change_name();
		}
	});
	document.getElementById("submit-change-url").addEventListener("click", change_url);
	document.getElementById("change-url").addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			change_url();
		}
	});
	document.getElementById("pos-up").addEventListener("click", pos_up);
	document.getElementById("pos-down").addEventListener("click", pos_down);
	document.getElementById("submit-change-pos").addEventListener("click", submit_change_pos);
	document.getElementById("change-pos").addEventListener("keydown", (event) => {
		if (event.key == "Enter") {
			submit_change_pos();
		}
	});
	document.getElementById("export-task-list").addEventListener("click", export_task_list);
	document.getElementById("import-task-list-cover").addEventListener("click", import_task_list_cover);
	document.getElementById("import-task-list-insert").addEventListener("click", import_task_list_insert);

	make_label_list();

	chrome.storage.local.get(["task_name_list", "task_url_list"]).then((result) => {
		gdata.task_name_list = result.task_name_list;
		gdata.task_url_list = result.task_url_list;

		if (gdata.task_name_list === undefined) {
			gdata.task_name_list = [];
			gdata.task_url_list = [];
			chrome.storage.local.set({
				task_name_list: gdata.task_name_list,
				task_url_list: gdata.task_url_list
			});
		}

		make_task_list();
	});

});
