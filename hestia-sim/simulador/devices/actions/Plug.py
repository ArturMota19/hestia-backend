from simulador.devices.actions.DeviceBase import DeviceBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class Plug(DeviceBase):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "3s2d1f0sdf1sdf18s79sddf"
        self.switch_1 = Status.OFF

    def _ligar(self) -> None:
        self.switch_1 = Status.ON

    def _desligar(self) -> None:
        self.switch_1 = Status.OFF

    def is_ligado(self) -> bool:
        return self.switch_1 == Status.ON

    def mudar(self, usuario_action: Usuario, switch: str, nome_atividade: str):
        self.switch_1 = Status[switch]
        self._mensagem(usuario_action, nome_atividade)

    def _mensagem(self, usuario: Usuario, nome_atividade: str) -> None:
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "switch_1",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.switch_1.value
                }
            ]
            }
        else:
            mensagem = self.switch_1.value

        if self.compara_message(mensagem):
            GravarDados.envia_dados(self.device, self.devId, self.productKey, mensagem, self.tipoEnv, usuario.nome,
                                    nome_atividade,
                                    Tempo.data_atual_simulacao_formatado(self.env), self.nome_comodo)

    def status(self) -> str:
        return self.switch_1.value
