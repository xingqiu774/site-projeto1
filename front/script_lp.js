//just getting the selectboxes

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