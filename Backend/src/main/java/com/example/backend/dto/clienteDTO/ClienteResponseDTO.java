package com.example.backend.dto.clienteDTO;

import lombok.Data;

@Data
public class ClienteResponseDTO {

    private Long id;
    private String nombre;
    private String genero;
    private Integer edad;
    private String identificacion;
    private String telefono;
    private String direccion;

    private Boolean estado;

}
