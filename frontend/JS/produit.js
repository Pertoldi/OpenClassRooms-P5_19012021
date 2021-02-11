
//OBJET Teddie
class Teddie {
    constructor(teddieObj) {
        this._id = teddieObj._id;
        this.colors = teddieObj.colors;
        this.description = teddieObj.description;
        this.imageUrl = teddieObj.imageUrl;
        this.name = teddieObj.name;
        this.price = teddieObj.price
    }
    addDom(isClickable) {
        // ajoute la carte teddie dans le DOM
        const cards = document.createElement("div");
		cards.classList.add("cards");
		if (isClickable){
        cards.innerHTML = `
			<a href="produit.html?_id=${this._id}">
			<img class="cards__img" alt="photo de l'ourson ${this.name}" src= ${this.imageUrl}>
			<div class="cards__text">
				<h2 class="cards__text--title">${this.name}</h2>
				<p class="cards__text--description">${this.description}</p>
				<span class="cards__text--price">${this.price}€</span>
			</div>
			</a>`;
		} else {
			cards.innerHTML = `
				<a>
				<img class="cards__img" alt="photo de l'ourson ${this.name}" src= ${this.imageUrl}>
				<div class="cards__text">
					<h2 class="cards__text--title">${this.name}</h2>
					<p class="cards__text--description">${this.description}</p>
					<span class="cards__text--price">${this.price}€</span>
				</div>
				</a>`;
		}
        vitrine.appendChild(cards);
	}
	addDynamiqueTitle() {
		const h1 = document.createElement("h1");
		h1.innerHTML = `Orinoco vous présente ${this.name}`;
		vitrine.appendChild(h1);
	}
	addChoiceListAndBtn() {
		//Liste a choix
		const divSelectCouleur = document.createElement("div");
		divSelectCouleur.classList.add("form-group");
		divSelectCouleur.classList.add("selectColor");

		const label = document.createElement("label");
		label.setAttribute("for", "sel1");
		label.innerHTML = `Choisissez une couleur:`;

		const select = document.createElement("select");
		select.classList.add("form-control");
		select.setAttribute("id", "sel1");

		let option;
		for (let i = 0; i < this.colors.length; i++) {
			option = option + `<option>${this.colors[i]}</option>`;
		}
		select.innerHTML = option;

		divSelectCouleur.appendChild(label);
		divSelectCouleur.appendChild(select);
		vitrine.appendChild(divSelectCouleur);

		//bouton
		const btn = document.createElement("button");
		btn.setAttribute("type", "button");
		btn.setAttribute("id", "buttonPanier");
		btn.classList.add("btn");
		btn.classList.add("btn-outline-dark");
		btn.classList.add("mb-4");
		btn.innerHTML = `Ajouter au panier`;
		vitrine.appendChild(btn);
	}
}

//OBJECT Panier
class Panier {
	constructor(panier) {
		this.panier = panier;
	}
	create() {
		localStorage.setItem("panier", this.panier);
	}
	read() {
		return localStorage.getItem("panier");
	}
	update(value) { //value = le nouvel id à ajouter dans le panier
		this.panier.push(value);
		localStorage.setItem("panier", this.panier);
	}
	delete(id) {
		let memoryPanier = panier.read().split(',');
		let indiceADelete = 0;
		for (let i in memoryPanier) {
			if (id == memoryPanier[i]) {
				indiceADelete = i;
			}
		}
		memoryPanier.splice(indiceADelete, 1);
		localStorage.setItem("panier", memoryPanier);
	}
}

//INITIALISATION
const vitrine = document.getElementById("vitrine");
var panier = new Panier([]); 

//FUNCTION GET
async function getResquest(url) {
    // let request = new Request(url);
    let response = await fetch(url);//fetch(request)

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        let json = await response.json();
        return json;
    } else {
        let message = await response.text();
        throw new Error("une erreur est survenu" + message);
    }
}

//FUNCTION CURRENT PAGE - renvoie le nom de la page
function catchPage() {
    let currentURL = document.location.href;
	let page = currentURL.split('/');
	page = page[page.length-1].split('?');
	return page[0];
}

//FUNCTION CATCH URL PARAMETRE
function getParamId() {
	let currentURL = document.location.href;
	let param = currentURL.split('/');
	param = param[param.length-1].split('?');
	param = param[1].split('=');
	return param[1];
}

//FUNCTION CREATE TABLE PANIER
function createTablePanier(myTeddies) {
	table = document.createElement("table");
	table.classList.add("table");
	let sum = 0;
	let y = 0;
	let tableText = "<thead class='table__titre'><tr><th>Nom</th><th>Prix</th><th></th></tr></thead>";
	for (let i of panier.read().split(',')) {
		for (let t = 0; t < myTeddies.length; t++) {
			if (i == myTeddies[t]._id) {
				tableText = tableText + `<tr><th>${myTeddies[t].name}</th><th>${myTeddies[t].price}€</th><th><i class="fas fa-trash-alt" id="trash${y}" name="${i}"></i></th></tr>`;
				sum = sum + myTeddies[t].price;
				y++;
			}
		}
	}
	localStorage.setItem("orderPreice", sum);
	tableText = tableText + `<tr><th>Total</th><th>${sum}€</th><th></th></tr>`
	table.innerHTML = tableText;
	vitrine.appendChild(table);
}

//FUNCTION PRETTY PRICE
function prettyPrice(price) {
	price = price/100;
	return price;
}

//FUNCTION POST
async function postRequest(url, bodyPost) {
	let response = await fetch(url, {
		method: "POST",
		body: bodyPost,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) { // if HTTP-status is 200-299
		// get the response body
		let json = await response.json();
		return json;
	} else {
		let message = await response.text();
		throw new Error("une erreur est survenu" + message);
	}
}

//FUNCTION qui prépare le body de la requete POST
function prepareBodyPost() {
	let bodyPost = {
		contact: {
			firstName: "",
			lastName: "",
			address: "",
			city: "",
			email: ""
		},
		products: []
	}

	let firstName = document.getElementById("form-prenom").value;
	bodyPost.contact.firstName = firstName;
	let lastName = document.getElementById("form-nom").value;
	bodyPost.contact.lastName = lastName;
	let email = document.getElementById("form-email").value;
	bodyPost.contact.email = email;
	let city = document.getElementById("form-ville").value;
	bodyPost.contact.city = city;
	let address = document.getElementById("form-adresse").value;
	bodyPost.contact.address = address;

	let memoryPanier = panier.read().split(',');
	for (let i = 0; i < memoryPanier.length; i++) {
		bodyPost.products.push(memoryPanier[i]);
	}

	return JSON.stringify(bodyPost);
}

//FUNCTION CONTROL FORM
function controlForm() {
	//On recupere les donnes du form
	console.log("VEFICATION DU FORMULAIRE");
	let lastName = document.getElementById("form-nom").value;
	let firstName = document.getElementById("form-prenom").value;
	let email = document.getElementById("form-email").value;
	let address = document.getElementById("form-adresse").value;
	let city = document.getElementById("form-ville").value;
	let isOk = true;
	let messageAlert = "";
	let checkString = /^[a-zA-Z]+[-| ]?[a-zA-Z]*$/;		//Accepte "mots-mots" || "mots mots"
	let checkEmail = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/;
	let checkAdrress = /[0-9]*,?[a-zA-Z]+-? ?[a-zA-Z]*/;
	let checkCity = /^[a-zA-Z]+-?[a-zA-Z]*-?[a-zA-Z]*/;
	//On test les differents imputs
	if (!checkString.test(lastName)) {
		messageAlert = "Champs nom invalide \n";
		isOk = false;
	}
	if (!checkString.test(firstName)) {
		messageAlert += "Champs prénom invalide \n";
		isOk = false;
	}
	if (!checkEmail.test(email)) {
		messageAlert += "Champs email invalide \n";
		isOk = false;
	}
	if (!checkAdrress.test(address)) {
		messageAlert += "Champs adresse invalide \n";
		isOk = false;
	}
	if (!checkCity.test(city)) {
		messageAlert += "Champs ville invalide \n";
		isOk = false;
	}

	if (!isOk) {
		alert(messageAlert);
	}
	return isOk;
}

//MAIN
async function main() {
	let datas; //Réponse GET au format JSON
	let myTeddies = []; // tableau des teddies

	//Si le panier est vide on le crée sinon on le remet à jour pour pas perdre d'information d'une page à l'autre
	if (localStorage.getItem("panier") == null) {
		panier.create();
	} else {
		if (panier.read().length != 0) {
			let memoryPanier = panier.read().split(',');
			for (let i in memoryPanier) {
				panier.update(memoryPanier[i]);
			}
		}
	}

	// Onrécupère les informations de l'API; methode GET (par défault)
	try {
		datas = await getResquest("http://localhost:3000/api/teddies");
		// on rempli la liste des teddies
		for (let i = 0; i < datas.length; i++) {
			myTeddies.push(new Teddie(datas[i]));
			myTeddies[i].price = prettyPrice(myTeddies[i].price);	
		}

		//On execute un code différent en fonction de la page courrante.
		switch (catchPage()) {
			case 'index.html':
				console.log('on est sur la page index.html');
				for (let i = 0; i < datas.length; i++) {
					myTeddies[i].addDom(true);						//On affiche tout les teddies 'true = isClickable'
				}
				console.log(myTeddies);
				break;

			case 'produit.html':
				console.log('on est sur la page produit.html');
				let teddieId = getParamId();
				for (let i = 0; i < datas.length; i++) {
					if (teddieId == myTeddies[i]._id) {
						myTeddies[i].addDynamiqueTitle();
						myTeddies[i].addDom();
						myTeddies[i].addChoiceListAndBtn();
					}
				}
				//au click du bouton:
				const bouton = document.getElementById("buttonPanier");
				bouton.addEventListener('click', function() {
					panier.update(teddieId);
					alert("Le produit à été rajouté au panier.");
					console.log('read panier: ' + panier.read());
				});
				break;

			case 'panier.html':
				console.log('on est sur la page panier.html');
				console.log("panier: ", panier," lenght: ", panier.read().split(',').length);
				createTablePanier(myTeddies);

				//a la validation du formulaire:
				const boutonValidForm = document.getElementById("validForm");
				boutonValidForm.addEventListener('click', async function(event) {
					console.log("bouton cliqué");
					event.preventDefault();
					if (controlForm()) {
						try {
							let bodyRequest = prepareBodyPost();
							postResponse = await postRequest("http://localhost:3000/api/teddies/order", bodyRequest);
							console.log("Reponse POST orderID: " + postResponse.orderId);
							localStorage.setItem("orderId", postResponse.orderId);
							//window.location.href="submit.html";
						} catch (error) {
							console.error(error);
						}
					}
				});

				//au click sur les Icones poubelles si le panier n'est pas vide:
				if (panier.read().split(',') != "") {
					for (let i = 0; i < panier.read().split(',').length; i++) {
						let trashIcon = document.getElementById(`trash${i}`);
						console.log("trashIcon: ", trashIcon);
						trashIcon.addEventListener('click', function() {
							let id = trashIcon.getAttribute("name");
							panier.delete(id);
							window.location.href="panier.html";
						});
					}
				}
				break;

			case 'submit.html':



			default:
				console.error('case: page nom trouvé -> ' + catchPage());
				break;
		}
		console.log(localStorage);
	} catch (error) {
		console.error(error);
	};
}
main();