//INITIALISATION
const vitrine = document.getElementById("vitrine");

//OBJET 
class Teddie {
    constructor(teddieObj) {
        this._id = teddieObj._id;
        this.colors = teddieObj.colors;
        this.description = teddieObj.description;
        this.imageUrl = teddieObj.imageUrl;
    }
    addDom() {
        // pour ajouter une métode qui ajoute l'objet au dom
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = "test";
        // mettre une img + div contenant titre(h2 ou h3), description(p), prix(span)

        vitrine.appendChild(card);
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
        let teddieTest = new Teddie(datas[0]);
        console.log(teddieTest._id);
        teddieTest.addDom();
    } 
    catch (err) {
        console.error(err);
    };
    
}
main();// mettre la fonction dans un bloc try{asynFunction} catch (error) {}