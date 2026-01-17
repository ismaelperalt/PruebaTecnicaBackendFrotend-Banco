package com.example.backend.mapper;

import com.example.backend.dto.clienteDTO.ClienteCreateDTO;
import com.example.backend.dto.clienteDTO.ClienteResponseDTO;
import com.example.backend.entity.Cliente;

public class ClienteMapper {


    public static Cliente toEntity(ClienteCreateDTO request) {
        Cliente cliente = new Cliente();

        cliente.setNombre(request.getNombre());
        cliente.setGenero(request.getGenero());
        cliente.setEdad(request.getEdad());
        cliente.setIdentificacion(request.getIdentificacion());
        cliente.setDireccion(request.getDireccion());
        cliente.setTelefono(request.getTelefono());

        cliente.setContrasena(request.getContrasena());
        cliente.setEstado(true);

        return  cliente;

    }

    public static ClienteResponseDTO ToResponseDTO(Cliente cliente){

        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setGenero(cliente.getGenero());
        dto.setEdad(cliente.getEdad());
        dto.setIdentificacion(cliente.getIdentificacion());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setEstado(cliente.getEstado());
        return  dto;
    }


}
