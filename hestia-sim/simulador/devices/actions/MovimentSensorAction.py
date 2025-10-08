from simulador.devices.actions.SensorBase import SensorBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status, HumanMotion
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class MovimentSensorAction(SensorBase):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "0s9d8f9s0d8f0s9df8s0f8"
        self.presence_state = Status.OFF
        self.human_motion_state = HumanMotion.NONE

    def _desligar(self) -> None:
        self.presence_state = Status.OFF
        self.human_motion_state = HumanMotion.NONE

    def _ligar(self):
        self.presence_state = Status.ON
        self.human_motion_state = HumanMotion.LARGER_MOVE

    def is_ligado(self) -> bool:
        return self.presence_state == Status.ON

    def _mensagem(self, usuario: Usuario, nome_atividade: str) -> None:
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "presence_state",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.presence_state.value
                },
                {
                    "code": "human_motion_state",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.human_motion_state.value
                }
            ]
            }
        else:
            mensagem = self.presence_state.value

        if self.compara_message(mensagem):
            GravarDados.envia_dados(self.device, self.devId, self.productKey, mensagem, self.tipoEnv, usuario.nome,
                                    nome_atividade,
                                    Tempo.data_atual_simulacao_formatado(self.env), self.nome_comodo)

    def mudar(self, **kwargs):
        pass

    def status(self) -> str:
        return self.presence_state.value
