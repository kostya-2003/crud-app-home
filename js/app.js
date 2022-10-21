"use strict";

const root = document.querySelector("#root");

const UI = {
	title: document.createElement("h1"),
	subTitle : document.createElement("p"),
	form : document.createElement("form"),
	screenBlock: document.createElement("div"),
	screenInput: document.createElement("input"),
	screenAddBtn: document.createElement("button"),
	listsBlock: document.createElement("div"),

	elementOptions () {
		console.log("element");
		this.title.textContent = "CRUD";
		this.subTitle.textContent = "Asyn Application"

		this.form.id = "app-form";
		this.screenBlock.id = "screenBlock";
		this.screenInput.type = "text";
		this.screenInput.placeholder = "Type here...";
		this.screenAddBtn.textContent = "ADD";
		this.screenAddBtn.id = "screenAddBtn";
		this.listsBlock.id = "listBlock";
	},

	appendElements () {
		root.append(this.title, this.subTitle, this.form, this.listsBlock);
		this.form.append(this.screenBlock);
		this.screenBlock.append(this.screenInput, this.screenAddBtn);
	},

	start () {
		this.elementOptions();
		this.appendElements();
	}
}

UI.start();
/* 
	Ստեղծել 4 ֆունցկիա հետևյալ անուններով՝ GET, POST, PUT, DELETE ու անել այնպես
	որպեսզի էդ 4 ֆունկցիաները առանց որևիցէ խնդրի աշխատեն մեր տվյալների բազայի ու
	ամենակարևորը մեր UI-ի հետ

	Հ․Գ․ CSS-ում փոխել եմ բոլոր կլասներն ու այդիները, որպեսզի հին կոդի հետ չաշխատեն
*/

const URL = "http://localhost:8888/todos/";

function GET(){
	fetch(URL)
	.then(data => data.json())
	.then(data => data.map((data) => {
		return createHTMLElement(data);
	}))
}

GET()

function FetchApi(){
	fetch(URL)
	.then(data => data.json())
	.then(data => changeDB(data))
}

FetchApi();

function createHTMLElement({title,id}){
	return UI.listsBlock.innerHTML += `
		<div class="listsBlockItem">
			<div class="listsBlockItemContent">
				<span >${id}</span>
				<input type="text" value="${title}" readonly>
			</div>
			<div class="buttons">
				<button class="removeBtn">Remove</button>
				<button	class="editBtn" data-ed>Edit</button>
				<button class="saveBtn" data-sv>Save</button>
			</div>
		</div>
	`;
}
	

function POST(){
	UI.form.addEventListener("submit", (e) => {
		e.preventDefault();
		const val = UI.screenInput.value.trim();
		if (val !== "") {
			fetch(URL, {
				method: "POST",
				headers: {
					"content-type":"application/json"
				},
				body: JSON.stringify({title: val})
			});
		}
		this.reset();
	})
}

POST();

function changeDB (data, method) {
	const btnArray = document.querySelectorAll(".buttons")
    const removeBtn = document.querySelectorAll(".removeBtn");
    const editBtns = document.querySelectorAll(".editBtn");
	const saveBtns = document.querySelectorAll(".saveBtn");

    removeBtn.forEach(btn => {
        btn.addEventListener("click", () =>{
            method = "Delete"
        })
    });
    
    editBtns.forEach((btn, index) => {
		btn.addEventListener("click", function () {
			const input = this.parentElement.previousElementSibling.lastElementChild;

			input.classList.add("edit");
			input.removeAttribute("readonly");

			saveBtns.forEach((saveBtn, saveBtnIndex) => {
				if (index === saveBtnIndex) {
					saveBtn.style.display = "inline-block";
					btn.style.display = "none";
                    
				}
                saveBtn.addEventListener("click", () => {
                    method = "PUT";
                })
			}) 
		});
	});

	btnArray.forEach(btn => {
		btn.addEventListener("click", function () {	
			data.forEach(todo => {
				const fakeId = btn.previousElementSibling.firstElementChild.textContent;
				const forEddited = btn.previousElementSibling.lastElementChild;
				if (parseInt(fakeId) === todo.id) {
					fetch(`${URL}${todo.id}`, {
						method: method,
						headers: {
							"content-type":"application/json"
						},
						body: method === "PUT" ? JSON.stringify({title: forEddited.value.trim()}) : ""
					});
				}
			})
		});
	});
}