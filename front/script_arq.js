document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    if (postId) {
        fetchProjectData(postId);
        fetchArquivosByProjeto(postId);
    } else {
        console.error("post_id not found in the URL.");
    }

    function fetchProjectData(postId) {
        fetch("http://localhost:5000/api/projetos") // Adjust API URL if necessary
            .then(response => response.json())
            .then(projetos => {
                const projeto = projetos.find(proj => proj._id === postId);
                if (projeto) {
                    populateProjectInfo(projeto);
                } else {
                    console.error("Projeto not found for the given post_id.");
                }
            })
            .catch(error => {
                console.error("Error fetching project:", error);
            });
    }

    function fetchArquivosByProjeto(postId) {
        fetch("http://localhost:5000/api/arquivos") // Adjust API URL if necessary
            .then(response => response.json())
            .then(arquivos => {
                const filteredArquivos = arquivos.filter(arquivo => arquivo.projeto_id === postId);
                populateArquivosList(filteredArquivos);
            })
            .catch(error => {
                console.error("Error fetching arquivos:", error);
            });
    }

    function populateProjectInfo(projeto) {
        document.getElementById("nome").textContent = projeto.nome || "Nome desconhecido";
        document.getElementById("desc").textContent = `Descrição: ${projeto.descricao || "Sem descrição"}`;
        document.getElementById("autor").textContent = `Autor: ${projeto.autor || "Desconhecido"}`;
        document.getElementById("data_envio").textContent = `Data de Envio: ${projeto.data_envio || "Sem data"}`;
    }

    function populateArquivosList(arquivos) {
        const archiveContainer = document.getElementById("archiveContainer");
        archiveContainer.innerHTML = ""; // Clear existing content

        if (arquivos.length > 0) {
            arquivos.forEach(arquivo => {
                let arquivoItem = document.createElement("div");
                arquivoItem.className = "archiveItem";
                
                let subArchiveItem2 = document.createElement("p");
                subArchiveItem2.textContent = arquivo.nome;

                let subArchiveItem3 = document.createElement("button");
                subArchiveItem3.className = "material-symbols-outlined rebaixa";
                subArchiveItem3.textContent = "download";
                // Set up click event for file preview
                subArchiveItem3.addEventListener("click", function () {
                    displayPreview(arquivo);
                });
                let subArchiveItem4 = document.createElement("button");
                subArchiveItem4.className = "material-symbols-outlined rebaixa";
                subArchiveItem4.textContent = "file_open";
                // Set up click event for file preview
                subArchiveItem4.addEventListener("click", function () {
                    displayPreview(arquivo);
                });

                subArchiveItem2.appendChild(subArchiveItem3);
                arquivoItem.appendChild(subArchiveItem2);

                archiveContainer.appendChild(arquivoItem);
            });
        } else {
            const noFilesMessage = document.createElement("p");
            noFilesMessage.textContent = "Nenhum arquivo disponível para este projeto.";
            archiveContainer.appendChild(noFilesMessage);
        }

        // Set up "Baixar Tudo" link to download all files
        const baixarTudo = document.getElementById("baixartudo");
        baixarTudo.innerHTML = `<a href="#" id="downloadAll">Baixar Tudo</a>`;
        document.getElementById("downloadAll").addEventListener("click", function (e) {
            e.preventDefault();
            downloadAllFiles(arquivos);
        });
    }

    function displayPreview(arquivo) {
        const previewBox = document.getElementById("preview");
        previewBox.innerHTML = `<embed src="http://localhost:5000/download/${arquivo.file_id}" class="previewbox">`;

        // Set up the "Baixar Este" link for the current file
        const baixarEste = document.getElementById("baixareste");
        baixarEste.innerHTML = `<a href="http://localhost:5000/download/${arquivo.file_id}">Baixar Este</a>`;
    }

    function downloadAllFiles(arquivos) {
        arquivos.forEach(arquivo => {
            const link = document.createElement("a");
            link.href = `http://localhost:5000/download/${arquivo.file_id}`;
            link.download = arquivo.nome;
            link.click();
        });
    }
});
