import simpy

from simulador.atividade import Atividade
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status
from simulador.helps.tempo import Tempo


# from GravarDados import GravarDados
# from Help import Tempo
# from Status import Status
# from UsuariosHelp import UsuariosHelp


class Atuador:
    _contador_instancias = 0

    def __init__(self, env, comodo, tipo):
        __class__._contador_instancias += 1
        self.env = env
        self.resource = simpy.Resource(env)
        self.tipo = tipo
        self.device = f'{comodo}_{tipo}-{__class__._contador_instancias:03}'
        self.status = Status.OFF

    # def usar(self, tempoUtilizacao, userAction, grupo):
    #     with self.resource.request() as rq:
    #         yield rq
    #         self.iniciar_uso(self.env.now, userAction, grupo)
    #         yield self.env.timeout(tempoUtilizacao)
    #         self.finalizar_uso(self.env.now, userAction, grupo)

    def iniciar_uso(self, userAction, atividade:str):
        self.status = Status.ON
        self._completa_mensagem(userAction, atividade)

    def finalizar_uso(self, userAction, atividade: str):
        self.status = Status.OFF
        self._completa_mensagem(userAction, atividade)

    def _muda_status(self):
        if self.status == Status.OFF:
            self.status = Status.ON
        else:
            self.status = Status.OFF

    def _completa_mensagem(self, usuario, atividade:str):
        GravarDados.envia_dados(self.device, self.status, self.tipo, usuario.nome,atividade, Tempo.data_atual_simulacao(self.env))

    def is_ligado(self):
        return self.status == Status.ON

    def __str__(self):
        return self.device

    def __repr__(self):
        return self.device

    def __eq__(self, other):
        return self.tipo == other

    def __ne__(self, other):
        return not self.__eq__()

    def __hash__(self):
        return hash(self.device)
