document.getElementById('updateUrlLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // Get the new PID value from the link's data attribute
    const pid = this.getAttribute('data-pid');

    // Create a URLSearchParams object based on the current query string
    const params = new URLSearchParams(window.location.search);

    // Set the new PID parameter
    params.set('pid', pid);

    // Update the URL without reloading the page
    //window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    const newUrl = `${window.location.pathname}?${params}`;
    window.location.href = newUrl;

});

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    const pid = params.get("pid");

    if (tag) {

        open_that_json(tag, pid);

    } else {
        document.getElementById("resultados").textContent = "Nenhuma tag fornecida.";
    }
});

var has_or_not = 0;

async function open_that_json(tag, pid) {
    console.log("lendo open json")
    const response = await fetch('http://localhost:5000/api/projetos');
    const datalist = await response.json();

    //populateHeader(datalist);

    has_or_not = 0;

    check_for_tag(datalist, tag, pid);

    if (has_or_not == 1) {
        document.getElementById("resultados").textContent = `Resultados para: ${tag}`;
        document.getElementById("pesquisa").placeholder = tag;
        //document.getElementById("fetched").textContent = `Resultados para: ${tag}`;
    } else {
        document.getElementById("resultados").textContent = `Não foi encontrado nada com a tag ${tag}.`;
    }

}

function check_for_tag(projetos, target, pid) {
    console.log("lendo check tag")
    const section = document.getElementById("fetched");
    //const articles = obj.artigos;

    //const maximumthing = Math.min(pid, articles);

    var i = -1;

    for (const projeto of projetos) {
        i = i+1;
        if ( (i < pid) || (i > pid+51) ){
            continue;
        }

        
        //for (const i = 0; i < maximumthing; i += 1) {


        //const tagmax = arti.tags;
        for (const tag of projeto.tags) {

            if (tag.toLowerCase() == target.toLowerCase()) {
                console.log("tem sim")
                has_or_not = 1;

                const myArticle = document.createElement("h2");
                //myArticle.textContent = arti.titulo;
                myArticle.style.textAlign = "center";
                myArticle.classList.add("infobox");

                const link = document.createElement('a');
                link.href = 'arquivo.html';
                link.textContent = projeto.nome;
                myArticle.appendChild(link);

                const linebreak = document.createElement("br");

                const myAuthor = document.createElement("h5");
                myAuthor.textContent = projeto.autor;
                myAuthor.style.textAlign = "center";

                const linebreak2 = document.createElement("br");



                const myDesc = document.createElement("h6");
                myDesc.textContent = projeto.descricao;
                myDesc.style.textAlign = "center";



                const linebreak3 = document.createElement("br");

                myArticle.appendChild(linebreak);

                myArticle.appendChild(myAuthor);
                myArticle.appendChild(linebreak2);
                if ( ((projeto.imagem == "") && (typeof projeto.imagem != undefined)) || 1 == 1 ) {
                    myArticle.appendChild(myDesc);
                } else {
                    const myImg = document.createElement('img');
                    myImg.src = projeto.imagem;
                    myImg.setAttribute('width', "90%");
                    myImg.setAttribute('height', "50%");
                    myImg.style.position = "absolute";
                    myImg.style.top = "10vh";
                    myImg.style.left = "1vw";

                    myArticle.appendChild(myImg); 


                }
                section.appendChild(myArticle);

                section.appendChild(linebreak3);

            } else {
                console.log("tem nao")
            }

        }

    }
}