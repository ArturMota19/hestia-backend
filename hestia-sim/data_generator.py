import json
import math
import sys
import random
import cProfile
from datetime import datetime

import pandas as pd
import simpy
import os

from menu import menu
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.converter import Converter
from simulador.helps.tempo import Tempo
from simulador.helps.usuarios_help import UsuariosHelp
from simulador.montador import Montador


def inicia_simulacao(env, dias_simulados):
    Tempo.data_inicio_simulacao(dias_simulados)
    env.run(until=Converter.dias_para_segundos(dias_simulados))

def print_infos(env, dias_simulados, rotina, nome_arquivo):
    data_inicio = Tempo.data_inicio
    data_final = Tempo.data_atual_simulacao(env)
    print(f"--- Dados Simulação --- \nDias: {dias_simulados}\nPeríodo: {data_inicio} à {data_final}\nRotina: {rotina}\nArquivo Gerado: {nome_arquivo}")

def generate_data():
    initial_path = './dados'

    tipos = ['completo', 'simples', 'back']
    max_size = max(len(option) for option in tipos)
    title = '*' * (max_size // 2) + ' SELECT THE TYPE ' + '*' * (max_size // 2)
    modelo_dados = menu(list(map(str.capitalize, tipos)), title)
    tipo_selecionado = tipos[modelo_dados]
    print(tipo_selecionado)
    if tipo_selecionado != 'back':
        dias_simulacao = int(input('Quantidade de dias: '))

        rotinas = [r.split('.')[0] for r in os.listdir('./rotinas/')]
        max_size = max(len(option) for option in rotinas)
        title = '*' * (max_size // 2) + ' SELECT THE ROUTINE ' + '*' * (max_size // 2)
        rotina_selecionada = menu(rotinas, title)

        arquivo_rotina = f'./rotinas/{rotinas[rotina_selecionada]}.json'

        if not 'dados' in os.listdir():
            os.mkdir('dados')

        if not 'original' in os.listdir(initial_path):
            os.mkdir('/'.join([initial_path, 'original']))

        initial_path += '/original/'
        if not tipo_selecionado in os.listdir(initial_path):
            os.mkdir('/'.join([initial_path, tipo_selecionado]))
        initial_path += tipo_selecionado

        with open(arquivo_rotina) as json_file:
            ############################### INSTANCIA ELEMENTOS ###############################
            dados = json.load(json_file)

            env = simpy.Environment()
            montador = Montador()
            comodos_da_casa = montador.monta_comodo(env, dados["COMODOS"], tipo_selecionado)
            grafo_comodos = montador.cria_grafo(dados["GRAFO_COMODOS"], comodos_da_casa)
            atividades = montador.monta_atividade(env, comodos_da_casa, dados["ATIVIDADES"])
            usuarios = montador.monta_usuario(env, dados["USUARIOS"], comodos_da_casa)
            automacao = montador.monta_automacao(env, comodos_da_casa, dados["AUTOMACAO"])
            # nx.draw(grafo_comodos, with_labels=True)
            montador.relaciona_atividades_e_usuario(atividades, usuarios)
            UsuariosHelp(usuarios, atividades, grafo_comodos)
            montador.inicializa_processos(env, usuarios, grafo_comodos, automacao)

            ############################### INICIA APLICAÇÃO ###############################

            inicia_simulacao(env, dias_simulacao)
            nome_arquivo = GravarDados.gravar(initial_path)

            print_infos(env, dias_simulacao, rotinas[rotina_selecionada], nome_arquivo)

        return False
    else:
        sys.stdout.write('\r')
        return True


def generate_data_debug(arquivo_rotina, tipo_selecionado, dias_simulacao, nome_rotina):
    print(arquivo_rotina, tipo_selecionado, dias_simulacao, nome_rotina)
    initial_path = './'
    # print(tipo_selecionado)
    # arquivo_rotina = f'./rotinas/{nome_rotina}.json'

    with open(arquivo_rotina) as json_file:
        ############################### INSTANCIA ELEMENTOS ###############################
        dados = json.load(json_file)

        env = simpy.Environment()
        montador = Montador()
        comodos_da_casa = montador.monta_comodo(env, dados["COMODOS"], tipo_selecionado)
        grafo_comodos = montador.cria_grafo(dados["GRAFO_COMODOS"], comodos_da_casa)
        atividades = montador.monta_atividade(env, comodos_da_casa, dados["ATIVIDADES"])
        usuarios = montador.monta_usuario(env, dados["USUARIOS"], comodos_da_casa)
        automacao = montador.monta_automacao(env, comodos_da_casa, dados["AUTOMACAO"])
        # nx.draw(grafo_comodos, with_labels=True)
        montador.relaciona_atividades_e_usuario(atividades, usuarios)
        montador.inicializa_processos(env, usuarios, grafo_comodos, automacao)

        ############################### INICIA APLICAÇÃO ###############################
        UsuariosHelp(usuarios, atividades, grafo_comodos)
        inicia_simulacao(env, dias_simulacao)
        nome_arquivo = GravarDados.gravar(initial_path)
        print_infos(env, dias_simulacao, nome_rotina, nome_arquivo)
        
        return nome_arquivo


random.seed(123)
if __name__ == "__main__":
    arquivo_rotina = sys.argv[1]
    tipo_selecionado = sys.argv[2]
    dias_simulacao = int(sys.argv[3])
    nome_rotina = sys.argv[4]
    
    result = generate_data_debug(arquivo_rotina, tipo_selecionado, dias_simulacao, nome_rotina)
    print(result)  # esse print volta pro Node
    
    
    # tipos = ['completo', 'simples', 'back']
    # dias_simulacao = 14
    # nome_rotina = "gemini"

    # generate_data_debug(tipos[1], dias_simulacao, nome_rotina)
    # total = {}
    # with open('teste_tempo.csv', 'a') as f:
    #
    #     for dias in range(1, 9000, 10):
    #         tempo = []
    #         for i in range(3):
    #             tempo_inicio = datetime.now()
    #             generate_data_debug(tipos[0], dias, nome_rotina)
    #             tempo_fim = datetime.now()
    #             tempo.append((tempo_fim - tempo_inicio).total_seconds())
    #         # print(f"[{dias}] = {sum(tempo)/3}")
    #         # total[dias] = sum(tempo)/3
    #         print(f"{dias}, {sum(tempo) / 3}\n")
    #         f.write(f"{dias}, {sum(tempo)/3}\n")
    #     print("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        # print(total)
        # pd.DataFrame([total]).T.to_csv('teste_tempo.csv')





