import {
	websites,
	websites_get_name
} from "./globals.js";

var nowid = "all";
var noweditid = -1;

function get_name(tabs, callback) {
	for (let i = 0; i < websites_get_name.length; i++) {
		if (websites_get_name[i][0].test(tabs[0].url)) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "gethtml",
				web: websites_get_name[i][1],
				selector: websites_get_name[i][2]
			}, function(response) {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
				if (typeof(response) != "string" || response.trim() == "") {
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
	}, function(tabs) {
		let url = tabs[0].url;
		get_name(tabs, function(name) {
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
	document.getElementById("import-export-task-list").style.display = "";
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
			if (nowid != "all") {
				let tmp = 0,
					realpre;
				for (let i = 1; i < websites.length; i++) {
					if (websites[i][0] == nowid) {
						realpre = websites[i][2];
					}
					if (task_url_list[key].startsWith(websites[i][2])) {
						if (websites[i][2].startsWith(websites[tmp][2]) || tmp == 0) {
							tmp = i;
						}
					}
				}
				if (tmp == 0 || websites[tmp][2] != realpre) {
					continue;
				}
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
				document.getElementById("import-export-task-list").style.display = "none";
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
		document.getElementById(nowid).style.backgroundColor = "";
		nowid = websites[i][0];
		new_label.style.backgroundColor = "grey";
		make_task_list();
	}
	new_label.addEventListener("click", change_label);
	label_list.appendChild(new_label);
}
document.getElementById("all").style.backgroundColor = "grey";

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
		if (next_pos > parseInt(Object.keys(new_task_name_list).length)) {
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

function export_task_list() {
	chrome.storage.local.get({
		task_url_list: {},
		task_name_list: {}
	}, function(result) {
		let task_url_list = result.task_url_list;
		let task_name_list = result.task_name_list;
		let task_list = {};
		for (let i in task_name_list) {
			task_list[i] = [
				task_name_list[i],
				task_url_list[i]
			];
		}
		const blob = new Blob([JSON.stringify(task_list)], {
			'type': 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'task_list.json';
		a.style =
			'display: none';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	});
}

function import_task_list_cover() {
	const input = document.createElement('input');
	input.type = 'file';
	input.style = 'display: none';
	input.accept = '.json';
	input.addEventListener("change", function() {
		const file = input.files[0];
		const reader = new FileReader();
		reader.addEventListener("loadend", function() {
			let task_list = JSON.parse(reader.result);
			if (!task_list) {
				alert("导入失败");
				return;
			}
			let new_task_name_list = {};
			let new_task_url_list = {};
			for (let i in task_list) {
				new_task_name_list[i] = task_list[i][0];
				new_task_url_list[i] = task_list[i][1];
			}
			chrome.storage.local.set({
				task_name_list: new_task_name_list,
				task_url_list: new_task_url_list
			});
		});
		reader.readAsText(file);
	});
	document.body.appendChild(input);
	input.click()
	document.body.removeChild(input);
}

function include(task_list, task_name, task_url) {
	for (let i = 0; i < task_list.length; i++) {
		if (task_list[i][0] == task_name && task_list[i][1] == task_url) {
			return true;
		}
	}
	return false;
}

function import_task_list_insert() {
	const input = document.createElement('input');
	input.type = 'file';
	input.style = 'display: none';
	input.accept = '.json';
	input.addEventListener("change", function() {
		const file = input.files[0];
		const reader = new FileReader();
		reader.addEventListener("loadend", function() {
			let task_list = JSON.parse(reader.result);
			if (!task_list) {
				alert("导入失败");
				return;
			}
			let index = document.getElementById("import-task-list-index").value;
			if (!(/^[0-9]+$/.test(index))) {
				alert("请输入一个正整数");
				return;
			}
			index = parseInt(index);
			if (index <= 0) {
				alert("请输入一个正整数");
				return;
			}
			chrome.storage.local.get({
				task_name_list: {},
				task_url_list: {}
			}, function(result) {
				let task_name_list = result.task_name_list;
				let task_url_list = result.task_url_list;
				let new_task_name_list = {};
				let new_task_url_list = {};
				if (index != 1 && index > parseInt(Object.keys(task_name_list).length)) {
					alert("输入的数请小于题目数量");
					return;
				}
				let task = [];
				let tot = 0;
				for (let i = 1; i < index; i++) {
					if (include(task, task_name_list[i], task_url_list[i])) {
						continue;
					}
					task.push([task_name_list[i], task_url_list[i]]);
					tot++;
					new_task_name_list[tot] = task_name_list[i];
					new_task_url_list[tot] = task_url_list[i];
				}
				for (let i in task_list) {
					if (include(task, task_list[i][0], task_list[i][1])) {
						continue;
					}
					task.push([task_list[i][0], task_list[i][1]]);
					tot++;
					new_task_name_list[tot] = task_list[i][0];
					new_task_url_list[tot] = task_list[i][1];
				}
				for (let i = index; i <= parseInt(Object.keys(task_name_list).length); i++) {
					if (include(task, task_name_list[i], task_url_list[i])) {
						continue;
					}
					task.push([task_name_list[i], task_url_list[i]]);
					tot++;
					new_task_name_list[tot] = task_name_list[i];
					new_task_url_list[tot] = task_url_list[i];
				}
				chrome.storage.local.set({
					task_name_list: new_task_name_list,
					task_url_list: new_task_url_list
				});
			});
		});
		reader.readAsText(file);
	});
	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);
}

document.getElementById("add-task-head").addEventListener("click", add_task_head);
document.getElementById("add-task-tail").addEventListener("click", add_task_tail);
document.getElementById("back").addEventListener("click", back);
document.getElementById("submit-change-name").addEventListener("click", change_name);
document.getElementById("change-name").addEventListener("keydown", function(event) {
	if (event.key == "Enter") {
		change_name();
	}
});
document.getElementById("submit-change-url").addEventListener("click", change_url);
document.getElementById("change-url").addEventListener("keydown", function(event) {
	if (event.key == "Enter") {
		change_url();
	}
});
document.getElementById("pos-up").addEventListener("click", pos_up);
document.getElementById("pos-down").addEventListener("click", pos_down);
document.getElementById("submit-change-pos").addEventListener("click", submit_change_pos);
document.getElementById("change-pos").addEventListener("keydown", function(event) {
	if (event.key == "Enter") {
		submit_change_pos();
	}
});
document.getElementById("export-task-list").addEventListener("click", export_task_list);
document.getElementById("import-task-list-cover").addEventListener("click", import_task_list_cover);
document.getElementById("import-task-list-insert").addEventListener("click", import_task_list_insert);

make_task_list();