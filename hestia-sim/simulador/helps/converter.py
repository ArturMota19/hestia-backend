
class Converter:
    @staticmethod
    def convert(seconds: int) -> str:
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return "%02d:%02d:%02d" % (hour, minutes, seconds)

    @staticmethod
    def segundos_para_dias(seconds: int) -> int:
        return seconds // 86400

    @staticmethod
    def dias_para_segundos(dias: int) -> int:
        return dias * 86400

    @staticmethod
    def minutos_para_segundos(minutos: int) -> int:
        return minutos * 60



