import { gdata, websites } from "./globals.js";

function open_task() {
    document.getElementById("task").style.display = "";
}

function open_edit_task() {
    document.getElementById("edit-task").style.display = "flex";
}

function open_setting() {
    document.getElementById("setting").style.display = "";
}

function close_task() {
    document.getElementById("task").style.display = "none";
}

function close_edit_task() {
    document.getElementById("edit-task").style.display = "none";
}

function close_setting() {
    document.getElementById("setting").style.display = "none";
}

export function back_to_task_list() {
    close_edit_task();
    open_task();
    gdata.noweditid = -1;
    make_task_list();
}

function add_edit_task(fragment, id, task_name, isnowedit) {
    let new_edit_task = document.createElement("div");
    if (isnowedit) {
        new_edit_task.className = "task-nowedit-box";
    } else {
        new_edit_task.className = "task-edit-box";
    }
    new_edit_task.innerHTML = `<div class="task_number">${id + 1}</div>
	<div class="edit-task-name"></div>`;
    new_edit_task.querySelector("div.edit-task-name").textContent = task_name;
    fragment.appendChild(new_edit_task);
    let task_separator = document.createElement("div");
    task_separator.className = "task-separator";
    fragment.appendChild(task_separator);
}

export function make_edit_task_list() {
    if (gdata.noweditid === -1) {
        return;
    }
    document.getElementById("change-name").value =
        gdata.task_name_list[gdata.noweditid];
    document.getElementById("change-url").value =
        gdata.task_url_list[gdata.noweditid];
    document.getElementById("change-pos").value = "";

    let edit_task_list = document.getElementById("edit-task-list");
    let fragment = document.createDocumentFragment();
    edit_task_list.innerHTML = "";
    if (gdata.noweditid != 0) {
        add_edit_task(
            fragment,
            gdata.noweditid - 1,
            gdata.task_name_list[gdata.noweditid - 1],
            false
        );
    }
    add_edit_task(
        fragment,
        gdata.noweditid,
        gdata.task_name_list[gdata.noweditid],
        true
    );
    if (gdata.noweditid != gdata.task_name_list.length - 1) {
        add_edit_task(
            fragment,
            gdata.noweditid + 1,
            gdata.task_name_list[gdata.noweditid + 1],
            false
        );
    }
    if (fragment.lastChild?.className === "task-separator") {
        fragment.removeChild(fragment.lastChild);
    }
    edit_task_list.appendChild(fragment);
}

export function make_task_list() {
    if (gdata.noweditid != -1) {
        return;
    }
    let task_list = document.getElementById("task-list");
    let fragment = document.createDocumentFragment();
    let len = 0;
    task_list.innerHTML = "";
    for (let i = 0; i < gdata.task_name_list.length; i++) {
        if (!gdata.task_url_list[i].startsWith(websites[gdata.nowlabelid][2])) {
            continue;
        }

        function jump_to_page() {
            chrome.tabs.create({
                url: gdata.task_url_list[i],
            });
        }

        function delete_task() {
            gdata.task_name_list.splice(i, 1);
            gdata.task_url_list.splice(i, 1);
            chrome.storage.local.set({
                task_name_list: gdata.task_name_list,
                task_url_list: gdata.task_url_list,
            });
        }

        function edit_task() {
            close_task();
            open_edit_task();
            gdata.noweditid = i;
            make_edit_task_list();
        }

        len++;
        let new_task = document.createElement("div");
        new_task.className = "task-box";
        new_task.innerHTML = `<div class="task_number">${
            gdata.nowlabelid == 0 ? `${i + 1}` : `${len}<br>(${i + 1})`
        }</div>
		<div class="task-name-box">
			<span class="task-name"></span>
			<img class="task-edit" src="../images/edit.jpg" alt="edit"/>
			<img class="task-delete" src="../images/delete.jpeg" alt="delete"/>
		</div>`;
        new_task.querySelector(
            "div.task-name-box > span.task-name"
        ).textContent = gdata.task_name_list[i];
        new_task
            .getElementsByClassName("task-name")[0]
            .addEventListener("click", jump_to_page);
        new_task
            .getElementsByClassName("task-edit")[0]
            .addEventListener("click", edit_task);
        new_task
            .getElementsByClassName("task-delete")[0]
            .addEventListener("click", delete_task);
        fragment.appendChild(new_task);

        let task_separator = document.createElement("div");
        task_separator.className = "task-separator";
        fragment.appendChild(task_separator);
    }
    if (fragment.lastChild?.className === "task-separator") {
        fragment.removeChild(fragment.lastChild);
    }
    task_list.appendChild(fragment);
}

export function make_label_list() {
    let label_list = document.getElementById("label-list");
    for (let i = 0; i < websites.length; i++) {
        let new_label = document.createElement("div");
        new_label.id = websites[i][0];
        new_label.className = "label";
        new_label.textContent = websites[i][1];

        function change_label() {
            document.getElementById(websites[gdata.nowlabelid][0]).className =
                "label";
            gdata.nowlabelid = i;
            new_label.className = "now-label";
            make_task_list();
        }
        new_label.addEventListener("click", change_label);

        label_list.appendChild(new_label);
    }
    document.getElementById("all").className = "now-label";
}
