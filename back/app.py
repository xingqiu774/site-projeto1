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
    query = {"$or": []}  # Start with an empty list of conditions

    # Apply filters if they are turned on
    if filters.get('nome') == 'on':
        query["$or"].append({"nome": regex})
    
    if filters.get('extensao') == 'on':
        query["$or"].append({"extensao": regex})
    
    if filters.get('tags') == 'on':
        query["$or"].append({"tags": regex})
    
    if filters.get('area_conhecimento') == 'on':
        query["$or"].append({"area_conhecimento": regex})
    
    if filters.get('habilidades') == 'on':
        query["$or"].append({"habilidades": regex})

    # If no specific filters were added, search all fields by default
    if not query["$or"]:
        query = {"$or": [
            {"nome": regex},
            {"extensao": regex},
            {"tags": regex},
            {"area_conhecimento": regex},
            {"habilidades": regex}
        ]}
    
    return query


def search(term, filters):
    regex = {"$regex": term, "$options": "i"}
    query = {"$or": []}

    # Apply filters based on what's enabled ('on') in the front-end
    if filters.get('nome', True):
        query["$or"].append({"nome": regex})

    if filters.get('extensao', True):
        query["$or"].append({"extensao": regex})

    if filters.get('tags', True):
        query["$or"].append({"tags": regex})

    if filters.get('area_conhecimento', True):
        query["$or"].append({"area_conhecimento": regex})

    if filters.get('habilidades', True):
        query["$or"].append({"habilidades": regex})

    if not query["$or"]:
        # If no filter is selected, search all fields by default
        query = {
            "$or": [
                {"nome": regex},
                {"extensao": regex},
                {"tags": regex},
                {"area_conhecimento": regex},
                {"habilidades": regex}
            ]
        }

    # Search for matching projects
    projetos = converter_id_str(list(db_connection.Projetos.find(query)))
    
    # For each project, find its related files (arquivos)
    for projeto in projetos:
        projeto["arquivos"] = converter_id_str(list(db_connection.Arquivos.find({"projeto_id": projeto["_id"]})))

    # Search for matching files (arquivos)
    arquivos = converter_id_str(list(db_connection.Arquivos.find(query)))

    return {"projetos": projetos, "arquivos": arquivos}



# function to search
@app.route('/api/projetos', methods=['POST'])
def api_pesquisar_projetos():
    data = request.json
    term = data.get("term")
    filters = data.get("filters", {})

    resultados = search(term, filters)  # This function already searches both projetos and arquivos
    return jsonify(resultados), 200







"""
@app.route('/pesquisar', methods=['GET', 'POST'])
def pesquisar():
    if request.method == 'POST':
        termo = request.form.get('termo')
        filtros = request.form.getlist('filters')
        resultados = search(termo, filtros)
        return render_template('resultados_pesquisa.html', resultados=resultados)
    return render_template('pesquisar.html')

"""





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
    return jsonify(projetos), 200

@app.route('/api/arquivos', methods=['GET'])
def api_listar_arquivos():
    arquivos = converter_id_str(list(db_connection.Arquivos.find()))
    return jsonify(arquivos), 200


if __name__ == '__main__':
    app.run(port=5000, host='localhost', debug=True)
