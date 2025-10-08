from simulador.devices.actions.DeviceBase import DeviceBase
from simulador.helps.gravar_dados import GravarDados
from simulador.helps.status import Status
from simulador.helps.tempo import Tempo
from simulador.usuario import Usuario


class LightBulbAction(DeviceBase):

    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
        self.productKey = "435a6fsdfsdfs879s9fs7"
        self.switch_led = Status.OFF
        self.bright_value_v2 = 1000
        self.temp_value_v2 = 500

    def _desligar(self) -> None:
        self.switch_led = Status.OFF

    def _ligar(self) -> None:
        self.switch_led = Status.ON

    def is_ligado(self) -> bool:
        return self.switch_led == Status.ON

    def mudar_tempoeratura(self, value: int, usuario_action: Usuario, nome_atividade: str) -> None:
        self.temp_value_v2 = self._limite_entrada(value)
        self._mensagem(usuario_action, nome_atividade)

    def mudar_brilho(self, value: int, usuario_action: Usuario, nome_atividade: str) -> None:
        self.bright_value_v = self._limite_entrada(value)
        self._mensagem(usuario_action, nome_atividade)

    def mudar(self, usuario_action: Usuario, switch_led: str, temp_value_v2: int, bright_value_v2: int,
              nome_atividade: str):
        self.switch_led = Status[switch_led]
        self.temp_value_v2 = self._limite_entrada(temp_value_v2)
        self.bright_value_v2 = self._limite_entrada(bright_value_v2)
        self._mensagem(usuario_action, nome_atividade)

    def _limite_entrada(self, value: int) -> int:
        if value > 1000:
            value = 1000
        elif value < 0:
            value = 0
        return value

    def _mensagem(self, usuario: Usuario, nome_atividade: str) -> None:
        if self.tipo_selecionado == "completo":
            mensagem = {"status": [
                {
                    "code": "switch_led",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.switch_led.value
                },
                {
                    "code": "bright_value_v2",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.bright_value_v2
                },
                {
                    "code": "temp_value_v2",
                    "t": Tempo.data_atual_simulacao_segundos(self.env),
                    "value": self.temp_value_v2
                }
            ]
            }
        else:
            mensagem = self.switch_led.value

        if self.compara_message(mensagem):
            GravarDados.envia_dados(self.device, self.devId, self.productKey, mensagem, self.tipoEnv, usuario.nome,
                                    nome_atividade,
                                    Tempo.data_atual_simulacao_formatado(self.env), self.nome_comodo)

    def status(self) -> str:
        return self.switch_led.value
