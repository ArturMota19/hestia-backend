import networkx as nx
from networkx import Graph
from simpy import Environment

from simulador.atividade import Atividade
from simulador.automacao import Automacao
from simulador.comodo import Comodo
from simulador.devices.actions.CoffeeMachine import CoffeeMachine
from simulador.devices.actions.LightBulbAction import LightBulbAction
from simulador.devices.actions.MovimentSensorAction import MovimentSensorAction
from simulador.devices.actions.Plug import Plug
from simulador.devices.actions.Sound import Sound
from simulador.devices.actions.SplitAir import SplitAir
from simulador.devices.actions.Tv import Tv
from simulador.helps.converter import Converter
from simulador.usuario import Usuario


class Montador:

    def monta_comodo(self, env: Environment, dados_comodos: dict, tipo_selecionado: str) -> dict[Comodo]:
        comodos = dict()
        for comodo in dados_comodos.values():
            comodo["atuadores"] = self.monta_atuador(env, comodo["nome"], comodo["atuadores"], tipo_selecionado)
            comodos[comodo["nome"]] = Comodo(env, **comodo)
        return comodos

    def monta_atuador(self, env: Environment, nome_comodo: str, dados_atuadores: list, tipo_selecionado: str) -> list:
        lista_atuadores = []
        for atuador in dados_atuadores:
            match atuador:
                case "CAFETEIRA":
                    lista_atuadores.append(CoffeeMachine(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
                case "LAMPADA":
                    lista_atuadores.append(LightBulbAction(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
                case "TV":
                    lista_atuadores.append(Tv(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
                case "SOM":
                    lista_atuadores.append(Sound(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
                case "AR_CONDICIONADO":
                    lista_atuadores.append(SplitAir(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
                case "SENSOR_PRESENCA":
                    lista_atuadores.append(MovimentSensorAction(env, nome_comodo, atuador, tipo_selecionado, "sensor"))
                case _:
                    lista_atuadores.append(Plug(env, nome_comodo, atuador, tipo_selecionado, "atuador"))
        return lista_atuadores

    def cria_grafo(self, relacao_nos: dict, comodos: dict) -> Graph:
        grafo = nx.Graph()
        for no1, no2, peso in relacao_nos:
            grafo.add_edge(comodos[str.upper(no1)], comodos[str.upper(no2)], weight=peso)
        return grafo

    def monta_atividade(self, env: Environment, comodos_da_casa: dict, dados_atividades: dict) -> list:
        listaAtividades = []
        for atividade in dados_atividades.values():
            atividade["local_atividade"] = comodos_da_casa[atividade["local_atividade"]]
            atividade["duracao"] = Converter.minutos_para_segundos(atividade["duracao"])
            listaAtividades.append(Atividade(env, **atividade))
        return listaAtividades

    def monta_usuario(self, env: Environment, lista_usuarios: dict, comodos_da_casa: dict[Comodo]) -> list[Usuario]:
        listaUsuarios = []
        for u in lista_usuarios.values():
            u["comodo_atual"] = comodos_da_casa[u["comodo_atual"]]
            listaUsuarios.append(Usuario(env, **u))
        return listaUsuarios

    def monta_automacao(self, env: Environment, lista_comodos: dict, lista_automacao: dict) -> list[Automacao]:
        return [Automacao(env, lista_comodos, **a) for a in lista_automacao]

    def relaciona_atividades_e_usuario(self, lista_atividades: list, lista_usuarios: list):
        for usuario in lista_usuarios:
            nova_lista_rotina = []
            for rotina in usuario.rotina_semana:
                nova_lista_Atividade = []
                for atividade in rotina:
                    at = lista_atividades[lista_atividades.index(atividade)]
                    nova_lista_Atividade.append(at)
                nova_lista_rotina.append(nova_lista_Atividade)
            usuario.rotina_semana = nova_lista_rotina

    def inicializa_processos(self, env: Environment, lista_usuarios: list, grafo_comodos: Graph, lista_automacao: list):
        for usuario in lista_usuarios:
            env.process(usuario.gerar_evento(grafo_comodos))
        for automacao in lista_automacao:
            env.process(automacao.gerar_evento(lista_usuarios[0]))
