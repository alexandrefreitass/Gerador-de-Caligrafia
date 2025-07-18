# gerador/__init__.py

import os
import logging
from flask import Flask

def create_app(test_config=None):
    """
    Application Factory: Cria e configura a aplicação Flask.
    """
    logging.basicConfig(level=logging.DEBUG)

    # Cria a instância do app. 
    # instance_relative_config=True informa que arquivos de configuração são relativos à pasta 'instance'.
    app = Flask(__name__, instance_relative_config=True)

    # Define configurações padrão que podem ser sobrescritas
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SESSION_SECRET", "uma-chave-secreta-forte-para-desenvolvimento")
    )

    if test_config is None:
        # Carrega a configuração da instância, se existir, quando não estiver testando
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Carrega a configuração de teste se for passada
        app.config.from_mapping(test_config)

    # Garante que a pasta da instância exista
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # O "pulo do gato": registramos as rotas (Blueprints) na nossa aplicação
    from . import routes
    app.register_blueprint(routes.bp)

    logging.info("Aplicação 'Gerador de Caligrafia' criada com sucesso.")

    return app