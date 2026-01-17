package com.example.backend.dto.clienteDTO;

import lombok.Data;

@Data
public class ClienteCreateDTO {
    private String nombre;
    private String genero;
    private Integer edad;
    private String identificacion;
    private String direccion;
    private String telefono;
    private String contrasena;
}
