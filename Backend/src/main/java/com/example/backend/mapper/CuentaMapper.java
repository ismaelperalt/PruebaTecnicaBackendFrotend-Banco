package com.example.backend.mapper;

import com.example.backend.dto.cuentaDTO.CuentaCreateDTO;
import com.example.backend.dto.cuentaDTO.CuentaResponseDTO;
import com.example.backend.entity.Cuenta;

public class CuentaMapper {

    public static Cuenta toEntity(CuentaCreateDTO request){
        Cuenta cuenta = new Cuenta();
        cuenta.setNumeroCuenta(request.getNumeroCuenta());
        cuenta.setTipoCuenta(request.getTipoCuenta());
        cuenta.setSaldoInicial(request.getSaldoInicial());
        return  cuenta;

    }

    public static CuentaResponseDTO toDTO(Cuenta cuenta){
        CuentaResponseDTO dto = new CuentaResponseDTO();
        dto.setId(cuenta.getId());
        dto.setNumeroCuenta(cuenta.getNumeroCuenta());
        dto.setTipoCuenta(cuenta.getTipoCuenta());
        dto.setSaldoInicial(cuenta.getSaldoInicial());
        dto.setClienteId(cuenta.getCliente().getId());
        dto.setClienteNombre(cuenta.getCliente().getNombre());
        dto.setEstado(cuenta.getEstado());
        return  dto;

    }
}
