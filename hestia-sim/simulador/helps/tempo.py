from datetime import date, datetime, timedelta
from random import randrange

from simpy import Environment


class Tempo:
    data_inicio = None

    @staticmethod
    def data_inicio_simulacao(dias: int) -> datetime:
        data_hoje = date.today()
        __class__.data_inicio = datetime(data_hoje.year, data_hoje.month, data_hoje.day) - timedelta(days=dias)
        return __class__.data_inicio

    @staticmethod
    def data_atual_simulacao(env: Environment):
        return __class__.data_inicio + timedelta(seconds=env.now)

    @staticmethod
    def data_atual_simulacao_segundos(env: Environment):
        data = __class__.data_inicio + timedelta(seconds=env.now)
        return datetime.timestamp(data)

    @staticmethod
    def data_atual_simulacao_formatado(env: Environment):
        return (__class__.data_inicio + timedelta(seconds=env.now)).strftime('%Y-%m-%d %H:%M:%S') + f".{randrange(1000000):06}"

    @staticmethod
    def hora_atual_simulacao(env: Environment) -> timedelta:
        return timedelta(seconds=env.now) % timedelta(seconds=86400)

    @staticmethod
    def dia_da_semana(segunto: int) ->int:
        return (__class__.data_inicio + timedelta(seconds=segunto)).weekday()
