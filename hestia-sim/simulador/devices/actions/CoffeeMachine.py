from simulador.devices.actions.DeviceBase import DeviceBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class CoffeeMachine(DeviceBase):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "98s7f076sf67s5adf7s5f7s"
        self.switch = Status.OFF

    def _ligar(self) -> None:
        self.switch = Status.ON

    def _desligar(self) -> None:
        self.switch = Status.OFF

    def is_ligado(self) -> bool:
        return self.switch == Status.ON

    def mudar(self, usuario_action: Usuario, switch: str, nome_atividade: str):
        self.switch = Status[switch]
        self._mensagem(usuario_action, nome_atividade)

    def _mensagem(self, usuario: Usuario, nome_atividade: str) -> None:
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "switch",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.switch.value
                }
            ]
            }
        else:
            mensagem = self.switch.value

        if self.compara_message(mensagem):
            GravarDados.envia_dados(self.device, self.devId, self.productKey, mensagem, self.tipoEnv, usuario.nome,
                                    nome_atividade,
                                    Tempo.data_atual_simulacao_formatado(self.env), self.nome_comodo)

    def status(self) -> str:
        return self.switch.value
