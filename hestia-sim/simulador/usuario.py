import math
from datetime import datetime
from random import uniform

import networkx as nx
from networkx.utils import pairwise
from networkx import Graph


from simulador.helps.tempo import Tempo

from simulador.atividade import Atividade

class Usuario:

    def __init__(self, env, nome, prioridade, comodo_atual, preferencia, rotina_semana=[]):
        self.env = env
        self.nome = nome
        self.prioridade = prioridade
        self.comodo_atual = comodo_atual
        self.rotina_semana = rotina_semana
        self.preferencia = preferencia
        self.contador_evento = None
        self.semana_anterior = None
        self.atividade_atual = None
        self.proxima_atividade = None

    def gerar_evento(self, grafo_casa):
        while True:
            self.contador_index_evento()
            atividade = self._define_periodo_atividade()
            self.atividade_atual = atividade
            self.proxima_atividade = self.pega_proxima_atividade()

            # if self.comodo_atual != atividade.local_atividade:
            #     self.comodo_atual.desativa_sensor(self)
            yield self.env.process(self.rota_ate(grafo_casa, self.comodo_atual, atividade.local_atividade.nome))
            self.comodo_atual = atividade.local_atividade
            # self.comodo_atual.ativa_sensor(self)
            yield self.env.process(atividade.executar(self, atividade.local_atividade))

    def atividade_secundaria(self, grafo_casa:Graph, atividade, local_atividade_oroginal: str, atividade_original):

        # self.atividade_atual = atividade

        # if self.comodo_atual != atividade.nome:
        #     self.comodo_atual.desativa_sensor(self)
        yield self.env.process(self.rota_ate(grafo_casa, self.comodo_atual, atividade.local_atividade.nome))
        # self.comodo_atual = atividade.local_atividade
        # self.comodo_atual.ativa_sensor(self)
        yield self.env.process(atividade.executar_secundaria(self, atividade.local_atividade))

        # self.atividade_atual = atividade_original

        yield self.env.process(self.rota_ate(grafo_casa, self.comodo_atual, local_atividade_oroginal))


    def _define_periodo_atividade(self):
        atividade = self.rotina_semana[Tempo.dia_da_semana(self.env.now)][self.contador_evento]

        # ferifica a o tempo restante do dia e atribui para a ultima atividade
        if atividade == self.rotina_semana[Tempo.dia_da_semana(self.env.now)][-1]:
            t = self.env.now
            atividade.duracao = 86400 - (self.env.now % 86400)
            return atividade
        # realiza a variação do tempo de cada atividade
        if atividade.inicio_ocorrencia is not None and atividade.fim_ocorrencia is not None:
            atividade.duracao = (datetime.strptime(atividade.fim_ocorrencia, "%H:%M:%S") - datetime.strptime(
                atividade.inicio_ocorrencia, "%H:%M:%S")).total_seconds()
            atividade.variacao = int(uniform(0, atividade.duracao * atividade.taxa_erro))
            # atividade.duracao = periodo_atividade_variavel
            return atividade

        atividade.variacao = int(uniform(0, atividade.duracao * atividade.taxa_erro))
        return atividade

    def pega_proxima_atividade(self) -> Atividade:
        semana = Tempo.dia_da_semana(self.env.now + self.atividade_atual.duracao)
        evento = self.contador_evento
        if self.contador_evento >= len(self.rotina_semana[Tempo.dia_da_semana(self.env.now)])-1 or self.semana_anterior != semana:
            evento=0
            # if semana == 6:
            #     semana = 0
            # else:
            #     semana+=1
        else:
            evento+=1
        return self.rotina_semana[semana][evento]

    def contador_index_evento(self):
        semana_atual = Tempo.dia_da_semana(self.env.now)
        tr = len(self.rotina_semana[Tempo.dia_da_semana(self.env.now)]) - 1
        if self.contador_evento is None:
            self.contador_evento = 0
            self.semana_anterior = Tempo.dia_da_semana(self.env.now)
        elif self.contador_evento >= tr or semana_atual != self.semana_anterior:
            self.contador_evento = 0
        else:
            self.contador_evento += 1
        self.semana_anterior = Tempo.dia_da_semana(self.env.now)

    # RETORNA A ROTA MAIS CURTA DE UM PONTO ATÉ O OUTO COMODO
    def rota_ate(self, grafo, localAtual, objetivo):
        rota = nx.astar_path(grafo, source=localAtual, target=objetivo)
        caminho_pesos = [(u, v, grafo[u][v]['weight']) for u, v in pairwise(rota)]
        for origem_comodo, proximo_comodo, distancia in caminho_pesos:
            if proximo_comodo.nome != objetivo:
                self.comodo_atual = proximo_comodo
                yield self.env.process(proximo_comodo.passar(self, distancia))
