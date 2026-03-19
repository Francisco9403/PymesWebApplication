package com.backend.app.finanza.format;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class AfipFormatUtil {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    public static String formatFecha(LocalDate fecha) {
        return fecha.format(DATE_FORMAT);
    }

    public static String padLeftZeros(String value, int length) {
        return String.format("%" + length + "s", value).replace(' ', '0');
    }

    public static String padRightSpaces(String value, int length) {
        return String.format("%-" + length + "s", value);
    }

    public static String formatNumero(long value, int length) {
        return padLeftZeros(String.valueOf(value), length);
    }

    public static String formatImporte(BigDecimal value, int length) {
        if (value == null) value = BigDecimal.ZERO;

        BigDecimal scaled = value.setScale(2, RoundingMode.HALF_UP)
                                 .movePointRight(2); // elimina decimal

        return padLeftZeros(scaled.toBigInteger().toString(), length);
    }

    public static String formatTipoCambio(BigDecimal value) {
        if (value == null) value = BigDecimal.ONE;

        BigDecimal scaled = value.setScale(6, RoundingMode.HALF_UP)
                                 .movePointRight(6);

        return padLeftZeros(scaled.toBigInteger().toString(), 10);
    }
}