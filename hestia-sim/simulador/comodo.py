import copy
import random
import numpy as np
from datetime import timedelta

import simpy

from simulador.helps.status import Status
from simulador.helps.tempo import Tempo

from simulador.usuario import Usuario

from simulador.helps.usuarios_help import UsuariosHelp


class Comodo:
    def __init__(self, env, nome, ocupacao_maxima, atuadores=None):
        if atuadores is None:
            atuadores = []
        self.env = env
        self.resource = simpy.Resource(env, capacity=ocupacao_maxima)
        self.atuadores = atuadores
        self.nome = nome

    def add_atuador(self, atuador):
        self.atuadores.append(atuador)

    def entrar(self, atividade_original, duracao, usuario_action: Usuario, lista_atuadores_atividade, local_atividade, atividades_associadas=None):
        with self.resource.request() as rq:
            yield rq
            usuario_action.comodo_atual = local_atividade
            self.ativa_sensor(usuario_action, atividade_original.nome)



            yield from self.inicia_atuadores(lista_atuadores_atividade, usuario_action, atividade_original.nome)
            if duracao > 600 and lista_atuadores_atividade is not None:
                # atuadores_variaveis = [a for a in lista_atuadores_atividade.items() if a[1][1] == 'D']
                atuadores_variaveis = {chave:valor for chave, valor in lista_atuadores_atividade.items() if valor[1] == 'D'}
            ######inicio logica
            if atividades_associadas is not None:
                quantidade_blocos = int(duracao/600) #divide em blocos de 10 minutos
                resto_duracao = duracao

                atividade_para_sorteio = [None] + list(atividades_associadas.keys())
                associadas_proba = list(atividades_associadas.values())
                expoentes = dict(zip(atividades_associadas.keys(), [1] * len(associadas_proba)))
                for b in range(quantidade_blocos):
                    geral_proba = [1 - sum(associadas_proba)] + associadas_proba
                    atividade_sorteada = random.choices(atividade_para_sorteio, weights=geral_proba, k=1)[0]
                    if atividade_sorteada is not None:
                        atividade_secundaria = UsuariosHelp.pega_atividade(atividade_sorteada)
                        expoentes[atividade_sorteada] += 1
                        associadas_proba = [x ** y for x, y in zip(atividades_associadas.values(), expoentes.values())]
                        # atividade_secundaria.duracao = 600
                        resto_duracao -= atividade_secundaria.duracao
                        # atividade_secundaria.secundaria = True
                        # self.desativa_sensor(usuario_action)


                        if len(atuadores_variaveis) > 0:
                            yield from self.finaliza_atuadores(atuadores_variaveis, usuario_action, atividade_secundaria.nome)

                        if usuario_action.comodo_atual != atividade_secundaria.local_atividade:
                            usuario_action.comodo_atual.desativa_sensor(usuario_action, atividade_secundaria.nome)
                        yield self.env.process(usuario_action.atividade_secundaria(UsuariosHelp.grafo_comodos,atividade_secundaria, local_atividade, atividade_original))
                        self.ativa_sensor(usuario_action, atividade_original.nome)
                        if len(atuadores_variaveis) > 0:
                            yield from self.inicia_atuadores(atuadores_variaveis, usuario_action, atividade_original.nome)
                    else:
                        resto_duracao -= 600
                        yield self.env.timeout(600)
                if resto_duracao<=0:
                    yield self.env.timeout(0)
                else:
                    yield self.env.timeout(resto_duracao)
            else:
                yield self.env.timeout(duracao)

            ######fim logica


            # proxima_atividade = usuario_action.proxima_atividade()
            atuadores_para_desligar = copy.copy(lista_atuadores_atividade)
            atual = copy.copy(lista_atuadores_atividade)
            proximo = copy.copy(usuario_action.proxima_atividade.lista_atuadores_atividade)
            if usuario_action.proxima_atividade.local_atividade == atividade_original.local_atividade and atual is not None and proximo is not None:
                conjunto_atual = set()
                conjunto_proximo = set()
                for k, v in proximo.items():
                    conjunto_proximo.add(f"{k}:{v[0]}")


                for k, v in atual.items():
                    conjunto_atual.add(f"{k}:{v[0]}")

                itens = conjunto_atual.intersection(conjunto_proximo)
                apagar = [i.split(":")[0] for i in itens]

                for i in apagar:
                    atuadores_para_desligar.pop(i)


            yield from self.finaliza_atuadores(atuadores_para_desligar, usuario_action, atividade_original.nome)

            if usuario_action.comodo_atual != usuario_action.proxima_atividade.local_atividade:
                usuario_action.comodo_atual.desativa_sensor(usuario_action, atividade_original.nome)


    def entrar_secundaria(self, atividade, duracao, usuario_action: Usuario, lista_atuadores_atividade, local_atividade, atividades_associadas=None):
        with self.resource.request() as rq:
            yield rq
            # usuario_action.comodo_atual = local_atividade
            self.ativa_sensor(usuario_action, atividade.nome)

            yield from self.inicia_atuadores(lista_atuadores_atividade, usuario_action, atividade.nome)

            ######inicio logica

            yield self.env.timeout(duracao)

            ######fim logica

            atuadores_para_desligar = copy.copy(lista_atuadores_atividade)
            atual = copy.copy(lista_atuadores_atividade)
            proximo = copy.copy(usuario_action.atividade_atual.lista_atuadores_atividade)
            if usuario_action.atividade_atual.local_atividade == atividade.local_atividade and atual is not None and proximo is not None:
                conjunto_atual = set()
                conjunto_proximo = set()
                for k, v in proximo.items():
                    conjunto_proximo.add(f"{k}:{v}")


                for k, v in atual.items():
                    conjunto_atual.add(f"{k}:{v}")

                itens = conjunto_atual.intersection(conjunto_proximo)
                apagar = [i.split(":")[0] for i in itens]

                for i in apagar:
                    atuadores_para_desligar.pop(i)

            yield from self.finaliza_atuadores(atuadores_para_desligar, usuario_action, atividade.nome)
            if local_atividade != usuario_action.atividade_atual.local_atividade:
                local_atividade.desativa_sensor(usuario_action, atividade.nome)


    def usuario_prioritario(self) -> Usuario:
        lista_usuarios_no_comodo = UsuariosHelp.usuarios_in_comodo(self.nome)

        usuario_prioritario = None
        for usuario in lista_usuarios_no_comodo:
            if usuario_prioritario is None or usuario.prioridade > usuario_prioritario.prioridade:
                usuario_prioritario = usuario
        return usuario_prioritario

    def finaliza_atuadores(self, lista_atuadores_atividade, usuario_action, nome_atividade):
        if lista_atuadores_atividade is None:
            return

        for tipo_atuador in lista_atuadores_atividade:
            yield self.env.timeout(random.randint(5, 30)) #tempo entre a ativação dos dispositivos.
            if tipo_atuador in self.atuadores:
                atuador = self.atuadores[self.atuadores.index(tipo_atuador)]
                if not atuador.is_ligado():
                    continue

                usuarios_comodo = UsuariosHelp.usuarios_in_comodo(self.nome)
                desativa = True
                if len(usuarios_comodo) > 1:
                    for u in usuarios_comodo:
                        if u == usuario_action:
                            continue
                        if tipo_atuador in u.atividade_atual.lista_atuadores_atividade and u.atividade_atual.lista_atuadores_atividade[tipo_atuador][0] == Status.ON:
                            desativa = False

                if desativa:
                    with atuador.resource.request() as rq3:
                        yield rq3
                        yield self.env.timeout(random.randint(5, 30))
                        atuador.finalizar_uso(usuario_action, nome_atividade)

    def inicia_atuadores(self, lista_atuadores_atividade:dict, usuario_action: Usuario, nome_atividade:str):
        if lista_atuadores_atividade is None:
            return

        for tipo_atuador, valor in lista_atuadores_atividade.items():
            # horario_utilizacao_lampada = timedelta(hours=17, minutes=30)
            # horario_atual = Tempo.hora_atual_simulacao(self.env)
            # if tipo_atuador == "LAMPADA" and horario_atual < horario_utilizacao_lampada:
            #     continue

            if tipo_atuador in self.atuadores:
                atuador_atual = self.atuadores[self.atuadores.index(tipo_atuador)]


                usuarios_comodo = UsuariosHelp.usuarios_in_comodo(self.nome)
                usuario_prioritario = self.usuario_prioritario()
                if len(usuarios_comodo) > 1 or usuario_prioritario == usuario_action:
                    if self.nome in usuario_action.preferencia:
                        preferencia_comodo = usuario_action.preferencia[self.nome]
                        if atuador_atual.tipo in preferencia_comodo:
                            with atuador_atual.resource.request() as rq2:
                                yield rq2
                                yield self.env.timeout(5)
                                atuador_atual.mudar(usuario_action, nome_atividade=nome_atividade, **preferencia_comodo[atuador_atual.tipo])
                        else:
                            if atuador_atual.status() != valor[0]:
                                yield from self.inicio_simples(atuador_atual, usuario_action, nome_atividade)
                    else:
                        if atuador_atual.status() != valor[0]:
                            yield from self.inicio_simples(atuador_atual, usuario_action, nome_atividade)
                else:
                    if atuador_atual.status() != valor[0]:
                        yield from self.inicio_simples(atuador_atual, usuario_action, nome_atividade)

    def inicio_simples(self, atuador_atual, usuario_action, nome_atividade):
        with atuador_atual.resource.request() as rq2:
            yield rq2
            yield self.env.timeout(5)
            atuador_atual.iniciar_uso(usuario_action, nome_atividade)

    def passar(self, usuario: Usuario, distancia:int):
        with self.resource.request() as rq:
            yield rq
            self.ativa_sensor(usuario, usuario.atividade_atual.nome)
            yield self.env.timeout(distancia)
            self.desativa_sensor(usuario, usuario.atividade_atual.nome)

    def ativa_sensor(self, usuario_action, nome_atividade:str):
        if len(UsuariosHelp.name_usuarios_in_comodo(self.nome)) > 1 or self.nome == "RUA":
            return

        if "SENSOR_PRESENCA" in self.atuadores:
            atuador_atual = self.atuadores[self.atuadores.index("SENSOR_PRESENCA")]
            if atuador_atual.presence_state == Status.OFF:
                atuador_atual.iniciar_uso(usuario_action, nome_atividade)

    def desativa_sensor(self, usuario_action, nome_atividade:str):
        if len(UsuariosHelp.name_usuarios_in_comodo(self.nome)) > 1 or self.nome == "RUA":
            return

        if "SENSOR_PRESENCA" in self.atuadores:
            atuador_atual = self.atuadores[self.atuadores.index("SENSOR_PRESENCA")]
            atuador_atual.finalizar_uso(usuario_action, nome_atividade)

    def __str__(self) -> str:
        return self.nome

    def __repr__(self):
        return self.nome

    def __eq__(self, other):
        return self.nome == other

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.nome)
