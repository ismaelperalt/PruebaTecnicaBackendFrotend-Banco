package com.example.backend.dto.cuentaDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CuentaResponseDTO {
    private Long id;
    private String numeroCuenta;
    private String tipoCuenta;
    private Double saldoInicial;
    private Boolean estado;
    private Long clienteId;
    private String clienteNombre;


}
