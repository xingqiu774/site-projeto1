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

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values of the filter select boxes
    const tag = document.getElementById('pesquisa').value;
    const nome = document.getElementById('nome').value;
    const extensao = document.getElementById('extensao').value;
    const tags = document.getElementById('tags').value;
    const areaConhecimento = document.getElementById('area_conhecimento').value;
    const habilidades = document.getElementById('habilidades').value;

    // Create a URLSearchParams object to build the query string
    const params = new URLSearchParams();
    params.set('tag', tag);
    params.set('nome', nome);
    params.set('extensao', extensao);
    params.set('tags', tags);
    params.set('area_conhecimento', areaConhecimento);
    params.set('habilidades', habilidades);

    // Redirect to the new URL with the query parameters
    window.location.href = `${this.action}?${params.toString()}`;
});

document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    //const tag = params.get("tag");
    const pid = params.get("pid");

    // Set default values or read from URL
    const tag = params.get("tag") || "";
    const nome = params.get("nome") || "on";
    const extensao = params.get("extensao") || "on";
    const tags = params.get("tags") || "on";
    const areaConhecimento = params.get("area_conhecimento") || "on";
    const habilidades = params.get("habilidades") || "on";
    
    // Set the form fields
    document.getElementById("pesquisa").value = tag;
    document.getElementById("nome").value = nome;
    document.getElementById("extensao").value = extensao;
    document.getElementById("tags").value = tags;
    document.getElementById("area_conhecimento").value = areaConhecimento;
    document.getElementById("habilidades").value = habilidades;

    if (tag) {

        open_that_json(tag, pid, nome, extensao, tags, areaConhecimento, habilidades);

    } else {
        document.getElementById("resultados").textContent = "Nenhuma tag fornecida.";
    }
});

var has_or_not = 0;

async function open_that_json(tag, pid, nome, extensao, tags, areaConhecimento, habilidades) {
    const response = await fetch('http://localhost:5000/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            term: tag,
            filters: {
                nome: nome === 'on',
                extensao: extensao === 'on',
                tags: tags === 'on',
                area_conhecimento: areaConhecimento === 'on',
                habilidades: habilidades === 'on'
            }
        })
    });
    
    const data = await response.json();
    const projetos = data.projetos;
    const arquivos = data.arquivos;

    has_or_not = 0;

    if (projetos.length || arquivos.length) {
        has_or_not = 1;
        document.getElementById("resultados").textContent = `Resultados para: ${tag}`;
        document.getElementById("pesquisa").placeholder = tag;
        // Display projects and files
        check_for_tag(projetos, arquivos, tag, pid);
    } else {
        document.getElementById("resultados").textContent = `Não foi encontrado nada com a tag ${tag}.`;
    }
}


function check_for_tag(projetos, arquivos, target, pid) {
    console.log("Searching projects and files...");
    const section = document.getElementById("fetched");
    section.innerHTML = ''; // Clear previous results

    let i = 0;

    // Display all matching projects
    for (const projeto of projetos) {
        if ((i < pid) || (i > pid + 51)) {
            continue;
        }

        
            has_or_not = 1;

            const myArticle = document.createElement("h2");
            myArticle.style.textAlign = "center";
            myArticle.classList.add("infobox");

            const link = document.createElement('a');
            link.href = `arquivo.html?post_id=${projeto._id}`;
            link.textContent = projeto.nome;
            myArticle.appendChild(link);

            const myDesc = document.createElement("h6");
            myDesc.textContent = projeto.descricao;
            myDesc.style.textAlign = "center";
            myArticle.appendChild(myDesc);

            section.appendChild(myArticle);
        
    }

    // Display all matching files (and link them to the parent project)
    for (const arquivo of arquivos) {
        if ((i < pid) || (i > pid + 51)) {
            continue;
        }

        
            has_or_not = 1;

            const myArticle = document.createElement("h2");
            myArticle.style.textAlign = "center";
            myArticle.classList.add("infobox");

            const link = document.createElement('a');
            // Link to the parent project, not the file itself
            link.href = `arquivo.html?post_id=${arquivo.projeto_id}`;
            link.textContent = `File: ${arquivo.nome}`;
            myArticle.appendChild(link);

            const myDesc = document.createElement("h6");
            myDesc.textContent = arquivo.extensao;
            myDesc.style.textAlign = "center";
            myArticle.appendChild(myDesc);

            section.appendChild(myArticle);
        
    }
}
