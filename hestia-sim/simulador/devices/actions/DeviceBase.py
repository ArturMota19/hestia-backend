import hashlib
from abc import ABC, abstractmethod

import simpy

from simulador.helps.status import Status
from simulador.usuario import Usuario


class DeviceBase(ABC):
    _contador_instancias = 0

    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv: str):
        __class__._contador_instancias += 1
        self.tipo_selecionado = tipo_selecionado
        self.env = env
        self.resource = simpy.Resource(env)
        self.tipo = tipo
        self.tipoEnv = tipoEnv
        self.device = f'{nome_comodo}_{tipo}-{__class__._contador_instancias:03}'
        self.devId = f"disp{hashlib.md5(self.device.encode()).hexdigest()}"
        self.nome_comodo = nome_comodo
        self.mensagem_anteior = ""

    def __str__(self) -> str:
        return self.device

    def __repr__(self) -> str:
        return self.device

    def __eq__(self, other) -> bool:
        return self.tipo == other

    def __ne__(self, other) -> bool:
        return not self.__eq__()

    def __hash__(self) -> int:
        return hash(self.device)

    def iniciar_uso(self, usuario_action: Usuario, nome_atividade:str) -> None:
        self._ligar()
        self._mensagem(usuario_action, nome_atividade)

    def finalizar_uso(self, usuario_action: Usuario, nome_atividade:str) -> None:
        self._desligar()
        self._mensagem(usuario_action, nome_atividade)

    def compara_message(self, message: dict):
        if self.tipo_selecionado == "completo":
            for dicionario in message["status"]:
                dicionario.pop("t", None)
            message = str(message)

        if message != self.mensagem_anteior:
            self.mensagem_anteior = str(message)
            return True
        else:
            return False



    @abstractmethod
    def is_ligado(self) -> bool:
        pass

    @abstractmethod
    def _ligar(self) -> None:
        pass

    @abstractmethod
    def _desligar(self) -> None:
        pass

    @abstractmethod
    def _mensagem(self, usuario: Usuario, nome_atividade:str) -> None:
        pass

    @abstractmethod
    def status(self) -> str:
        pass

    @abstractmethod
    def mudar(self, **kwargs):
        pass


