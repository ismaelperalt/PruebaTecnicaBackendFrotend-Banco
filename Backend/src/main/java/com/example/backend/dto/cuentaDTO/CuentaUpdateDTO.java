package com.example.backend.dto.cuentaDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CuentaUpdateDTO {
    private String tipoCuenta;
    private Boolean estado;
    private Double saldoInicial;
}
