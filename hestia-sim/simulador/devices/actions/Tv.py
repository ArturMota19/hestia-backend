from simulador.devices.actions.DeviceBase import DeviceBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class Tv(DeviceBase):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "9s87f98s79s87df98d7f98d"
        self.switch = Status.OFF
        self.sound_volume = 20

    def _ligar(self) -> None:
        self.switch = Status.ON

    def _desligar(self) -> None:
        self.switch = Status.OFF

    def is_ligado(self) -> bool:
        return self.switch == Status.ON

    def mudar_volume(self, valor: int, usuario_action: Usuario, nome_atividade:str) -> None:
        self.sound_volume = self._limite_entrada(valor)
        self._mensagem(usuario_action, nome_atividade)

    def mudar(self, usuario_action: Usuario, switch: str, sound_volume: int, nome_atividade: str):
        self.switch = Status[switch]
        self.sound_volume = self._limite_entrada(sound_volume)
        self._mensagem(usuario_action, nome_atividade)

    def _limite_entrada(self, value: int):
        if value > 100:
            value = 100
        elif value < 0:
            value = 0
        return value

    def _mensagem(self, usuario: Usuario, nome_atividade: str) -> None:
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "switch",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.switch.value
                },
                {
                    "code": "sound_volume",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.sound_volume
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
