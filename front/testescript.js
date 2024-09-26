document.getElementById("praTestar").addEventListener("click", exibirAtivs);

function exibirAtivs()  {
    let listaAulas = document.getElementById("fetched");
    let div = document.createElement("div");
    for (let x = 0; x < 1;x++)  {
        div.classList.add("bloco");
        let thumbnail = document.createElement("img");
        thumbnail.src = "banjo.jpg";
        thumbnail.style.height = "30%"
        thumbnail.style.width = "50%";

        let title = document.createElement("span");
        title.textContent = "Insira nome da aula"
        title.style.marginTop = "10px";
        title.style.marginBottom = "10px";
        title.classList.add("poppins-extrabold");

        let desc = document.createElement("span");
        desc.textContent = "Insira descrição da aula";

        let dateSymbol = document.createElement("span");
        dateSymbol.classList.add("material-symbols-outlined");
        dateSymbol.textContent = "calendar_month";

        let dateDate = document.createElement("span");
        dateDate.textContent = "XX/XX/XXXX"; 

        let dateText = document.createElement("span");
        dateText.style.marginTop = "auto";
        dateText.style.marginRight = "auto";

        let author = document.createElement("span");
        author.textContent = "Macacos me mordam!";
        author.style.marginRight = "auto";

        dateText.appendChild(dateSymbol);
        dateText.appendChild(dateDate);

        if (thumbnail != null)  {
            div.appendChild(thumbnail);
        }
        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(dateText);
        div.appendChild(author);

        listaAulas.appendChild(div);
    }
}