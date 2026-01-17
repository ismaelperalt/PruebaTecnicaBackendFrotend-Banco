package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table( name = "clientes")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Cliente extends Persona{

    private String contrasena;
    private Boolean estado;

}
