package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
@MappedSuperclass
@Data
public  abstract class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String genero;
    private Integer edad;
    @Column(unique = true, nullable = false)
    private String identificacion;
    private String direccion;
    private String telefono;

}
