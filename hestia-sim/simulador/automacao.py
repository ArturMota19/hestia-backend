
from datetime import datetime, timedelta

from simpy import Environment

from simulador.comodo import Comodo
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class Automacao:

    def __init__(self, env: Environment, comodos: dict, comodo: Comodo, inicio: dict, duracao, nome, atuador, dia_semana: list):
        self.env = env
        self.nome = nome
        self.horario_ativacao = timedelta(hours=inicio['hora'], minutes=inicio['minuto'])
        self.duracao = duracao
        self.dia_semana = dia_semana
        self.comodos = comodos
        self.comodo = comodo
        self.atuador = atuador

    def gerar_evento(self, usuario_automacao: Usuario):
        while True:
            yield self.env.timeout(1)
            semana_atual = Tempo.dia_da_semana(self.env.now)
            horario_atual = Tempo.hora_atual_simulacao(self.env)
            if semana_atual in self.dia_semana and horario_atual == self.horario_ativacao:
                c = self.comodos[self.comodo]
                a = c.atuadores[c.atuadores.index(self.atuador)]
                with c.resource.request() as rq:
                    yield rq
                    a.iniciar_uso(usuario_automacao, "automacao")
                    yield self.env.timeout(self.duracao)
                    a.finalizar_uso(usuario_automacao, "automacao")



