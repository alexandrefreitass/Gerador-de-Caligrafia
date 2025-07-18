# main.py

from gerador import create_app

# Cria a aplicação usando a factory
app = create_app()

if __name__ == '__main__':
    # Para produção, você usaria um servidor WSGI como Gunicorn
    # A configuração do Replit já deve lidar com isso.
    # Para rodar localmente:
    app.run(host='0.0.0.0', port=5000, debug=True)