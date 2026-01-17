package com.example.backend.service;

import com.example.backend.dto.clienteDTO.ClienteCreateDTO;
import com.example.backend.dto.clienteDTO.ClienteResponseDTO;
import com.example.backend.dto.clienteDTO.ClienteUpdateDTO;
import com.example.backend.entity.Cliente;
import com.example.backend.mapper.ClienteMapper;
import com.example.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository  clienteRepository;


    //Crear un Cliente
    public ClienteResponseDTO crearCliente(ClienteCreateDTO dto){

        if(clienteRepository.existsByidentificacion(dto.getIdentificacion())){
            throw  new RuntimeException("Existe un registro con esta identificacion");

        }

        Cliente cliente= ClienteMapper.toEntity(dto);

        Cliente guardado = clienteRepository.save(cliente);

        return ClienteMapper.ToResponseDTO(guardado);
    }

    //Obtner cliente por id
    public ClienteResponseDTO ObtnerCliente(Long id){
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Cliente no encontrado"));
    return  ClienteMapper.ToResponseDTO(cliente);
    }

    //Listar todos los clientes
    public List<ClienteResponseDTO> listarClientes(){
        return clienteRepository.findAll()
                .stream()
                .map(ClienteMapper ::ToResponseDTO)
                .toList();
    }

    //Actulizar un cliente
    public ClienteResponseDTO actulizarCliente(Long id, ClienteUpdateDTO dto){
        Cliente cliente= clienteRepository.findById(id).orElseThrow(()->new RuntimeException("Cliente no encontrado"));



        cliente.setNombre(dto.getNombre());
        cliente.setGenero(dto.getGenero());
        cliente.setEdad(dto.getEdad());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEstado(dto.getEstado());
        return ClienteMapper.ToResponseDTO(clienteRepository.save(cliente));
    }

    //Eliminar un cliente

    public void eliminarCliente(Long id){
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setEstado(false);
        clienteRepository.save(cliente);
    }


}
