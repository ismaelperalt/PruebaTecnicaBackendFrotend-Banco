package com.example.backend.dto.cuentaDTO;

import lombok.Data;



@Data
public class CuentaCreateDTO {

    private String numeroCuenta;
    private String tipoCuenta;
    private Double saldoInicial;

}
