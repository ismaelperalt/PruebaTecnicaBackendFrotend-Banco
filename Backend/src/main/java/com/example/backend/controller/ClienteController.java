package com.example.backend.controller;


import com.example.backend.dto.clienteDTO.ClienteCreateDTO;
import com.example.backend.dto.clienteDTO.ClienteResponseDTO;
import com.example.backend.dto.clienteDTO.ClienteUpdateDTO;
import com.example.backend.entity.Cliente;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private ClienteService clienteService;

    //Crear Cliente
    @PostMapping
    public ResponseEntity <ClienteResponseDTO> crear(@RequestBody ClienteCreateDTO dto){

        return  ResponseEntity.ok( clienteService.crearCliente(dto));
    }


    // Obtener clientes por id
    @GetMapping("/{id}")
    public ClienteResponseDTO obtener(@PathVariable Long id){

        return clienteService.ObtnerCliente(id);
    }

    //Obtener todos los clientes
    @GetMapping
    public List<ClienteResponseDTO>listar(){
        return  clienteService.listarClientes();
    }

    //Actulizar un cliente
    @PutMapping("/{id}")
    public ClienteResponseDTO actilizar(@PathVariable Long id, @RequestBody ClienteUpdateDTO dto){
        return clienteService.actulizarCliente(id,dto);

    }

    // Eliminar cliente (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }




}
