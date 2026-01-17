package com.example.backend.dto.clienteDTO;

import lombok.Data;

@Data
public class ClienteUpdateDTO {
    private String nombre;
    private String genero;
    private Integer edad;
    private String direccion;
    private String telefono;
    private Boolean estado;
}