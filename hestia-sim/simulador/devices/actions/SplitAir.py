from simulador.devices.actions.DeviceBase import DeviceBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import ModeAir, Status
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class SplitAir(DeviceBase):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "s45f3s6f890sdfs876f8sd7d"
        self.switch = Status.OFF
        self.temp_set = 23
        self.mode = ModeAir.AUTO

    def _desligar(self) -> None:
        self.switch = Status.OFF

    def _ligar(self) -> None:
        self.switch = Status.ON

    def is_ligado(self) -> bool:
        return self.switch == Status.ON

    def mudar_temperatura(self, valor: int, usuario_action: Usuario, nome_atividade: str) -> None:
        self.temp_set = self._limite_entrada(valor)
        self._mensagem(usuario_action, nome_atividade)

    def mudar_modo(self, valor: ModeAir, usuario_action: Usuario, nome_atividade: str) -> None:
        self.mode = valor
        self._mensagem(usuario_action, nome_atividade)

    def _limite_entrada(self, value: int):
        if value > 30:
            value = 30
        elif value < 16:
            value = 16
        return value

    def mudar(self, usuario_action: Usuario, switch: str, temp_set: int, mode: str, nome_atividade: str):
        self.switch = Status[switch]
        self.temp_set = self._limite_entrada(temp_set)
        self.mode = ModeAir[mode]

        self._mensagem(usuario_action, nome_atividade)

    def _mensagem(self, usuario: Usuario, nome_atividade: str):
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "switch",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.switch.value
                },
                {
                    "code": "temp_set",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.temp_set
                },
                {
                    "code": "mode",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.mode.value
                }
            ]
            }
        else:
            mensagem = self.switch.value

        if self.compara_message(mensagem):
            GravarDados.envia_dados(self.device, self.devId, self.productKey, mensagem, self.tipoEnv, usuario.nome,
                                    nome_atividade,
                                    Tempo.data_atual_simulacao_formatado(self.env), self.nome_comodo)

    def iniciar_uso(self, usuario_action: Usuario, atividade: str) -> None:
        self._ligar()
        self._mensagem(usuario_action, atividade)

    def finalizar_uso(self, usuario_action: Usuario, atividade: str) -> None:
        self._desligar()
        self._mensagem(usuario_action, atividade)

    def status(self) -> str:
        return self.switch.value
