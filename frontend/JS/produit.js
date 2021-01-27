//INITIALISATION
const vitrine = document.getElementById("vitrine");

//OBJET 
class Teddie {
    constructor(teddieObj) {
        this._id = teddieObj._id;
        this.colors = teddieObj.colors;
        this.description = teddieObj.description;
        this.imageUrl = teddieObj.imageUrl;
        this.name = teddieObj.name;
        this.price = teddieObj.price;
    }
    addDom() {
        // ajoute la carte teddie dans le DOM
        const cards = document.createElement("div");
        cards.classList.add("cards");
        cards.innerHTML = `
        <img class="cards__img" alt="photo d ourson en peluche" src= ${this.imageUrl}>
        <div class="cards__text">
            <h2 class="cards__text--title">${this.name}</h2>
            <p class="cards__text--description">${this.description}</p>
            <span class="cards__text--price">${this.price}€</span>
        </div>
        `;
        vitrine.appendChild(cards);
    }
}

//FUNCTION GET
async function getResquest(url) {
    let maRequest = new Request(url);
    let response = await fetch(maRequest);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        console.log('tout est OK!');
        let json = await response.json();
        return json;
    } else {
        let message = await response.text();
        console.log('testtest');
        throw new Error("une erreur est survenu" + message);
    }
}

//MAIN
async function main() {
    let datas;
    try {
        datas = await getResquest("http://localhost:3000/api/teddies");
        console.log(datas);

        //Genration des teddies
        let myTeddie = [];
        for (let i = 0; i < datas.length; i++) {
            myTeddie.push(new Teddie(datas[i]));
            myTeddie[i].addDom();
            console.log('test');
        }
    } 
    catch (err) {
        console.error(err);
    };   
}
main();