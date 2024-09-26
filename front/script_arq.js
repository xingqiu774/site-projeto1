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
                    downloadFile(arquivo);
                });
                let subArchiveItem4 = document.createElement("button");
                subArchiveItem4.className = "material-symbols-outlined rebaixa";
                subArchiveItem4.textContent = "file_open";
                // Set up click event for file preview
                subArchiveItem4.addEventListener("click", function () {
                    displayPreview(arquivo);
                });

                subArchiveItem2.appendChild(subArchiveItem3);
                subArchiveItem2.appendChild(subArchiveItem4);
                arquivoItem.appendChild(subArchiveItem2);

                archiveContainer.appendChild(arquivoItem);
            });
        } else {
            const noFilesMessage = document.createElement("p");
            noFilesMessage.textContent = "Nenhum arquivo disponível para este projeto.";
            archiveContainer.appendChild(noFilesMessage);
        }

        // Set up "Baixar Tudo" link to download all files
        
        document.getElementById("downloadAll").addEventListener("click", function (e) {
            e.preventDefault();
            downloadAllFiles(arquivos);
        });
    }

    function displayPreview(arquivo) {
        // Update the filename text
        const filenameElement = document.getElementById("filename");
        filenameElement.textContent = arquivo.nome;
    
        // Get the preview box container
        const previewBox = document.getElementById("previewBox");
    
        // Clear any previous content
        previewBox.innerHTML = '';
    
        // Use the 'extensao' field to determine the file type
        const fileExtension = arquivo.extensao.toLowerCase();
    
        if (fileExtension === 'pdf') {
            // For PDFs, use an iframe
            const iframeElement = document.createElement('iframe');
            iframeElement.src = `http://localhost:5000/view/${arquivo.file_id}`;
            iframeElement.classList.add('embed-content');
            iframeElement.style.height = '800px'; // Set a reasonable height for PDF viewing
            previewBox.appendChild(iframeElement);
        } else if (fileExtension === 'md') {
            // For Markdown files, fetch the content and render it using marked.js
            fetch(`http://localhost:5000/view/${arquivo.file_id}`)
                .then(response => response.text())
                .then(markdownText => {
                    const renderedMarkdown = marked.parse(markdownText);
                    const markdownContainer = document.createElement('div');
                    markdownContainer.innerHTML = renderedMarkdown;
                    markdownContainer.classList.add('embed-content');
                    previewBox.appendChild(markdownContainer);
                })
                .catch(error => console.error('Error loading markdown:', error));
        } else {
            // For other file types (like .txt), use an embed
            const embedElement = document.createElement('embed');
            embedElement.src = `http://localhost:5000/view/${arquivo.file_id}`;
            embedElement.classList.add('embed-content');
            previewBox.appendChild(embedElement);
        }
    }
    
    
    

    function downloadAllFiles(arquivos) {
        arquivos.forEach((arquivo, index) => {
            setTimeout(() => {
                const link = document.createElement("a");
                link.href = `http://localhost:5000/download/${arquivo.file_id}`;
                link.download = arquivo.nome;
                link.click();
            }, index * 1000); // Adjust the delay time as needed (e.g., 1000 ms = 1 second)
        });
    }
    

    function downloadFile(arquivo) {

        const link = document.createElement("a");
        link.href = `http://localhost:5000/download/${arquivo.file_id}`;
        link.download = arquivo.nome;
        link.click();

    }
});
