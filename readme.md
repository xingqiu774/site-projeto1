# Repositório CEnPE
Este projeto se trata de um projeto para a disciplina Projeto Integrado I da UFC 2024, em que fomos selecionados para criar um site de pesquisa de materiais didaticos.

# Tecnologias
## Banco de Dados
- MongoDB
- MongoCompass
## Back-end
- Flask
- Python
- CORS
## Front-end
- HTML
- CSS
- Javascript
# Como usar
Para colocar o banco de dados online é necessario que o utilizador crie uma conta no MongoDB, crie o seu cluster e baixe o MongoDB + MongoDB Compass. 
Proximo passo é conectar ao seu cluster pelo MongoCompass e copiar o connection string. 
Vá para back/app.py e mude connection_string = ""; para o copiado 
Em front end script.js mude: 
```Javascript
const response = await fetch('api/projetos')
```
para o link do servidor + o /api/projetos. Faça isso em todos necessários.  
Exemplo: 

```Javascript 
const response = await fetch('http://localhost:5000/api/projetos'
```
Rode o app.py pra abrir o servidor.  
Aí só acessar.
