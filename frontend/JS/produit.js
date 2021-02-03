//INITIALISATION
const vitrine = document.getElementById("vitrine");

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

class Panier  {
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
	delete() {

	}
}
//FUNCTION GET
async function getResquest(url) {
    let maRequest = new Request(url);
    let response = await fetch(maRequest);

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

//FUNCTION PRETTY PRICE
function prettyPrice(price) {
	price = price/100;
	return price;
}

//MAIN
async function main() {
	let datas; //Réponse GET au format JSON
	let myTeddies = []; // tableau des teddies
	var panier = new Panier([]); 

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

	// Onrécupère les informations de l'API; methode GET
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
				const table = document.createElement("table");
				let sum = 0;
				let tableText = "<tr><th>Nom</th><th>Prix</th></tr>";
				for (let i of panier.read().split(',')) {
					for (let t = 0; t < myTeddies.length; t++) {
						if (i == myTeddies[t]._id) {
							tableText = tableText + `<tr><th>${myTeddies[t].name}</th><th>${myTeddies[t].price}€</th></tr>`;
							sum = sum + myTeddies[t].price;
						}	
					}
				}
				tableText = tableText + `<tr><th>Total</th><th>${sum}€</th></tr>`
				table.innerHTML = tableText;
				vitrine.appendChild(table);

				// TODO: 
				// formulaire post avec: nom, prénom, adresse, ville, e-mail        en HTML
				// bouton submit 
				
				break;

			default:
				console.log('case: page nom trouvé -> ' + catchPage());
				break;
		}
		//localStorage.clear();
		console.log(localStorage);
	} catch (err) {
		console.error(err);
	};
}
main();