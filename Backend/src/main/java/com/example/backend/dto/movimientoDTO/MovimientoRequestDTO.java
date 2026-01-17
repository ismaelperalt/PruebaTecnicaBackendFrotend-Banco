package com.example.backend.dto.movimientoDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MovimientoRequestDTO {
    private String numeroCuenta;
    private Double valor;
}
