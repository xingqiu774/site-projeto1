Este projeto se trata de um projeto para a disciplina Projeto Integrado I da UFC 2024, em que fomos selecionados para criar um site de pesquisa de materiais didaticos.

Foi-se utilizado o Flask, MongoDB, MongoCompass, Python, Pymongo e CORS para a programação do back end.

>Para colocar o banco de dados online é necessario que o utilizador crie uma conta no MongoDB, criar o seu cluster e baixar o MongoDB + MongoDB Compass.
> Proximo passo é conectar ao seu cluster pelo MongoCompass e copiar o connection string.
> Vá para back/app.py e mude connection_string = ""; para o copiado
> em front end script.js mude:
const response = await fetch('api/projetos',
> para o link do servidor + o /api/projetos, fassa isso em todos necessarios
example:
>const response = await fetch('http://localhost:5000/api/projetos',
>rodar o app.py pra abrir o servidor
>ai so acessar msm
