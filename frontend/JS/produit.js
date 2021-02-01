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
function catchParam() {
	let currentURL = document.location.href;
	let param = currentURL.split('/');
	param = param[param.length-1].split('?');
	param = param[1].split('=');
	return param[1];
}

//MAIN
async function main() {
	let datas; //Réponse GET au format JSON
	let myTeddies = []; // tableau des teddies
	var userPanier = []; // liste des éléments contenue dans le panier

	//Si le panier est vide on le crée
	if (localStorage.length == 0) {
		localStorage.setItem("userPanier", userPanier);
		console.log("Le panier à été créer!");
	} else {
		if (localStorage.getItem('userPanier') != '') {
			let memoryPanier = localStorage.getItem('userPanier').split(',');
			for (let i = 0; i < memoryPanier.length; i++) {
				userPanier.push(memoryPanier[i]);
			}
			console.log("Le panier exite déjà! userPanier = " + userPanier);
		}
	}

	// Onrécupère les informations de l'API; methode GET
	try {
		datas = await getResquest("http://localhost:3000/api/teddies");
		console.log(datas);
	} catch (err) {
		console.error(err);
	};

	// on rempli la liste des teddies
	for (let i = 0; i < datas.length; i++) {
		myTeddies.push(new Teddie(datas[i]));		
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
			let teddieId = catchParam();
			let currentId;
			for (let i = 0; i < datas.length; i++) {
				if (teddieId == myTeddies[i]._id) {
					myTeddies[i].addDynamiqueTitle();
					myTeddies[i].addDom();
					myTeddies[i].addChoiceListAndBtn();
					currentId = myTeddies[i]._id;
				}
			}
			//au click du bouton:
			const bouton = document.getElementById("buttonPanier");
			bouton.addEventListener('click', function() {
				console.log("Le bouton à été clické");
				userPanier.push(currentId);
				localStorage.setItem("userPanier", userPanier);
				console.log("user panier :" + userPanier);
				console.log("local storage: " + localStorage.getItem('userPanier'));
			});
			break;

		case 'panier.html':
			console.log('on est sur la page panier.html');

			break;

		default:
			console.log('case: page nom trouvé -> ' + catchPage());
			break;
	}
	//localStorage.clear();
	console.log(localStorage);
}
main();