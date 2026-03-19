package com.backend.app.finanza.model;

import java.math.BigDecimal;

public enum ReceiptType {

    FACTURA_A(1, "Factura A", true, Sign.POSITIVE),
    NOTA_CREDITO_A(3, "Nota de Crédito A", true, Sign.NEGATIVE),

    FACTURA_B(6, "Factura B", false, Sign.POSITIVE),
    NOTA_CREDITO_B(8, "Nota de Crédito B", false, Sign.NEGATIVE),

    FACTURA_C(11, "Factura C", false, Sign.POSITIVE),
    NOTA_CREDITO_C(13, "Nota de Crédito C", false, Sign.NEGATIVE);

    private final int afipCode;
    private final String description;
    private final boolean discriminatesVat;
    private final Sign sign;

    ReceiptType(int afipCode, String description, boolean discriminatesVat, Sign sign) {
        this.afipCode = afipCode;
        this.description = description;
        this.discriminatesVat = discriminatesVat;
        this.sign = sign;
    }

    public int getAfipCode() {
        return afipCode;
    }

    public boolean discriminatesVat() {
        return discriminatesVat;
    }

    public boolean isCreditNote() {
        return sign == Sign.NEGATIVE;
    }

    public BigDecimal applySign(BigDecimal amount) {
        return sign == Sign.NEGATIVE ? amount.negate() : amount;
    }

    enum Sign {
        POSITIVE, NEGATIVE
    }
}