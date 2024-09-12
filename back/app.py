from flask import Flask, jsonify, request, render_template, send_file
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import gridfs
from werkzeug.utils import secure_filename
import io
from flask_cors import CORS

# Conexão com o Banco de Dados
connection_string = "mongodb+srv://xingqiu:ibtheworldchalicejusticiar@cluster0.8go9m.mongodb.net/"
app = Flask(__name__)
app.config["MONGO_URI"] = connection_string + "projeto1"
mongo = PyMongo(app)
db_connection = mongo.db
fs = gridfs.GridFS(db_connection)


CORS(app)


def converter_id_str(documents):
    for doc in documents:
        doc["_id"] = str(doc["_id"])
    return documents

def build_query(term, filters):
    regex = {"$regex": term, "$options": "i"}
    query = {}

    if "nome" in filters:
        query["nome"] = regex
    if "extensao" in filters:
        query["extensao"] = regex
    if "tags" in filters:
        query["tags"] = regex
    if "area_conhecimento" in filters:
        query["area_conhecimento"] = regex
    if "habilidades" in filters:
        query["habilidades"] = regex

    return query

# Função de pesquisa de projetos e arquivos
def search(term, filters):
    regex = {"$regex": term, "$options": "i"}
    query = build_query(term, filters)
    
    if not query:
        # Se nenhum filtro for escolhido a pesquisa será feita em todos os campos
        query = {"$or": [
            {"nome": regex},
            {"extensao": regex},
            {"tags": regex},
            {"area_conhecimento": regex},
            {"habilidades": regex}
        ]}

    projetos = converter_id_str(list(db_connection.Projetos.find(query)))
    for projeto in projetos:
        projeto["arquivos"] = converter_id_str(list(db_connection.Arquivos.find({"projeto_id": projeto["_id"]})))

    arquivos = converter_id_str(list(db_connection.Arquivos.find(query)))

    return {"projetos": projetos, "arquivos": arquivos}

@app.route('/pesquisar', methods=['GET', 'POST'])
def pesquisar():
    if request.method == 'POST':
        termo = request.form.get('termo')
        filtros = request.form.getlist('filters')
        resultados = search(termo, filtros)
        return render_template('resultados_pesquisa.html', resultados=resultados)
    return render_template('pesquisar.html')

@app.route('/criar_projeto', methods=['GET', 'POST'])
def criar_projeto():
    if request.method == 'POST':
        # Process tags for the project
        raw_tags = request.form.get('tags')
        tags = [tag.strip() for tag in raw_tags.split(',')]  # Split and strip tags for the project

        projeto_info = {
            "nome": request.form.get('nome'),
            "descricao": request.form.get('descricao'),
            "tags": tags,  # Save the tags as an array
            "data_envio": request.form.get('data_envio')
        }
        projeto_id = db_connection.Projetos.insert_one(projeto_info).inserted_id

        # Process each file
        i = 0
        while True:
            file = request.files.get(f'arquivos_{i}')
            if not file:
                break
            file_id = fs.put(file, filename=secure_filename(file.filename))
            
            # Process tags for files
            raw_file_tags = request.form.get(f'tags_arquivo_{i}')  # Get the raw tags for the file
            if raw_file_tags:  # Ensure raw_file_tags is not None or empty
                file_tags = [tag.strip() for tag in raw_file_tags.split(',')]  # Split and strip tags for the file
            else:
                file_tags = []  # In case there are no tags for the file
            
            # Process Habilities for files
            raw_skill_tags = request.form.get(f'habilidades_{i}')  # Get the raw tags for the file
            if raw_skill_tags:  # Ensure raw_skill_tags is not None or empty
                skill_tags = [skill.strip() for skill in raw_skill_tags.split(',')]  # Split and strip tags for the file
            else:
                skill_tags = []  # In case there are no tags for the file
            
            

            arquivo_info = {
                "nome": request.form.get(f'nome_arquivo_{i}'),
                "extensao": request.form.get(f'extensao_arquivo_{i}'),
                "tags": file_tags,  # Save file tags as an array
                "area_conhecimento": request.form.get(f'area_conhecimento_{i}'),
                "habilidades": skill_tags,
                "file_id": str(file_id),
                "projeto_id": str(projeto_id)
            }
            db_connection.Arquivos.insert_one(arquivo_info)
            i += 1

        return jsonify({"message": "Projeto e arquivos adicionados com sucesso", "projeto_id": str(projeto_id)}), 201
    return render_template('criar_projeto.html')



@app.route('/listar_projetos', methods=['GET'])
def listar_projetos():
    projetos = converter_id_str(list(db_connection.Projetos.find()))
    for projeto in projetos:
        projeto['arquivos'] = converter_id_str(list(db_connection.Arquivos.find({"projeto_id": projeto['_id']})))
    return render_template('listar_projetos.html', projetos=projetos)

@app.route('/download/<file_id>', methods=['GET'])
def download_arquivo(file_id):
    file = fs.get(ObjectId(file_id))
    return send_file(io.BytesIO(file.read()), download_name=file.filename, as_attachment=True)

@app.route('/api/projetos', methods=['GET'])
def api_listar_projetos():
    projetos = converter_id_str(list(db_connection.Projetos.find()))
    #for projeto in projetos:
        #projeto['arquivos'] = converter_id_str(list(db_connection.Arquivos.find({"projeto_id": projeto['_id']})))
    return jsonify(projetos), 200

@app.route('/api/arquivos', methods=['GET'])
def api_listar_arquivos():
    arquivos = converter_id_str(list(db_connection.Arquivos.find()))
    #for arquivo in arquivos:
        #arquivo['arquivos'] = converter_id_str(list(db_connection.Arquivos.find({"projeto_id": projeto['_id']})))
    return jsonify(arquivos), 200


if __name__ == '__main__':
    app.run(port=5000, host='localhost', debug=True)
